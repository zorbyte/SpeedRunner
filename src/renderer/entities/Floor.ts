import Entity from "../structures/Entity";
import { Graphics } from "pixi.js";

class Floor extends Entity {
  public _noSprite = true;
  public _onTick = true;

  public sprite!: Graphics;

  public width = 512;
  public height = 64;
  public initX = 150;
  public initY = 400;

  protected init() {
    const s = this.sprite = new Graphics();
    s.beginFill(0x66CCFF);
    s.drawRect(0, 0, this.width, this.height);
    s.endFill();
    s.x = this.initX;
    s.y = this.initY;
    this.app.stage.addChild(s);
  }
}

export default Floor;
