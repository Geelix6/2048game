import { Cell } from "./cell.js";

export class Grid {
  constructor(gridElement, side_length) {
    this.gridElement = gridElement;
    this.side_length = side_length;
    this.cells_count = this.side_length ** 2;

    this.createCells(this.gridElement);
    this.createGrouppedCells();
  }

  createCells(gridElement) {
    this.cells = [];
    for (let i = 0; i < this.cells_count; i++) {
      this.cells.push(new Cell(gridElement, i % this.side_length, Math.floor(i / this.side_length)));
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

  changeGridSize(newLength) {
    this.side_length = newLength;
    this.cells_count = this.side_length ** 2;
    document.querySelector(":root").style.setProperty("--side-length", newLength);
    this.gridElement.innerHTML = "";
    this.createCells(this.gridElement);
    this.createGrouppedCells();
  }
}
