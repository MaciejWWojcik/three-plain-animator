'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PlainAnimator = void 0;
var rxjs_1 = require('rxjs');
var three_1 = require('three');
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
var PlainAnimator = /** @class */ (function () {
  /**
   * Create a PlainAnimator
   * @param {Texture} texture - THREE Texture object with sprite image loaded
   * @param {number} tilesAmountHorizontally - number of columns in your sprite image
   * @param {number} tilesAmountVertically - number of rows in your sprite image
   * @param {number} tilesTotalAmount - number of frames in your sprite image
   * @param {number} framesPerSecond - number of frames per second, for example 15
   */
  function PlainAnimator(texture, tilesAmountHorizontally, tilesAmountVertically, tilesTotalAmount, framesPerSecond) {
    this.texture = texture;
    this.tilesAmountHorizontally = tilesAmountHorizontally;
    this.tilesAmountVertically = tilesAmountVertically;
    this.tilesTotalAmount = tilesTotalAmount;
    this.currentFrameDisplayTime = 0;
    this.currentFrame = 0;
    this.clock = new three_1.Clock();
    this.end$ = new rxjs_1.Subject();
    this.tilesTotalAmount -= 1; // indexing from 0
    this.frameDisplayDuration = 1000 / framesPerSecond;
    this.texture.wrapS = three_1.RepeatWrapping;
    this.texture.wrapT = three_1.RepeatWrapping;
    this.texture.repeat.set(1 / tilesAmountHorizontally, 1 / tilesAmountVertically);
  }
  /**
   * Initializes Animator,
   * @param {number} startFrame - optional parameter for setting the start position of animation (frame number)
   * @return {Texture} a Texture object that will display animation
   */
  PlainAnimator.prototype.init = function (startFrame) {
    if (startFrame === void 0) {
      startFrame = 0;
    }
    this.currentFrame = startFrame;
    this.currentFrameDisplayTime = 0;
    this.clock = new three_1.Clock();
    this.updateFrame();
    return this.texture;
  };
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
  PlainAnimator.prototype.animate = function () {
    this.currentFrameDisplayTime += this.clock.getDelta() * 1000;
    while (this.currentFrameDisplayTime > this.frameDisplayDuration) {
      this.currentFrameDisplayTime -= this.frameDisplayDuration;
      if (this.currentFrame === this.tilesTotalAmount) {
        this.end$.next();
      }
      this.currentFrame = this.currentFrame < this.tilesTotalAmount ? this.currentFrame + 1 : 0;
      this.updateFrame();
    }
  };
  Object.defineProperty(PlainAnimator.prototype, 'end', {
    /**
     * Getter for Observable that emits event on end of the animation
     * note that when used in infinity loop, the event will be emitted every time animation completes
     * @return {Observable} a void Observable
     */
    get: function () {
      return this.end$.asObservable();
    },
    enumerable: false,
    configurable: true,
  });
  PlainAnimator.prototype.updateFrame = function () {
    var tileHeight = 1 / this.tilesAmountVertically;
    var currentColumn = this.currentFrame % this.tilesAmountHorizontally;
    var currentRow = Math.floor(this.currentFrame / this.tilesAmountHorizontally);
    this.texture.offset.x = currentColumn / this.tilesAmountHorizontally;
    this.texture.offset.y = 1 - currentRow / this.tilesAmountVertically - tileHeight;
  };
  return PlainAnimator;
})();
exports.PlainAnimator = PlainAnimator;
