// sketch.js

// ─────────────────────────────────────────────────────────────────────────────
// MAIN P5.JS FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function preload() {
  bg = loadImage('bg.png');
  gameboyFont = loadFont('pokemon-gsc-font.ttf');
  pokemonList = loadJSON('pokemonList.json');
}

function setup() {
  pixelDensity(1);
  createCanvas(CANVAS_WIDTH * DISPLAY_ZOOM_FACTOR, CANVAS_HEIGHT * DISPLAY_ZOOM_FACTOR);
  noSmooth();
  textFont(gameboyFont);
  textAlign(CENTER, CENTER);
  
  if (!Array.isArray(pokemonList)) {
    pokemonList = Object.values(pokemonList);
  }
  
  startNewBattle();
}

function draw() {
  background(0);

  push();
  scale(DISPLAY_ZOOM_FACTOR);

  switch (currentScreen) {
    case 'battle':
      drawBattleScreen();
      break;
    case 'day':
      drawDayScreen();
      break;
  }

  pop();
  
  if (battleActive && !processingBattleEnd && !turnLock && millis() - lastTurnTime > TURN_INTERVAL) {
    takeTurn();
    lastTurnTime = millis();
  }
}

function mouseClicked() {
  if (currentScreen === 'battle') {
    if (battleActive && !processingBattleEnd && !turnLock) {
      takeTurn();
      lastTurnTime = millis();
    } else {
        currentScreen = 'day';
    }
  } else if (currentScreen === 'day') {
    currentScreen = 'battle';
  }
}
