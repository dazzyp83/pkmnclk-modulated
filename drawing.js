// drawing.js

// ─────────────────────────────────────────────────────────────────────────────
// DRAWING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// Optimized: Only redraw dynamic elements, cache text and HP bar values
function drawBattleScreenOptimized() {
  let currentFrontSpriteDrawX = FRONT_SPRITE_BASE_X;
  let currentBackSpriteDrawX = BACK_SPRITE_BASE_X;

  if (isAnimatingAttack) {
    let elapsedTime = millis() - attackAnimationStartTime;
    if (elapsedTime < ATTACK_ANIMATION_DURATION) {
      // Use integer math for progress and offset
      let progress = Math.floor((elapsedTime * 1000) / ATTACK_ANIMATION_DURATION) / 1000;
      let offset = Math.round(Math.sin(progress * Math.PI) * ATTACK_LUNGE_OFFSET);
      if (attackingPokemon === 'front') {
        currentFrontSpriteDrawX -= offset;
      } else if (attackingPokemon === 'back') {
        currentBackSpriteDrawX += offset;
      }
      if (!hitAnimationTriggered && progress >= 0.4 && progress <= 0.6) {
        isAnimatingHit = true;
        hitAnimationStartTime = millis();
        hitAnimationTriggered = true;
      }
    } else {
      isAnimatingAttack = false;
      attackingPokemon = null;
      hitAnimationTriggered = false;
    }
  }


  // Draw names, HP bars, and clock first
  drawNames();
  drawHp();
  if (showTime) {
    drawClock();
  }

  // Now draw Pokémon sprites on top of text
  updateAndDrawSprites(currentFrontSpriteDrawX, currentBackSpriteDrawX);

  if (winner && millis() - winnerDisplayTime < WINNER_DISPLAY_DURATION) {
    let elapsedTime = millis() - winnerDisplayTime;
    let flashOn = (elapsedTime % (2 * WINNER_FLASH_INTERVAL)) < WINNER_FLASH_INTERVAL;
    if (flashOn) {
      drawWinnerText();
    }
    animateWinnerHp();
    showTime = false;
  } else {
    showTime = true;
  }
}


function updateAndDrawSprites(currentFrontSpriteDrawX, currentBackSpriteDrawX) {
  // Front sprite slide animation logic (integer math)
  if (frontTransitionPhase === 'exiting') {
    let elapsedTime = millis() - frontTransitionStartTime;
    let progress = Math.min(Math.max(Math.floor((elapsedTime * 1000) / FRONT_TRANSITION_DURATION) / 1000, 0), 1);
    let newY = Math.round(lerp(FRONT_SPRITE_BASE_Y, -FRONT_SPRITE_H, progress));
    if (frontCurrentY !== newY) frontCurrentY = newY;
  } else if (frontTransitionPhase === 'entering') {
    let elapsedTime = millis() - frontTransitionStartTime;
    let progress = Math.min(Math.max(Math.floor((elapsedTime * 1000) / FRONT_TRANSITION_DURATION) / 1000, 0), 1);
    let newY = Math.round(lerp(-FRONT_SPRITE_H, FRONT_SPRITE_BASE_Y, progress));
    if (frontCurrentY !== newY) frontCurrentY = newY;
    if (progress === 1) frontTransitionPhase = 'idle';
  }

  // Back sprite slide animation logic (integer math)
  if (backTransitionPhase === 'exiting') {
    let elapsedTime = millis() - backTransitionStartTime;
    let progress = Math.min(Math.max(Math.floor((elapsedTime * 1000) / BACK_TRANSITION_DURATION) / 1000, 0), 1);
    let newX = Math.round(lerp(BACK_SPRITE_BASE_X, -BACK_SPRITE_W, progress));
    if (backCurrentX !== newX) backCurrentX = newX;
  } else if (backTransitionPhase === 'entering') {
    let elapsedTime = millis() - backTransitionStartTime;
    let progress = Math.min(Math.max(Math.floor((elapsedTime * 1000) / BACK_TRANSITION_DURATION) / 1000, 0), 1);
    let newX = Math.round(lerp(-BACK_SPRITE_W, BACK_SPRITE_BASE_X, progress));
    if (backCurrentX !== newX) backCurrentX = newX;
    if (progress === 1) backTransitionPhase = 'idle';
  }

    let drawFront = true;
    let drawBack = true;

    if (isAnimatingHit) {
        let hitElapsedTime = millis() - hitAnimationStartTime;
        if (hitElapsedTime < HIT_ANIMATION_DURATION) {
            if (floor(hitElapsedTime / FLASH_INTERVAL) % 2 === 1) {
                if (defendingPokemon === 'front') drawFront = false;
                else drawBack = false;
            }
        } else {
            isAnimatingHit = false;
        }
    }

  blendMode(BLEND);
  // Ensure backSprite is valid and loaded
  if ((!backSprite || !backSprite.width) && backPokemonData && backPokemonData.file && backSpriteCache[backPokemonData.file]) {
    backSprite = backSpriteCache[backPokemonData.file];
  }
  if (backSprite && backSprite.width && drawBack) {
    image(backSprite, backCurrentX + (currentBackSpriteDrawX - BACK_SPRITE_BASE_X), BACK_SPRITE_BASE_Y, BACK_SPRITE_W, BACK_SPRITE_H);
  }
  // Ensure frontSprite is valid and loaded
  if ((!frontSprite || !frontSprite.width) && frontPokemonData && frontPokemonData.file && frontSpriteCache[frontPokemonData.file]) {
    frontSprite = frontSpriteCache[frontPokemonData.file];
  }
  if (frontSprite && frontSprite.width && drawFront) {
    image(frontSprite, currentFrontSpriteDrawX, frontCurrentY, FRONT_SPRITE_W, FRONT_SPRITE_H);
  }
}

function drawNames() {
  // Clear previous name areas (white rectangles)
  noStroke();
  fill(255);
  rect(FRONT_NAME_START_X - 2, FRONT_NAME_Y - 2, (FRONT_NAME_END_X - FRONT_NAME_START_X) + 4, HP_LABEL_TEXT_SIZE + 4);
  rect(BACK_NAME_END_X - 80, BACK_NAME_Y - 2, 82, HP_LABEL_TEXT_SIZE + 4);

  textSize(HP_LABEL_TEXT_SIZE);
  fill(0);
  noStroke();

  textAlign(LEFT, TOP);
  let s = frontName || '';
  const maxW = (FRONT_NAME_END_X - FRONT_NAME_START_X);
  while (textWidth(s) > maxW && s.length) {
    s = s.slice(0, -1);
  }
  text(s, FRONT_NAME_START_X, FRONT_NAME_Y);

  textAlign(RIGHT, TOP);
  text(backName || '', BACK_NAME_END_X, BACK_NAME_Y);
}

function drawHp() {
  drawHpBar(FRONT_HP_BAR_X, FRONT_HP_BAR_Y, HP_BAR_W, HP_BAR_H, hpFront);
  drawHpBar(BACK_HP_BAR_X, BACK_HP_BAR_Y, HP_BAR_W, HP_BAR_H, hpBack);
}

function drawHpBar(x, y, w, h, pct) {
  // Clear previous HP bar area (white rectangle)
  noStroke();
  fill(255);
  rect(x - 1, y - 1, w + 2, h + 2);

  pct = constrain(pct, 0, 1);
  noStroke();
  fill(100);
  rect(x, y, Math.round(pct * w), h, HP_BAR_RADIUS);
  noFill();
  stroke(0);
  strokeWeight(1);
  rect(x, y, w, h, HP_BAR_RADIUS);
}

function drawClock() {
  // Draw new time directly over background
  textSize(CLOCK_TEXT_SIZE);
  textAlign(CENTER, CENTER);
  fill(0);
  const hrs = nf(hour(), 2);
  const mins = nf(minute(), 2);
  text(`${hrs}:${mins}`, CLOCK_X_POS, CLOCK_Y_POS);
}

function drawWinnerText() {
  if (!winner) return;

  // Clear previous winner text area (white rectangle)
  noStroke();
  fill(255);
  rect(WINNER_TEXT_X - 80, WINNER_TEXT_Y - 8, 160, WINNER_TEXT_LINE_HEIGHT * 2 + 8);

  textSize(WINNER_TEXT_SIZE);
  textAlign(CENTER, CENTER);
  fill(0);
  noStroke();

  text(winner.name.toUpperCase(), WINNER_TEXT_X, WINNER_TEXT_Y);
  text("WINS!", WINNER_TEXT_X, WINNER_TEXT_Y + WINNER_TEXT_LINE_HEIGHT);
}

function animateWinnerHp() {
  let elapsedTime = millis() - winnerDisplayTime;
  // Use integer math for fill percentage
  let fillPercentage = winnerHpFillStart + ((elapsedTime * (1 - winnerHpFillStart)) / WINNER_DISPLAY_DURATION);
  fillPercentage = Math.min(Math.max(fillPercentage, 0), 1);

  if (lastWinnerPosition === 'front' && hpFront !== fillPercentage) {
    hpFront = fillPercentage;
  } else if (lastWinnerPosition === 'back' && hpBack !== fillPercentage) {
    hpBack = fillPercentage;
  }
}
