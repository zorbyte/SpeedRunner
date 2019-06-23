import Entity from "../structures/Entity";
import KeyMonitor from "../structures/KeyMonitor";
import { WINDOW_SIZE } from "../constants";
import Utils from "../Utils";
import Floor from "./Floor";

import { Sprite, Rectangle } from "pixi.js";

class Player extends Entity {
  public sprite!: Sprite;
  public spriteName = "Player";
  private leftMove: 0 | 1 = 0;
  private rightMove: 0 | 1 = 0;

  private elastic = false;
  private jumpAmnt: number = 0;
  private jumpReleased = true;
  private jump = false;

  protected init() {
    const s = this.sprite;
    s.anchor.set(0.5);
    s.x = WINDOW_SIZE.width / 2;
    s.y = WINDOW_SIZE.height / 2;

    this.game.viewport.follow(s, { radius: 85, acceleration: 4 });

    new KeyMonitor("up")
      .onPress(() => {
        if (!this.jumpReleased) return;
        this.jump = true;
        this.jumpAmnt += 1;
      })
      .onRelease(() => {
        this.jumpReleased = true;
      })
      .create("left")
      .onPress(() => this.leftMove = 1)
      .onRelease(() => this.leftMove = 0)
      .create("right")
      .onPress(() => this.rightMove = 1)
      .onRelease(() => this.rightMove = 0);
  }

  /**
   * @description Checks and corrects collisions.
   * @param bounds The bounds of the colliding object.
   * @param otherBounds The bounds of the collidee.
   * @param corX Corrects X axis collisions.
   * @param corY Corrects Y axis collisions.
   */
  protected checkCorrectCollision(
    bounds: Rectangle,
    otherBounds: Rectangle,
    corX = true,
    corY = true,
  ): { x: boolean, y: boolean } {
    let result = {
      x: false,
      y: false,
    };

    if (Utils.checkCollision(this.vx, this.vy, bounds, otherBounds).y) {
      result.y = true;
      if (corY) {
        this.vy = 0;
        if (Utils.checkCollision(this.vx, this.vy, bounds, otherBounds).y) this.vy += Math.sign(this.vy);
      }
    } else if (Utils.checkCollision(this.vx, this.vy, bounds, otherBounds).x) {
      result.x = true;
      if (corX) {
        this.vx = 0;
        if (Utils.checkCollision(this.vx, this.vy, bounds, otherBounds).x) this.vx += Math.sign(this.vx);
      }
    }

    return result;
  }

  protected onTick() {
    // The move direction.
    let moveDir = this.rightMove - this.leftMove;

    // Sets the move direction and adds sliperyness.
    this.vx = moveDir === 0 ? this.vx * 0.5 : moveDir * 8;

    // Gravity.
    this.vy += 0.4;

    if (this.jump && this.jumpAmnt < 3) {
      this.vy = -8;
      this.jumpReleased = false;
    }

    this.jump = false;

    // Get the floor instances.
    let flrs = this.entities
      .filter(e => e instanceof Floor);

    for (const flr of flrs) {
      const bounds = this.sprite.getBounds();
      const floorBounds = flr.sprite.getBounds();

      let { y } = this
        .checkCorrectCollision(bounds, floorBounds, true, false);

      if (y) {
        if (this.vy > 8.7 || this.elastic) {
          this.elastic = this.vy > 6;
          this.vy *= -0.75;
        } else {
          this.jumpAmnt = 0;
          this.vy = 0;
          if (Utils.checkCollision(this.vx, this.vy, bounds, floorBounds).y) this.vy += Math.sign(this.vy);
        }
      }
    }
  }
}

export default Player;
