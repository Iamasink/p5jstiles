class Button {
    /* Constructor expects parameters for
    fill color, x and y coordinates that
    will be used to initialize class properties.
    */
    constructor(bColor, x, y, x2, y2, type, text, pressedColor) {
        this.sizeX = x2 - x
        this.sizeY = y2 - y
        this.color = bColor
        this.pressedColor = pressedColor
        this.x = x
        this.y = y
        this.x2 = x2
        this.y2 = y2
        this.pressed = false
        this.text = text
        this.type = type
        buttons.push(this)
        if (!this.pressedColor) {
            this.pressedColor = this.color
        }
    }


    display() {
        this.checkClicked()
        text(this.text, this.x + 5, this.y + (this.sizeY / 2))
        if (!this.pressed) {
            fill(this.color)
            rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y)
        } else {
            fill(this.pressedColor)
            rect(this.x + 3, this.y + 3, -2 + this.x2 - this.x, -2 + this.y2 - this.y)

        }

    }

    checkClicked() {
        if (mouseIsPressed && mouseX > this.x && mouseX < this.x2 && mouseY > this.y && mouseY < this.y2) {
            this.pressed = true
        } else {
            this.pressed = false
        }
    }
}







function setTile(x, y, tile) {
    //console.log(`setting tile: ${x}, ${y}`)
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
        tile.position.x = x
        tile.position.y = y
        tiles[x][y] = tile
        nextTiles[x][y] = tile
        return true
    } else {
        console.log(`failed to setTile: ${x}, ${y}, ${tile}. out of bounds`)
        return false
    }
}

function killTile(x, y) {
    tiles[x][y].kill()
}

function getTile(x, y) {
    //console.log(`getting tile: ${x}, ${y}`)
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
        //console.log(`returning tile: ${x}, ${y} = ${tiles[x][y].type}`)
        return tiles[x][y]
    } else {
        console.log(`failed to getTile: ${x}, ${y}. out of bounds`)
        return false
    }
}






function setupTiles() {



    WIDTH = 100
    HEIGHT = 100
    TILESIZE = 10
    tiles = Array.from(Array(WIDTH), () => new Array(HEIGHT))
    lifeNeighbours = Array.from(Array(WIDTH), () => new Array(HEIGHT))
    nextTiles = Array.from(Array(WIDTH), () => new Array(HEIGHT))


    offsetY = (HEIGHT * -TILESIZE) / 2
    offsetX = (WIDTH * -TILESIZE) / 2
    tiles[WIDTH / 2][HEIGHT / 2] = new PinkTile(WIDTH / 2, HEIGHT / 2)
    rotation = 0


    for (i = 0; i < WIDTH; i++) {
        for (j = 0; j < HEIGHT; j++) {
            if (i == 0 || i == WIDTH - 1 || j == 0 || j == HEIGHT - 1) {
                setTile(i, j, new BorderTile())
            } else {
                setTile(i, j, new EmptyTile())
            }
            lifeNeighbours[i][j] = 0

        }
    }

    setTile(1, 1, new RedVirus())



}

function setup() {
    buttons = []
    button1 = new Button("blue", width / 10, height / 10, 50 + width / 10, 50 + height / 10, "pause", "test", "red")
    button2 = new Button("red", width / 10, height / 5, 50 + width / 10, 50 + height / 5, "pause", "test2", "pink")


    darkMode = true;
    if (darkMode) {
        backgroundColor = 100
    } else {
        backgroundColor = 220
    }


    setupTiles()
    createCanvas(windowWidth, windowHeight)



    fr = 600
    speed = 0.2
    dt = 1
    fps = 1
    c = color(255, 0, 0)
    count = 0
    count2 = 0

    mouseTileX = 0
    mouseTileY = 0
    lastPosX = 0
    lastPosY = 0
    selectedTile = 0
    tileTypes = [PinkTile, BlueTile, RedVirus, BlueTile, Life, Sand, Water]
    gameSpeed = 0
    paused = false
    amountOfTileTypes = tileTypes.length - 1



}



function draw() {
    background(backgroundColor)



    input()
    count = count + gameSpeed * deltaTime
    if (count > 100) tick()
        //if (checkTile(1,1,[0])) console.log("yeah")
    strokeWeight(1)
    frameRate(fr)


    //tiles[0][((mouseTileY + offsetY) / TILESIZE).toFixed(0)] = 2;
    //tiles[((mouseTileX - offsetX) / TILESIZE).toFixed(0)][0] = 2



    // -- tiles --
    startY = -1 * Math.floor(offsetY / TILESIZE) - 1
    startX = -1 * Math.floor(offsetX / TILESIZE) - 1
    stopY = Math.ceil(startY + height / TILESIZE) + 1
    stopX = Math.ceil(startX + width / TILESIZE) + 1

    if (startY < 0) startY = 0
    if (startX < 0) startX = 0
    if (stopY >= HEIGHT) stopY = HEIGHT
    if (stopX >= WIDTH) stopX = WIDTH

    for (i = startX; i < stopX; i++) {
        for (j = startY; j < stopY; j++) {
            tile = getTile(i, j)

            if (
                j + 1 > -1 * (offsetY / TILESIZE) &&
                j - 1 < -1 * (offsetY / TILESIZE) + height / TILESIZE &&
                i + 1 > -1 * (offsetX / TILESIZE) &&
                i - 1 < -1 * (offsetX / TILESIZE) + width / TILESIZE
            ) {

                //console.log("bruh" + tile)
                if (tile.type != "empty") {

                    strokeWeight(0)
                    fill(tile.color)
                    rect(
                        i * TILESIZE + offsetX,
                        j * TILESIZE + offsetY,
                        TILESIZE,
                        TILESIZE
                    )
                }
            }
        }
    }

    Smoothing = 0.9

    dt = dt * Smoothing + deltaTime * (1 - Smoothing)
    fps = 1000 / dt
    textPosX = 30
    textPosY = 40
    if (mouseTileX < 0) {
        mouseTileX = 0

    }
    if (mouseTileX >= WIDTH) {
        mouseTileX = WIDTH - 1
    }
    if (mouseTileY < 0) {
        mouseTileY = 0
    }
    if (mouseTileY >= HEIGHT) {
        mouseTileY = HEIGHT - 1
    }


    // -- UI --
    if (tiles[mouseTileX][mouseTileY] || tiles[mouseTileX][mouseTileY] === 0) {
        infoTile = tiles[mouseTileX][mouseTileY]
    } else {
        infoTile = "N/A"
    }
    strokeWeight(4)
    info = `
DT :  ${dt.toFixed(1)}\nFPS: ${fps.toFixed(1)}
mousetile: ${mouseTileX},${mouseTileY}\n
${mouseTileX},${mouseTileY}: ${String(getTile(mouseTileX, mouseTileY).type)}
${String(getTile(mouseTileX,mouseTileY).color)}
next:${nextTiles[mouseTileX][mouseTileY]}
offset: ${offsetX}\n${offsetY}
ilesize: ${TILESIZE}
newfps:${frameRate().toFixed(2)}
start:${startX},${startY}
end:${stopX},${stopY}\n${count}\n${count2}
gamespeed: ${gameSpeed}\n\\n${JSON.stringify(getTile(mouseTileX, mouseTileY))}
lifeNeighbours: ${lifeNeighbours[mouseTileX][mouseTileY]}`
    fill(0, 0, 0)

    text(info, textPosX + 1, textPosY + 1)
    info2 = ""
    text(info2, 0, 50)
    text(`${selectedTile}: ${tileTypes[selectedTile]}\nrotation: ${rotation}`, width - 100, 30)
    strokeWeight(1)
    fill(0, 255, 0)

    text(info, textPosX, textPosY)


    info3 = ``
    text(info3, textPosX + 50, textPosY + 50)
    strokeWeight(0)


    if (paused) {
        for (var a of buttons) {
            if (a.type == "pause") {
                a.display()

            }

        }
    }
}

function mouseWheel(event) {
    if (event.delta < 0) {
        if (TILESIZE < 100) {
            TILESIZE++
            offsetX = offsetX - mouseTileX
            offsetY = offsetY - mouseTileY
        }

    } else {
        if (TILESIZE > 3) {
            TILESIZE--
            offsetX = offsetX + mouseTileX
            offsetY = offsetY + mouseTileY
        }
    }


    print(event.delta)

    return false // prevents page scrolling
}

function keyPressed() {
    if (keyCode === ESCAPE) {
        if (paused) { paused = false } else { paused = true }
    } else if (keyCode === RIGHT_ARROW) {
        console.log(checkTile(1, 1, 1))
    }
}