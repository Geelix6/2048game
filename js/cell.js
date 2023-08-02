export class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gridElement.append(cell);
    this.x = x;
    this.y = y;
  }
  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  unlinkTile() {
    this.linkedTile = null;
  }

  isEmpty() {
    return !this.linkedTile;
  }

  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  canAccept(newTile) {
    return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
  }

  mergeTiles() {
    this.resetTileElementClass();
    this.linkedTile.setValue(this.linkedTile.value * 2);
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
  }

  resetTileElementClass() {
    this.linkedTile.tileElement.classList.remove(`tile-${this.linkedTile.value}`);
  }

  changeGameScore() {
    let gameScore = document.querySelector(".game-score");
    gameScore.textContent = +gameScore.textContent + this.linkedTile.value;
  }
}
