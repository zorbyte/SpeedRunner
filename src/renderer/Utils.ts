import { Sprite, Container, Graphics, Rectangle } from "pixi.js";
import { memoizeOne } from "memoize-one-ts";

export type TContainers = Sprite | Container | Graphics;

class Utils {
  public static contain(sprite: any, container: any) {

    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }

    //Return the `collision` value
    return collision;
  }

  @memoizeOne
  public static checkCollision(vx: number, vy: number, a: Rectangle, b: Rectangle): {
    x: boolean;
    y: boolean;
  } {
    let result: Record<string, boolean> = {
      x: b.contains(a.left + vx, a.top) || b.contains(a.left + vx, a.bottom) || b.contains(a.right + vx, a.top) || b.contains(a.right + vx, a.bottom),
      y: b.contains(a.left, a.top + vy) || b.contains(a.left, a.bottom + vy) || b.contains(a.right, a.top + vy) || b.contains(a.right, a.bottom + vy),
    };

    return result as any;
  }
}

export default Utils;
