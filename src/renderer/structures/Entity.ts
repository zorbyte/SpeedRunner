import { Sprite, Application, Loader, Texture } from "pixi.js";
import { TContainers } from "../Utils";
import Game from "../components/Game";

export const kOnTick = Symbol("Entity.onTick");

abstract class Entity {
  // X and Y velocity.
  public vx = 0;
  public vy = 0;

  // Float values.
  private posX = 0;
  private posY = 0;

  public sprite!: TContainers;
  public spriteName: string | undefined = void 0;

  public _noSprite = false;
  public _noTick = false;

  constructor(protected app: Application, protected entities: Entity[], protected game: Game, spriteName?: string) {
    // Determine the sprite name.
    this.spriteName = this.spriteName || spriteName as string;

    Loader.shared.on("complete", () => {
      if (this.spriteName) this.sprite = new Sprite(Texture.from(this.spriteName));
      if (this.init) this.init();
    });
  }

  /* Sprite grid aliases. */

  public get x() {
    if (!this.sprite) return 0;
    return this.sprite.x;
  }

  public set x(newX: number) {
    if (!this.sprite) return;
    this.sprite.x = newX;
  }

  public get y() {
    if (!this.sprite) return 0;
    return this.sprite.y;
  }

  public set y(newY: number) {
    if (!this.sprite) return;
    this.sprite.y = newY;
  }

  /**
   * @protected
   * @abstract
   * @name init
   * @description Runs when all the resources such as sprites are loaded.
   */
  protected init?(): void | Promise<void>;

  /**
   * @protected
   * @abstract
   * @name onTick
   * @description Runs this on every game tick.
   * @param delta The frame rate correction delta.
   */
  protected onTick?(delta: number): void | Promise<void>;

  public [kOnTick](delta: number): void {
    if (this.onTick) this.onTick(delta);

    // Use this for floats to prevent stutters.
    this.posX = this.vx * delta;
    this.posY = this.vy * delta;

    this.x += Math.round(this.posX);
    this.y += Math.round(this.posY);
  }
}

/*function clamp(num: number, min: number, max: number): number {
  return num <= min ? min : num >= max ? max : num;
}*/

export default Entity;
