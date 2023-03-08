
function loadAllSprite() {
    loadSprite('coin', 'coin.png');
    loadSpriteAtlas('evil-shroom.png', {
        'evil-shroom': {
            x: 0,
            y: 0,
            width: 500,
            height: 34,
            sliceX: 15,
            anims: {
                Goomba: { from: 0, to: 2 },
                Walking: { from: 0, to: 1, speed: 3 },
                Walk: { from: 3, to: 4, loop: true, speed: 15 },
            }

        }

    })
    loadSprite('brick', 'brick.png')
    loadSprite('block', 'block.png')
    loadSpriteAtlas('mario.png', {
        "mario": {
            x: 0,
            y: 0,
            width: 500,
            height: 34,
            sliceX: 15,
            anims: {
                small: { from: 0, to: 7, speed: 15 },
                run: { from: 1, to: 3, loop: true, speed: 15 },
                Bigrunning: { from: 9, to: 11, speed: 30 }
            }
        }
    })
    loadSprite('mushroom', 'mushroom.png')
    loadSprite('surprise', 'surprise.png')
    loadSprite('unboxed', 'unboxed.png')
    loadSprite('pipe-top-left', 'pipe-top-left.png')
    loadSprite('pipe-top-right', 'pipe-top-right.png')
    loadSprite('pipe-bottom-left', 'pipe-bottom-left.png')
    loadSprite('pipe-bottom-right', 'pipe-bottom-right.png')

    loadSprite('blue-block', 'blue-block.png')
    loadSprite('blue-brick', 'blue-brick.png')
    loadSprite('blue-steel', 'blue-steel.png')
    loadSprite('blue-evil-shroom', 'blue-evil-shroom.png')
    loadSprite('blue-surprise', 'blue-surprise.png')
    loadSprite('castle', 'castle.png')
}
export default loadAllSprite