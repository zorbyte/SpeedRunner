import Entity from "./Entity";
import Utils from "../Utils";

import { Rectangle } from "pixi.js";

/**
 * @description An entity base classfor easy use of collision correction.
 */
class PhysicsEntity extends Entity {
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
    const colRes = Utils.checkCollision(this.vx, this.vy, bounds, otherBounds);

    if (colRes.y) {
      if (corY) {
        this.vy = 0;
        if (Utils.checkCollision(this.vx, this.vy, bounds, otherBounds).y) this.vy += Math.sign(this.vy);
      }
    }

    if (colRes.x) {
      if (corX) {
        this.vx = 0;
        if (Utils.checkCollision(this.vx, this.vy, bounds, otherBounds).x) this.vx += Math.sign(this.vx);
      }
    }

    return colRes;
  }
}

export default PhysicsEntity;
