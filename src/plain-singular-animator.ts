import { take } from 'rxjs/operators';
import { Texture } from 'three';
import { PlainAnimator } from './plain-animator';

/**
 * Singular Animator Class
 * @extends PlainAnimator
 *
 * allows to animate texture without looping on end of the animation
 *
 *
 * @example
 * const spriteTexture = new THREE.TextureLoader().load('sprite-texture.png')
 * const animator = new PlainSingularAnimator(spriteTexture, 4, 4, 10, 15);
 * const texture = animator.init();
 * animator.animate();
 *
 * @see {@link https://github.com/MaciejWWojcik/three-plain-animator/tree/master/src/examples/simple-2d-animation/src/index.ts)}
 */
export class PlainSingularAnimator extends PlainAnimator {
  /**
   * Create a PlainSingularAnimator
   * @param {Texture} texture - THREE Texture object with sprite image loaded
   * @param {number} tilesAmountHorizontally - number of columns in your sprite image
   * @param {number} tilesAmountVertically - number of rows in your sprite image
   * @param {number} tilesTotalAmount - number of frames in your sprite image
   * @param {number} framesPerSecond - number of frames per second, for example 15
   * @param {number} frameOffset - number of frames to skip before the setting the initial frame, default 0
   */
  constructor(
    texture: Texture,
    tilesAmountHorizontally: number,
    tilesAmountVertically: number,
    tilesTotalAmount: number,
    framesPerSecond: number,
    framesOffset: number = 0,
  ) {
    super(texture, tilesAmountHorizontally, tilesAmountVertically, tilesTotalAmount, framesPerSecond, framesOffset);
  }

  /**
   * Updates current frame in Texture
   * Function updates texture as long as animation lasts, then stops
   *
   * Use if you want to play your animation only once
   *
   */
  public play(): void {
    let requestId: number;
    const animation = () => {
      this.animate();
      requestId = requestAnimationFrame(animation);
    };
    requestId = requestAnimationFrame(animation);
    this.end$
      .pipe(take(1))
      .toPromise()
      .then(() => cancelAnimationFrame(requestId));
  }

  /**
   * Updates current frame in Texture, should be invoked in loop to allow updating the texture
   * Function stops at the end of the animation
   *
   * @example
   * function animate() {
   *    animator.animate();
   *    requestAnimationFrame(animate);
   *  }
   *
   *  Use if you want to play your animation with own loop function
   *
   */
  public animate(): void {
    this.currentFrameDisplayTime += this.clock.getDelta() * 1000;

    while (this.currentFrameDisplayTime > this.frameDisplayDuration) {
      this.currentFrameDisplayTime -= this.frameDisplayDuration;

      if (this.currentFrame < this.tilesTotalAmount) {
        this.currentFrame += 1;
      }
      this.updateFrame();
      if (this.currentFrame === this.tilesTotalAmount) {
        this.end$.next();
        return;
      }
    }
  }
}
