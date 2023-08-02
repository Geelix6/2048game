const settings = document.querySelector(".settings");
const settingsClose = document.querySelector(".settings-close");
const settingsMenu = document.querySelector(".settings-menu");

settings.addEventListener("click", openSettings, { once: true });
settingsClose.addEventListener("click", forsedCloseSettings);

function openSettings(e) {
  settings.style.transform = "rotate(60deg)";
  settingsMenu.classList.add("settings-menu--open");
  settings.addEventListener("click", closeSettings, { once: true });

  e.stopPropagation(); //чтобы обработчик снизу сразу же не вызывался
  document.addEventListener("click", closeSettingsByClickingPastMenu, { once: true });
}

function closeSettings() {
  settings.style.transform = "rotate(0deg)";
  settingsMenu.classList.remove("settings-menu--open");

  settings.addEventListener("click", openSettings, { once: true });
}

function forsedCloseSettings() {
  closeSettings();
  settings.removeEventListener("click", closeSettings);
}

function closeSettingsByClickingPastMenu(e) {
  if (settingsMenu.contains(e.target) && !e.target.classList.contains("settings-close")) {
    document.addEventListener("click", closeSettingsByClickingPastMenu, { once: true });
    return;
  }
  forsedCloseSettings();
}

const colorSwithers = document.querySelectorAll(".settings-color-choice");

const classicColors = document.querySelector(".settings-color-choice--classic");
const bluishColors = document.querySelector(".settings-color-choice--bluish");
const greenlyColors = document.querySelector(".settings-color-choice--greenly");

classicColors.addEventListener("click", changeGameColorsAndSwitcher);
bluishColors.addEventListener("click", changeGameColorsAndSwitcher);
greenlyColors.addEventListener("click", changeGameColorsAndSwitcher);

classicColors.palette = {
  tile2BgColor: "#eee4da",
  tile2Color: "#242221",
  tile4BgColor: "#ede0c8",
  tile4Color: "#242221",
  tile8BgColor: "#f2b179",
  tile8Color: "#242221",
  tile16BgColor: "#f59563",
  tile16Color: "#242221",
  tile32BgColor: "#f67c5f",
  tile32Color: "#242221",
  tile64BgColor: "#f65e3b",
  tile64Color: "#f9f6f2",
  tile128BgColor: "#edcf72",
  tile128Color: "#242221",
  tile256BgColor: "#edcc61",
  tile256Color: "#242221",
  tile512BgColor: "#edc850",
  tile512Color: "#f9f6f2",
  tile1024BgColor: "#edc53f",
  tile1024Color: "#f9f6f2",
  tile2048BgColor: "#edc22e",
  tile2048Color: "#f9f6f2",
  tileSuperBgColor: "#3c3a32",
  tileSuperColor: "#f9f6f2",
};
bluishColors.palette = {
  tile2BgColor: "oklch(92% 0.17 291)",
  tile2Color: "#000",
  tile4BgColor: "oklch(84% 0.17 291)",
  tile4Color: "#000",
  tile8BgColor: "oklch(76% 0.17 291)",
  tile8Color: "#000",
  tile16BgColor: "oklch(68% 0.17 291)",
  tile16Color: "#000",
  tile32BgColor: "oklch(60% 0.17 291)",
  tile32Color: "#fff",
  tile64BgColor: "oklch(52% 0.17 291)",
  tile64Color: "#fff",
  tile128BgColor: "oklch(44% 0.17 291)",
  tile128Color: "#fff",
  tile256BgColor: "oklch(36% 0.17 291)",
  tile256Color: "#fff",
  tile512BgColor: "oklch(28% 0.17 291)",
  tile512Color: "#fff",
  tile1024BgColor: "oklch(20% 0.17 291)",
  tile1024Color: "#fff",
  tile2048BgColor: "oklch(12% 0.17 291)",
  tile2048Color: "#fff",
  tileSuperBgColor: "oklch(4% 0.17 291)",
  tileSuperColor: "#fff",
};

greenlyColors.palette = {
  tile2BgColor: "oklch(92% 0.13 144)",
  tile2Color: "#000",
  tile4BgColor: "oklch(84% 0.13 144)",
  tile4Color: "#000",
  tile8BgColor: "oklch(76% 0.13 144)",
  tile8Color: "#000",
  tile16BgColor: "oklch(68% 0.13 144)",
  tile16Color: "#000",
  tile32BgColor: "oklch(60% 0.13 144)",
  tile32Color: "#000",
  tile64BgColor: "oklch(52% 0.13 144)",
  tile64Color: "#000",
  tile128BgColor: "oklch(44% 0.13 144)",
  tile128Color: "#fff",
  tile256BgColor: "oklch(36% 0.13 144)",
  tile256Color: "#fff",
  tile512BgColor: "oklch(28% 0.13 144)",
  tile512Color: "#fff",
  tile1024BgColor: "oklch(20% 0.13 144)",
  tile1024Color: "#fff",
  tile2048BgColor: "oklch(12% 0.13 144)",
  tile2048Color: "#fff",
  tileSuperBgColor: "oklch(4% 0.13 144)",
  tileSuperColor: "#fff",
};

function changeGameColorsAndSwitcher(e) {
  rootStyles = document.querySelector(":root").style;
  rootStyles.setProperty("--tile-2-bgColor", e.currentTarget.palette.tile2BgColor);
  rootStyles.setProperty("--tile-2-color", e.currentTarget.palette.tile2Color);
  rootStyles.setProperty("--tile-4-bgColor", e.currentTarget.palette.tile4BgColor);
  rootStyles.setProperty("--tile-4-color", e.currentTarget.palette.tile4Color);
  rootStyles.setProperty("--tile-8-bgColor", e.currentTarget.palette.tile8BgColor);
  rootStyles.setProperty("--tile-8-color", e.currentTarget.palette.tile8Color);
  rootStyles.setProperty("--tile-16-bgColor", e.currentTarget.palette.tile16BgColor);
  rootStyles.setProperty("--tile-16-color", e.currentTarget.palette.tile16Color);
  rootStyles.setProperty("--tile-32-bgColor", e.currentTarget.palette.tile32BgColor);
  rootStyles.setProperty("--tile-32-color", e.currentTarget.palette.tile32Color);
  rootStyles.setProperty("--tile-64-bgColor", e.currentTarget.palette.tile64BgColor);
  rootStyles.setProperty("--tile-64-color", e.currentTarget.palette.tile64Color);
  rootStyles.setProperty("--tile-128-bgColor", e.currentTarget.palette.tile128BgColor);
  rootStyles.setProperty("--tile-128-color", e.currentTarget.palette.tile128Color);
  rootStyles.setProperty("--tile-256-bgColor", e.currentTarget.palette.tile256BgColor);
  rootStyles.setProperty("--tile-256-color", e.currentTarget.palette.tile256Color);
  rootStyles.setProperty("--tile-512-bgColor", e.currentTarget.palette.tile512BgColor);
  rootStyles.setProperty("--tile-512-color", e.currentTarget.palette.tile512Color);
  rootStyles.setProperty("--tile-1024-bgColor", e.currentTarget.palette.tile1024BgColor);
  rootStyles.setProperty("--tile-1024-color", e.currentTarget.palette.tile1024Color);
  rootStyles.setProperty("--tile-2048-bgColor", e.currentTarget.palette.tile2048BgColor);
  rootStyles.setProperty("--tile-2048-color", e.currentTarget.palette.tile2048Color);
  rootStyles.setProperty("--tile-super-bgColor", e.currentTarget.palette.tileSuperBgColor);
  rootStyles.setProperty("--tile-super-color", e.currentTarget.palette.tileSuperColor);

  colorSwithers.forEach((switcher) => {
    switcher.classList.remove("settings-color-choice--selected");
  });
  this.classList.add("settings-color-choice--selected");
}
