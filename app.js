//Create a Pixi Application
let app = new PIXI.Application({width: 256, height: 128});

//Add the canvas
document.body.appendChild(app.view);

    var block0, block1, levelNumber, modifiers

    //Reading the JSON file
    var lvl = JSON.parse(levels)

    //Initializing auxiliary variables
    const h = app.screen.height/2
    const p0 = 20
    const pf = app.screen.width-20


function createLevel(i) {
    levelNumber = i
    //Make the level i
    let level = new PIXI.Container();
    app.stage.removeChildren();
    app.stage.addChild(level);

    //Make the path
    let route = new PIXI.Graphics();
    route.lineStyle(3, 0x808080)
    route.moveTo(p0, h)
    route.lineTo(pf, h)

    //Create the player block
    block0 = new PIXI.Sprite(PIXI.Texture.WHITE)
    block0.tint = parseInt(lvl[i].initial.color.replace(/^#/, ''), 16);
    block0.scale.y = lvl[i].initial.size
    block0.anchor.set(0.5);
    block0.position.set(p0, h);
    block0.interactive = true;
    block0.buttonMode = true;
    block0.on('pointerdown', onClick);


    //Create the final block
    block1 = new PIXI.Sprite(PIXI.Texture.WHITE)
    block1.tint = parseInt(lvl[i].final.color.replace(/^#/, ''), 16)
    block1.alpha = 0.5;
    block1.scale.y = lvl[i].final.size
    block1.anchor.set(0.5);
    block1.position.set(pf, h);
  
    //Add the path
    level.addChild(route)

    //Create the modifiers
    modifiers = []
    var n = lvl[i].modifiers.length + 1
    lvl[i].modifiers.forEach(function(obj, k){
        var x = ((k+1)*app.screen.width)/n
        var mod = createModifiers(obj, x, h);
        if (mod != undefined) {
            level.addChild(mod.sprite)
            modifiers.push(mod)
        }
    })

    //Add the blocks
    level.addChild(block1)
    level.addChild(block0)

}

function createModifiers(config, x, y){
    switch (config.type) {
        case "resize":
            if (config.size == 1){
                return new ShrinkModifier(x, y)
            } else {
                return new ExpandModifier(x, y)
            }
            break
        case "colorize":
            var color = parseInt(config.color.replace(/^#/, ''), 16);
            return new ColorModifier(x, y, color)
            break
        case "select":
            var mods = []
            config.options.forEach(function(obj){
                var mod = createModifiers(obj, 0, 0)
                if (mod!= undefined) {
                    mods.push(mod)
                }
            })
            return new SelectModifier(x, y, mods)
            break
    }
}


function onClick() {
    if (isGameReady()){
        goToStep(0);    
    } else {
        console.log("Choose a modifier")
    }
    
}

//Check if all modifiers are valid
function isGameReady() {

    for (var i = 0, j = modifiers.length;  i < j; i++) {
        var obj = modifiers[i]
        if (obj instanceof SelectModifier){
            if (obj.selection == -1) {
                return false
            }
        }    
    }
    return true
}

//Move the block between modifiers
function goToStep(i) {
    if (i < modifiers.length) {
        var mod = modifiers[i]
        TweenLite.to(block0, 1, {x:mod.sprite.x, ease: "Linear", onComplete:function(){
            mod.apply(block0, function() {goToStep(i+1)})    
        }})
        

    } else {
        TweenLite.to(block0, 1, {x:block1.x, onComplete:endLevel})     
    }
}

//Check if the level is completed
function endLevel(){
    if (block0.scale.y == block1.scale.y && block0.tint == block1.tint) {
        nextLevel();
    } else {
        createLevel(levelNumber);
    }
}

//Go to next level
function nextLevel(){
    var next = levelNumber + 1
    if (next < lvl.length) {
        createLevel(next)
    }
}




createLevel(0);