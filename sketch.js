// sketch.js

// ─────────────────────────────────────────────────────────────────────────────
// MAIN P5.JS FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

let frontSpriteCache = {};
let backSpriteCache = {};
let loading = true;
let assetsToLoad = 0;
let assetsLoaded = 0;

function preload() {
  bg = loadImage('bg.png');
  gameboyFont = loadFont('pokemon-gsc-font.ttf');
  pokemonList = loadJSON('pokemonList.json');
}

function setup() {
  pixelDensity(1);
  createCanvas(320, 288);
  noSmooth();
  textFont(gameboyFont);
  textAlign(CENTER, CENTER);

  if (!Array.isArray(pokemonList)) {
    pokemonList = Object.values(pokemonList);
  }

  // Preload all Pokémon sprites (front and back) after pokemonList is loaded
  assetsToLoad = 0;
  assetsLoaded = 0;
  for (let p of pokemonList) {
    if (p.file) {
      assetsToLoad += 2;
      frontSpriteCache[p.file] = loadImage(
        'front/' + p.file,
        () => { assetsLoaded++; checkAllAssetsLoaded(); },
        () => { assetsLoaded++; checkAllAssetsLoaded(); }
      );
      backSpriteCache[p.file] = loadImage(
        'back/' + p.file,
        () => { assetsLoaded++; checkAllAssetsLoaded(); },
        () => { assetsLoaded++; checkAllAssetsLoaded(); }
      );
    }
  }

  // Draw static background/UI layer once
  staticLayer = createGraphics(320, 288);
  staticLayer.image(bg, 0, 0, 320, 288);
  // Add any other static UI elements here if needed

  // Don't start battle until all assets loaded
  loading = true;
}

function checkAllAssetsLoaded() {
  if (assetsLoaded >= assetsToLoad) {
    loading = false;
    startNewBattle();
    // Force redraw of all dynamic elements on first frame
    lastDrawnTime = null;
    lastDrawnFrontName = null;
    lastDrawnBackName = null;
    lastDrawnHpFront = null;
    lastDrawnHpBack = null;
  }
}

function draw() {
  if (loading) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text('Loading…', width / 2, height / 2);
    return;
  }
  // Draw cached static layer
  image(staticLayer, 0, 0);

  // Only redraw dynamic elements
  drawBattleScreenOptimized();

  // Check if it's time for an automatic turn
  if (battleActive && !processingBattleEnd && !turnLock && millis() - lastTurnTime > TURN_INTERVAL) {
    takeTurn();
    lastTurnTime = millis();
  }
}

function mouseClicked() {
  // A click anywhere will now only attempt to trigger the next turn in the battle
  if (battleActive && !processingBattleEnd && !turnLock) {
    takeTurn();
    lastTurnTime = millis();
  }
}