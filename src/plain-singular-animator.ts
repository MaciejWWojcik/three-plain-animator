import { PlainAnimator } from './plain-animator';
import { take } from 'rxjs/operators';
import { Texture } from 'three';

export class PlainSingularAnimator extends PlainAnimator {

  constructor(texture: Texture, tilesAmountHorizontally: number, tilesAmountVertically: number, tilesTotalAmount: number, framesPerSecond: number) {
    super(texture, tilesAmountHorizontally, tilesAmountVertically, tilesTotalAmount, framesPerSecond);
  }

  public play() {
    let requestId: number;
    const animation = () => {
      this.animate();
      requestId = requestAnimationFrame(animation);
    };
    requestId = requestAnimationFrame(animation);
    this.end$.pipe(take(1)).toPromise().then(() => cancelAnimationFrame(requestId));
  }

  public animate(timestamp?: number): void {
    this.currentFrameDisplayTime += this.clock.getDelta() * 1000;

    while (this.currentFrameDisplayTime > this.frameDisplayDuration) {
      this.currentFrameDisplayTime -= this.frameDisplayDuration;

      if (this.currentFrame < this.tilesTotalAmount) {
        this.currentFrame += 1;
      }
      this.updateTexture();
      if (this.currentFrame === this.tilesTotalAmount) {
        this.end$.next(true);
        return;
      }
    }
  }

}
