import { Observable, Subject } from 'rxjs';
import { Clock, RepeatWrapping, Texture } from 'three';

/**
 * Basic Animator Class
 *
 * allows to animate texture in loop
 *
 * @example
 * const spriteTexture = new THREE.TextureLoader().load('sprite-texture.png')
 * const animator = new PlainAnimator(spriteTexture, 4, 4, 10, 15);
 * const texture = animator.init();
 * animator.animate();
 *
 * @see {@link https://github.com/MaciejWWojcik/three-plain-animator/tree/master/src/examples/simple-2d-animation/src/index.ts)}
 */
export class PlainAnimator {
  protected currentFrameDisplayTime: number = 0;
  protected currentFrame: number = 0;
  protected clock: Clock = new Clock();
  protected end$: Subject<void> = new Subject<void>();
  protected readonly frameDisplayDuration: number;

  /**
   * Create a PlainAnimator
   * @param {Texture} texture - THREE Texture object with sprite image loaded
   * @param {number} tilesAmountHorizontally - number of columns in your sprite image
   * @param {number} tilesAmountVertically - number of rows in your sprite image
   * @param {number} tilesTotalAmount - number of frames in your sprite image
   * @param {number} framesPerSecond - number of frames per second, for example 15
   */
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

  /**
   * Initializes Animator,
   * @param {number} startFrame - optional parameter for setting the start position of animation (frame number)
   * @return {Texture} a Texture object that will display animation
   */
  public init(startFrame: number = 0): Texture {
    this.currentFrame = startFrame;
    this.currentFrameDisplayTime = 0;
    this.clock = new Clock();
    this.updateFrame();
    return this.texture;
  }

  /**
   * Updates current frame in Texture, should be invoked in loop to allow updating the texture
   *
   * @example
   * function animate() {
   *    animator.animate();
   *    requestAnimationFrame(animate);
   *  }
   *
   */
  public animate(): void {
    this.currentFrameDisplayTime += this.clock.getDelta() * 1000;

    while (this.currentFrameDisplayTime > this.frameDisplayDuration) {
      this.currentFrameDisplayTime -= this.frameDisplayDuration;
      if (this.currentFrame === this.tilesTotalAmount) {
        this.end$.next();
      }
      this.currentFrame = this.currentFrame < this.tilesTotalAmount ? this.currentFrame + 1 : 0;
      this.updateFrame();
    }
  }

  /**
   * Getter for Observable that emits event on end of the animation
   * note that when used in infinity loop, the event will be emitted every time animation completes
   * @return {Observable} a void Observable
   */
  public get end(): Observable<void> {
    return this.end$.asObservable();
  }

  protected updateFrame() {
    const tileHeight = 1 / this.tilesAmountVertically;

    const currentColumn = this.currentFrame % this.tilesAmountHorizontally;
    const currentRow = Math.floor(this.currentFrame / this.tilesAmountHorizontally);

    this.texture.offset.x = currentColumn / this.tilesAmountHorizontally;
    this.texture.offset.y = 1 - currentRow / this.tilesAmountVertically - tileHeight;
  }
}
