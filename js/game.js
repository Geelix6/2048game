import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

let hammer;
const gameBoard = document.querySelector(".game-board");
const sideLength = localStorage.getItem("2048game_side-length") ?? 4;
const grid = new Grid(gameBoard, sideLength);
document.querySelector(":root").style.setProperty("--side-length", sideLength);

const isSavedGame = !!localStorage.getItem("2048game_tile0");
if (isSavedGame) {
  loadSavedGame();
  setupInputOnce();
  initTouch();
} else {
  startNewGame();
}

loadBestScoreFromLocalStorage();
loadColorsFromLocalStorage();

document.querySelector(".game-wrapper").style.display = "flex";
const currentGameSize = document.querySelector(`.settings-game-field-choice[value="${sideLength}"]`);
currentGameSize.setAttribute("checked", true);

function startNewGame() {
  document.querySelector(".game-score").textContent = 0;
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  setupInputOnce();
  initTouch();
}

function setupInputOnce() {
  window.addEventListener("keydown", handleInput, { once: true });
}

function initTouch() {
  document.addEventListener("dblclick", (event) => {
    event.preventDefault();
  });

  hammer = new Hammer(document.querySelector(".game-board"));
  hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });

  setupTouchOnce();
}

function setupTouchOnce() {
  hammer.on("panstart", handleInput);
}

async function handleInput(e) {
  const allowedActions = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "panup", "pandown", "panright", "panleft"];
  if (!allowedActions.includes(e.key) && !allowedActions.includes(e.additionalEvent)) {
    setupInputOnce();
    return;
  }

  if (e.key == "ArrowUp" || e.additionalEvent == "panup") {
    if (!canMoveUp()) {
      setupInputOnce();
      return;
    }
    await moveUp();
  }

  if (e.key == "ArrowDown" || e.additionalEvent == "pandown") {
    if (!canMoveDown()) {
      setupInputOnce();
      return;
    }
    await moveDown();
  }

  if (e.key == "ArrowRight" || e.additionalEvent == "panright") {
    if (!canMoveRight()) {
      setupInputOnce();
      return;
    }
    await moveRight();
  }

  if (e.key == "ArrowLeft" || e.additionalEvent == "panleft") {
    if (!canMoveLeft()) {
      setupInputOnce();
      return;
    }
    await moveLeft();
  }

  settingsMenu.classList.contains("settings-menu--open") && forsedCloseSettings();

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);
  setupInputOnce();

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd();
    alert(
      `Game Over! Your Score is ${
        document.querySelector(".game-score").textContent
      }\nRestart the game and try to beat it!`
    );
    return;
  }

  saveTilesToLocalStorage();
}

async function moveUp() {
  await slideTiles(grid.cellsGrouppedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGrouppedByReversedColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGrouppedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGrouppedByReversedRow);
}

async function slideTiles(grouppedCells) {
  const promises = [];
  grouppedCells.forEach((group) => slideTilesInGroup(group, promises));
  await Promise.all(promises);

  grid.cells.forEach((cell) => {
    if (cell.hasTileForMerge()) {
      cell.mergeTiles();
      cell.changeGameScore();
    }
  });
}

function slideTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) continue;

    const cellWithTile = group[i];
    let targetCell;
    let j = i - 1;

    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) continue;

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

function canMoveUp() {
  return canMove(grid.cellsGrouppedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGrouppedByReversedColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsGrouppedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGrouppedByReversedRow);
}

function canMove(grouppedCells) {
  return grouppedCells.some((group) => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) return false;
    if (cell.isEmpty()) return false;

    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}

function saveTilesToLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith("2048game_tile")) {
      localStorage.removeItem(key);
    }
  }

  const cellWithTiles = document.querySelectorAll(".tile");
  let i = 0;
  for (let cell of cellWithTiles) {
    const cellValue = cell.textContent;
    const cellX = cell.style.getPropertyValue("--x");
    const cellY = cell.style.getPropertyValue("--y");
    const tileInfoString = +cellValue + " " + cellX + " " + cellY;

    localStorage.setItem(`2048game_tile${i++}`, tileInfoString);
  }
}

function loadSavedGame() {
  const score = document.querySelector(".game-score");
  score.textContent = localStorage.getItem("2048game_score") ?? 0;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (!key.startsWith("2048game_tile")) continue;

    const tileInfo = localStorage.getItem(key).split(" ");
    const tileValue = tileInfo[0];
    const tileX = tileInfo[1];
    const tileY = tileInfo[2];
    const tileClass = tileValue <= 2048 ? tileValue : "super";

    grid.getCellByCoords(tileX, tileY).linkTile(new Tile(gameBoard, +tileValue));
  }
}

function loadBestScoreFromLocalStorage() {
  const bestScore = document.querySelector(".best-game-score");
  const bestScoreOnGameField = `2048game_best-score${grid.sideLength}x${grid.sideLength}`;
  bestScore.textContent = localStorage.getItem(bestScoreOnGameField) ?? 0;
}

function loadColorsFromLocalStorage() {
  if (!localStorage.getItem("2048game_colors")) return;
  const defaultSelectedColor = document.querySelector(".settings-color-choice--selected");
  const savedSelectedColors = localStorage.getItem("2048game_colors");
  defaultSelectedColor.classList.remove("settings-color-choice--selected");
  document.querySelector("." + savedSelectedColors).classList.add("settings-color-choice--selected");

  const gameColors = document.querySelector(".settings-color-choice--selected").palette;
  const rootStyles = document.querySelector(":root").style;
  rootStyles.setProperty("--tile-2-bgColor", gameColors.tile2BgColor);
  rootStyles.setProperty("--tile-2-color", gameColors.tile2Color);
  rootStyles.setProperty("--tile-4-bgColor", gameColors.tile4BgColor);
  rootStyles.setProperty("--tile-4-color", gameColors.tile4Color);
  rootStyles.setProperty("--tile-8-bgColor", gameColors.tile8BgColor);
  rootStyles.setProperty("--tile-8-color", gameColors.tile8Color);
  rootStyles.setProperty("--tile-16-bgColor", gameColors.tile16BgColor);
  rootStyles.setProperty("--tile-16-color", gameColors.tile16Color);
  rootStyles.setProperty("--tile-32-bgColor", gameColors.tile32BgColor);
  rootStyles.setProperty("--tile-32-color", gameColors.tile32Color);
  rootStyles.setProperty("--tile-64-bgColor", gameColors.tile64BgColor);
  rootStyles.setProperty("--tile-64-color", gameColors.tile64Color);
  rootStyles.setProperty("--tile-128-bgColor", gameColors.tile128BgColor);
  rootStyles.setProperty("--tile-128-color", gameColors.tile128Color);
  rootStyles.setProperty("--tile-256-bgColor", gameColors.tile256BgColor);
  rootStyles.setProperty("--tile-256-color", gameColors.tile256Color);
  rootStyles.setProperty("--tile-512-bgColor", gameColors.tile512BgColor);
  rootStyles.setProperty("--tile-512-color", gameColors.tile512Color);
  rootStyles.setProperty("--tile-1024-bgColor", gameColors.tile1024BgColor);
  rootStyles.setProperty("--tile-1024-color", gameColors.tile1024Color);
  rootStyles.setProperty("--tile-2048-bgColor", gameColors.tile2048BgColor);
  rootStyles.setProperty("--tile-2048-color", gameColors.tile2048Color);
  rootStyles.setProperty("--tile-super-bgColor", gameColors.tileSuperBgColor);
  rootStyles.setProperty("--tile-super-color", gameColors.tileSuperColor);
}

function removeGameFromLocalStorage() {
  for (let key of Object.keys(localStorage)) {
    if (key.startsWith("2048game_tile")) {
      localStorage.removeItem(key);
    }
  }
  localStorage.removeItem("2048game_score");
}

const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", restartGame);

function restartGame() {
  removeGameFromLocalStorage();
  resetGameField();
  startNewGame();
  settingsMenu.classList.contains("settings-menu--open") && forsedCloseSettings();
}

function resetGameField() {
  grid.cells.forEach((cell) => {
    cell.linkedTile && cell.linkedTile.removeFromDOM();
    cell.linkedTile = null;
  });
}

const gameFieldActiveSwitchers = document.querySelectorAll(".settings-game-field-choice:not([checked])");
gameFieldActiveSwitchers.forEach((switcher) => {
  switcher.addEventListener("click", changeGameFieldSize, { once: true });
});

function changeGameFieldSize(e) {
  removeGameFromLocalStorage();
  localStorage.setItem("2048game_side-length", this.value);

  changeChechedSwitcher(e);
  resetGameField();
  grid.changeGridSize(this.value);
  startNewGame();

  loadBestScoreFromLocalStorage();
}

function changeChechedSwitcher(e) {
  const formerChosen = document.querySelector(".settings-game-field-choice[checked]");

  formerChosen.removeAttribute("checked");
  formerChosen.addEventListener("click", changeGameFieldSize, { once: true });

  e.target.setAttribute("checked", "");
}
