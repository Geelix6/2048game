import { Cell } from "./cell.js";

export class Grid {
  constructor(gridElement, sideLength) {
    this.gridElement = gridElement;
    this.sideLength = sideLength;
    this.cellsCount = this.sideLength ** 2;

    this.createCells(this.gridElement);
    this.createGrouppedCells();
  }

  createCells(gridElement) {
    this.cells = [];
    for (let i = 0; i < this.cellsCount; i++) {
      this.cells.push(new Cell(gridElement, i % this.sideLength, Math.floor(i / this.sideLength)));
    }
  }

  createGrouppedCells() {
    this.cellsGrouppedByColumn = this.groupCellsByColumn();
    this.cellsGrouppedByReversedColumn = this.cellsGrouppedByColumn.map((column) => [...column].reverse());
    this.cellsGrouppedByRow = this.groupCellsByRow();
    this.cellsGrouppedByReversedRow = this.cellsGrouppedByRow.map((row) => [...row].reverse());
  }

  groupCellsByColumn() {
    return this.cells.reduce((grouppedCells, cell) => {
      grouppedCells[cell.x] = grouppedCells[cell.x] ?? [];
      grouppedCells[cell.x][cell.y] = cell;
      return grouppedCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((grouppedCells, cell) => {
      grouppedCells[cell.y] = grouppedCells[cell.y] ?? [];
      grouppedCells[cell.y][cell.x] = cell;
      return grouppedCells;
    }, []);
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter((cell) => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  getCellByCoords(x, y) {
    return this.cellsGrouppedByColumn[x][y];
  }

  changeGridSize(newLength) {
    this.sideLength = newLength;
    this.cellsCount = this.sideLength ** 2;
    document.querySelector(":root").style.setProperty("--side-length", newLength);
    this.gridElement.innerHTML = "";
    this.createCells(this.gridElement);
    this.createGrouppedCells();
  }
}
