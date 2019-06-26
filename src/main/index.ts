const env = process.env.NODE_ENV || "production";
const dev = env === "development";

import { join } from "path";
import { format } from "url";
import electron = require("electron");
const { BrowserWindow, app, Menu } = electron;

// Keep a global reference of the window object, otherwise the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    resizable: false,
    width: 800,
    height: 600,
    //icon: join(__dirname, assets", "icon.png")
  });

  if (dev) {
    mainWindow.loadURL("http://localhost:4444");
  } else {
    Menu.setApplicationMenu(null);
    mainWindow.loadURL(format({
      pathname: join(app.getAppPath(), "dist", "renderer", "index.html"),
      protocol: "file:",
      slashes: true,
    }));
  }

  // Dereference the window object and by doing so removing it from the V8 heap.
  mainWindow.on("closed", () => { mainWindow = null });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => app.quit());

// On OS X it"s common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
//app.on("activate", () => mainWindow === null ? createWindow() : void 0);
