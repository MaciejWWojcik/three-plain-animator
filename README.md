# Welcome to three-plain-animator

Three-Plain-Animator is a package for [threejs](https://github.com/mrdoob/three.js/) developers to support 2D
animations.

[![npm version](https://badge.fury.io/js/three-plain-animator.svg)](https://badge.fury.io/js/three-plain-animator)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

![Example](https://media.giphy.com/media/cL5HGzoR4TAXvPrTX6/giphy.gif)

## Installation

The package is available via npm: [three-plain-animator](https://www.npmjs.com/package/three-plain-animator)

    npm i three-plain-animator

## Usage

There are two main classes to work with:

- PlainAnimator
- PlainSingularAnimator

The first one is for continuous animations like walking. The second one is for animation that should run only once and
then stop on the last frame of the animation.

## Example

This is a simple example with Homer Simpson
animation [gif for reference](https://ui-ex.com/images/transparent-gifs-simpson-2.gif). I assume that creating a basic
scene using threejs is not a part of this example. So I will show only unnecessary code just to not mess around.

I converted gif to sprite and uploaded this on imgur.

The first step is to create texture just like every texture using threejs.

    const texturePath =  'https://i.imgur.com/Oj6RJV9.png';
    const spriteTexture = new  THREE.TextureLoader().load(texturePath)

Next step is about creating the animator object:

     const animator =  new  PlainAnimator(spriteTexture, 4, 4, 10, 15);

These magic numbers are the follows:
|value| description | |--|--| | 4 | number of frames horizontally | | 4 | number of frames vertically | | 10 | total
number of frames | | 15 | frames per second (fps) |

Then the final texture could be get using init() method:

    const texture = animator.init();

To animate texture it's required to animate texture in the **main loop of rendering**

    animator.animate();

So for instance, you can use it as follows:

```tsx

function animate() {
  renderer.render(scene, camera);
  animator.animate(); // update the animation
  requestAnimationFrame(animate);
}

animate();

```

Full code:

    const texturePath =  'https://i.imgur.com/Oj6RJV9.png';
    const spriteTexture = new  THREE.TextureLoader().load(texturePath)
    const animator =  new  PlainAnimator(spriteTexture, 4, 4, 10, 15);

	const texture = animator.init();    

    const geometry =  new  THREE.PlaneGeometry(512,  512);
    const material =  new  THREE.MeshBasicMaterial({ map: texture, transparent:  true  });
    
    let mesh =  new  THREE.Mesh(geometry, material)

There is working code on  [stackblitz](https://stackblitz.com/edit/plain-animations) with this example:

## Docs

Read docs [here](https://maciejwwojcik.github.io/three-plain-animator).

## Requierments

The package requires threejs library

## Support

The package supports TypeScript and contains typescript definitions.

## Future work & TODO

1. GIF files support
2. Tests

##    

Feel free to ask any questions. Post on GitHub or write to me: maciejwwojcik@gmail.com
