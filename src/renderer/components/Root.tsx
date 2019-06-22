import React, { FC } from "react";
import { useRoutes } from 'hookrouter';
import TitleScreen from "./TitleScreen";
import Game from "./Game";

const routes = {
  "/": () => <TitleScreen />,
  "/game": () => <Game />,
};

const Root: FC = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <h1>Not Found.</h1>;
}

export default Root;
