import PhysicsEntity from "../structures/PhysicsEntity";
import { WINDOW_SIZE } from '../constants';
import { Sprite } from 'pixi.js';

class Enemy extends PhysicsEntity {
  public sprite!: Sprite;
  public spriteName = "Enemy";

  protected init() {
    const s = this.sprite;
    s.anchor.set(0.5);
    s.x = WINDOW_SIZE.width / 3;
    s.y = WINDOW_SIZE.height / 2;
  }
}

export default Enemy;
