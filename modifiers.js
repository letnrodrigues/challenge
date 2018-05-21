class Modifier {
    constructor(sprite, x, y){
        this.sprite = sprite
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(x,y);
        this.sprite.width = 10;
        this.sprite.height = 10;
    }

    apply(target, callback){
        callback()
    }
}

class ExpandModifier extends Modifier {
    constructor(x,y){
        var sprite = new PIXI.Sprite.fromImage('assets/expand.png');
        super(sprite, x, y);
    }

    apply(target, callback) {
        var sprite = this.sprite
        var h = target.height*2
        sprite.visible = false;
        TweenLite.to(target, 1, {height: h, onComplete:callback}); 
    }
}

class ShrinkModifier extends Modifier {
    constructor(x,y){
        var sprite = new PIXI.Sprite.fromImage('assets/shrink.png');
        super(sprite, x, y);
    }

    apply(target, callback) {
        var sprite = this.sprite
        var h = target.height/2
        sprite.visible = false;
        TweenLite.to(target, 1, {height: h, onComplete:callback});
    }
}

class ColorModifier extends Modifier {
    constructor(x,y, color){
        var sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        sprite.tint = color
        super(sprite, x, y)
    }

    apply(target, callback) {
        var sprite = this.sprite
        sprite.visible = false;
        TweenLite.to(target, 0.5, {tint: sprite.tint, onComplete:callback});
    }
}

class SelectModifier extends Modifier {

    
    constructor(x,y, newMods){
        var sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        sprite.tint = 0x444444
        sprite.interactive = true
        sprite.buttonMode = true;
        super(sprite, x, y)
        this.mods = newMods
        this.selection = -1
        var thisObject = this;
        sprite.on('pointerdown', function(){
            thisObject.change();
        })
    }

    change(){
        this.selection = (this.selection + 1) % this.mods.length
        var mod = this.mods[this.selection]
        this.changeModifier(mod);
    }

    changeModifier(modifier){
        var parent = this.sprite
        parent.removeChildren()
        var newSprite = modifier.sprite
        parent.addChild(newSprite)
    }

    apply(target, callback) {
        var sprite = this.sprite
        var mod = this.mods[this.selection]
        mod.apply(target, function() {
            sprite.visible = false;
            callback();
        })    
    }
}
