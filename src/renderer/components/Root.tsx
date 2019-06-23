import React, { FC } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import TitleScreen from "./TitleScreen";
import Game from "./Game";

const Root: FC = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={TitleScreen} />
      <Route path="/game" component={Game} />
      <Route component={() => <h1>Not found</h1>} />
    </Switch>
  </HashRouter>
);

export default Root;
