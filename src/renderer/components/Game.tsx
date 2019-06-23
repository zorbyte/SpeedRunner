import React, { PureComponent, createRef } from "react";
import { Application, Loader } from "pixi.js";
import { Viewport } from "pixi-viewport";

import Entity, { kOnTick } from "../structures/Entity";
import { WINDOW_SIZE, ASSETS_DIR } from "../constants";
import entities from "../entities";

class Game extends PureComponent {
  private app = new Application({
    antialias: true,
    ...WINDOW_SIZE
  });

  public viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,

    // The interaction module is important for wheel to work properly when renderer.view is placed or scaled.
    interaction: this.app.renderer.plugins.interaction,
  })

  private entities: Entity[] = [];
  private gameRef = createRef<any>();

  constructor(props: any) {
    super(props);

    const { stage, ticker } = this.app;

    stage.addChild(this.viewport);

    this.viewport
      //.clamp({ direction: "all" })
      .bounce()
      .zoomPercent(0.01)
      //.decelerate();

    entities.forEach(EntityMemb => {
      let entity = new EntityMemb(this.app, this.entities, this);
      if (!entity._noSprite) {
        Loader
          .shared
          .add(entity.spriteName, `${ASSETS_DIR}${entity.spriteName}.png`);
      }
      this.entities.push(entity);
    });

    Loader.shared.load(() => {
      this.entities.forEach(entity => {
        if (entity.sprite) this.viewport.addChild(entity.sprite);
        if (entity._noTick) return;
        ticker
          .add(entity[kOnTick].bind(entity));
      });
    });
  }

  public componentDidMount() {
    const { view } = this.app;
    this.gameRef.current.appendChild(view);
    // @ts-ignore
    if (process.env.NODE_ENV != "production") window.GAME = this;
  }

  public render() {
    return <div ref={this.gameRef} />;
  }
}

export default Game;
