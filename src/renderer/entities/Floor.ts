import Entity from "../structures/Entity";
import { Graphics } from "pixi.js";

let multiplier = 1;

class Floor extends Entity {
  public _noSprite = true;
  public _onTick = true;

  public sprite!: Graphics;

  protected init() {
    const s = this.sprite = new Graphics();
    //s.lineStyle(4, 0xFF3300, 1);
    s.beginFill(0x66CCFF);
    s.drawRect(0, 0, 64, 64);
    s.endFill();
    s.x = 242 + (128 * multiplier);
    s.y = 370;
    this.app.stage.addChild(s);
    multiplier++;
  }
}

export default Floor;
