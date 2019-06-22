import Entity from "../structures/Entity";
import KeyMonitor from "../structures/KeyMonitor";
import { WINDOW_SIZE } from "../constants";
import Utils from "../Utils";
import Floor from "./Floor";

import { Sprite } from "pixi.js";

class Player extends Entity {
  public sprite!: Sprite;
  private leftMove: 0 | 1 = 0;
  private rightMove: 0 | 1 = 0;
  private jumpAmnt: number = 0;
  private jumpReleased = true;
  private jump = false;

  protected init() {
    const s = this.sprite;
    s.scale.set(2, 2);
    s.anchor.set(0.5, 0.5);
    s.x = WINDOW_SIZE.width / 2;
    s.y = WINDOW_SIZE.height / 2;

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

  protected onTick() {
    // The move direction.
    let moveDir = this.rightMove - this.leftMove;

    // Sets the move direction and adds sliperyness.
    this.vx = moveDir === 0 ? this.vx * 0.8 : moveDir * 7;

    // Gravity.
    this.vy += 0.4;

    if (this.jump && this.jumpAmnt < 3) {
      this.vy = -8;
      this.jump = false;
      this.jumpReleased = false;
    }

    let flrs = this.entities
      .filter(e => e instanceof Floor);

    for (const flr of flrs) {
      const bounds = this.sprite.getBounds();
      const floorBounds = flr.sprite.getBounds();

      if (Utils.checkCollision(this.vx, this.vy, bounds, floorBounds).y) {
        if (this.vy > 3.3) {
          this.vy *= -0.75;
          this.jump = false;
        } else {
          //this.y += Utils.calculateCollisionDiff(this.y, Math.sign(this.vy));
          this.vy = 0;
          this.jumpAmnt = 0;
        }
      } else if (Utils.checkCollision(this.vx, this.vy, bounds, floorBounds).x) {
        this.x += Utils.calculateCollisionDiff(this.x, this.vx);
        this.vx = 0;
      }
    }

    console.log(this.vy);
  }
}

export default Player;
