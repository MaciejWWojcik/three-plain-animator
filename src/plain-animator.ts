import { Observable, Subject } from 'rxjs';
import { Clock, RepeatWrapping, Texture } from 'three';

export class PlainAnimator {
  protected currentFrameDisplayTime: number = 0;
  protected currentFrame: number = 0;
  protected clock: Clock = new Clock();
  protected end$: Subject<any> = new Subject<any>();
  protected readonly frameDisplayDuration: number;

  constructor(
    public texture: Texture,
    protected tilesAmountHorizontally: number,
    protected tilesAmountVertically: number,
    protected tilesTotalAmount: number,
    framesPerSecond: number,
  ) {
    this.tilesTotalAmount -= 1; // indexing from 0
    this.frameDisplayDuration = 1000 / framesPerSecond;
    this.texture.wrapS = RepeatWrapping;
    this.texture.wrapT = RepeatWrapping;
    this.texture.repeat.set(1 / tilesAmountHorizontally, 1 / tilesAmountVertically);
  }

  public init(startFrame: number = 0): Texture {
    this.currentFrame = startFrame;
    this.currentFrameDisplayTime = 0;
    this.clock = new Clock();
    this.updateTexture();
    return this.texture;
  }

  public animate(): void {
    this.currentFrameDisplayTime += this.clock.getDelta() * 1000;

    while (this.currentFrameDisplayTime > this.frameDisplayDuration) {
      this.currentFrameDisplayTime -= this.frameDisplayDuration;
      if (this.currentFrame === this.tilesTotalAmount) {
        this.end$.next();
      }
      this.currentFrame = this.currentFrame < this.tilesTotalAmount ? this.currentFrame + 1 : 0;
      this.updateTexture();
    }
  }

  public get end(): Observable<any> {
    return this.end$.asObservable();
  }

  protected updateTexture() {
    const tileHeight = 1 / this.tilesAmountVertically;

    const currentColumn = this.currentFrame % this.tilesAmountHorizontally;
    const currentRow = Math.floor(this.currentFrame / this.tilesAmountHorizontally);

    this.texture.offset.x = currentColumn / this.tilesAmountHorizontally;
    this.texture.offset.y = 1 - currentRow / this.tilesAmountVertically - tileHeight;
  }
}
