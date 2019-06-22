import React, { PureComponent, createRef } from "react";
import { Application, Loader } from "pixi.js";

import Entity, { kOnTick } from "../structures/Entity";
import { WINDOW_SIZE } from "../constants";
import entities from "../entities";

class Game extends PureComponent {
  private app = new Application({
    antialias: true,
    ...WINDOW_SIZE
  });

  private entities: Entity[] = [];
  private gameRef = createRef<any>();

  constructor(props: any) {
    super(props);

    const { stage, ticker } = this.app;

    entities.forEach(EntityMemb => {
      let entity = new EntityMemb(this.app, this.entities);
      if (!entity._noSprite) {
        Loader
          .shared
          .add(entity.spriteName, `${process.env.NODE_ENV !== "production" ? "/out" : ""}/assets/${entity.spriteName}.png`);
      }
      this.entities.push(entity);
    });

    Loader.shared.load(() => {
      this.entities.forEach(entity => {
        if (entity.sprite) stage.addChild(entity.sprite);
        if (entity._noTick) return;
        ticker
          .add(entity[kOnTick].bind(entity));
      });
    });
  }

  public componentDidMount() {
    const { view } = this.app;
    this.gameRef.current.appendChild(view);
  }

  public render() {
    return <div ref={this.gameRef} />;
  }
}

export default Game;
