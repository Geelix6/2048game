export class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement("div");
    this.tileElement.classList.add("tile");
    this.setValue(Math.random() < 0.75 ? 2 : 4);
    gridElement.append(this.tileElement);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty("--x", x);
    this.tileElement.style.setProperty("--y", y);
  }

  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;

    if (value <= 2048) {
      this.tileElement.classList.add(`tile-${value}`);
    } else {
      this.tileElement.classList.add(`tile-super`);
    }
  }

  waitForTransitionEnd() {
    return new Promise((resolve) => {
      this.tileElement.addEventListener("transitionend", resolve, { once: true });
    });
  }

  waitForAnimationEnd() {
    return new Promise((resolve) => {
      this.tileElement.addEventListener("animationend", resolve, { once: true });
    });
  }

  removeFromDOM() {
    this.tileElement.remove();
  }
}
