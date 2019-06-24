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
}

export default PhysicsEntity;
