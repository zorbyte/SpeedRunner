import keyCode from "keycode";

class KeyMonitor {
  private keyCode: number;
  private isDown = false;
  private isUp = true;
  private pressHandler?: () => any;
  private releaseHandler?: () => any;
  private static unsubscribers: KeyMonitor["_unsubscribe"][] = [];

  constructor(keyName: string) {
    this.keyCode = keyCode(keyName)
    this.handler = this.handler.bind(this);
    KeyMonitor.unsubscribers.push(this._unsubscribe.bind(this));
  }

  public create(keyName: string): KeyMonitor {
    return new KeyMonitor(keyName);
  }

  public onPress(cb: () => any) {
    this.pressHandler = cb;

    window
      .addEventListener(
        "keydown",
        this.handler,
        false,
      );

    return this;
  }

  public onRelease(cb: () => any) {
    this.releaseHandler = cb;

    window
      .addEventListener(
        "keyup",
        this.handler,
        false,
      );

    return this;
  }

  public unsubscribe() {
    KeyMonitor.unsubscribers
      .forEach(unSubber => unSubber());
  }

  private _unsubscribe() {
    if (this.pressHandler) window
      .removeEventListener(
        "keydown",
        this.handler.bind(this),
      );

    if (this.releaseHandler) window
      .removeEventListener(
        "keyup",
        this.handler.bind(this),
      );
  }

  private handler(event: KeyboardEvent) {
    if (keyCode.isEventKey(event, this.keyCode)) {
      this.isDown = event.type === "keydown";
      this.isUp = event.type === "keyup";
      if (this.isDown && this.pressHandler) this.pressHandler();
      if (this.isUp && this.releaseHandler) this.releaseHandler();
      event.preventDefault();
    }
  }
}

export default KeyMonitor;
