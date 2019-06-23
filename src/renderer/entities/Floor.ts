import Entity from "../structures/Entity";
import { Graphics } from "pixi.js";

let multiplier = 1;

class Floor extends Entity {
  public _noSprite = true;
  public _onTick = true;

  public sprite!: Graphics;

  public width = 512;
  public height = 64;
  public initX = 370;
  public initY = 370;

  protected init() {
    const s = this.sprite = new Graphics();
    s.beginFill(0x66CCFF);
    s.drawRect(0, 0, this.width, this.height);
    s.endFill();
    s.x = this.initX;
    s.y = this.initY;
    this.app.stage.addChild(s);
    multiplier++;
  }
}

export default Floor;
