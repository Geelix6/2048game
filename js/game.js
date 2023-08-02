import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.querySelector(".game-board");
const grid = new Grid(gameBoard, 4);

document.querySelector(".game-wrapper").style.display = "flex";
document.querySelector(":root").style.setProperty("--side-length", 4);

startNewGame();

function startNewGame() {
  document.querySelector(".game-score").textContent = 0;
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  setupInputOnce();
}

function setupInputOnce() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      settingsMenu.classList.contains("settings-menu--open") && forsedCloseSettings();

      await moveUp();
      break;

    case "ArrowDown":
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      settingsMenu.classList.contains("settings-menu--open") && forsedCloseSettings();

      await moveDown();
      break;

    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      settingsMenu.classList.contains("settings-menu--open") && forsedCloseSettings();

      await moveLeft();
      break;

    case "ArrowRight":
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      settingsMenu.classList.contains("settings-menu--open") && forsedCloseSettings();

      await moveRight();
      break;

    default:
      setupInputOnce();
      return;
  }

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

const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", restartGame);

function restartGame() {
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
  changeChechedSwitcher(e);
  resetGameField();
  grid.changeGridSize(this.value);
  startNewGame();
}

function changeChechedSwitcher(e) {
  const formerChosen = document.querySelector(".settings-game-field-choice[checked]");

  formerChosen.removeAttribute("checked");
  formerChosen.addEventListener("click", changeGameFieldSize, { once: true });

  e.target.setAttribute("checked", "");
}
