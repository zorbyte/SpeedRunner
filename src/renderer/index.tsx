import React from "react";
import { render } from "react-dom";
import Root from "./components/Root";
import { utils } from "pixi.js";

utils.skipHello();

const RENDER_NODE = document.getElementById("root") as HTMLElement;

render(<Root />, RENDER_NODE);
