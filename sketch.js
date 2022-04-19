p5.disableFriendlyErrors = false


function setNextTile(x, y, tile) {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
    if (tile.type == nextTiles[x][y].type) return

    tile.positionX = x
    tile.positionY = y
    nextTiles[x][y] = tile
    return true
}

function setTile(x, y, tile, force) {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
    if (!force) {
        if (tile.type == tiles[x][y].type) return
    }
    if (tiles[x][y]) {
        if (tiles[x][y].indestructable) return
        tiles[x][y].kill()
    }

    tile.positionX = x
    tile.positionY = y
    tiles[x][y] = tile
    nextTiles[x][y] = tile
    tiles[x][y].live()
    return true
}

function killTile(x, y) {
    tiles[x][y].kill()
}

function getTile(x, y, array) {
    if (!array) array = tiles
    //console.log(`getting tile: ${x}, ${y}`)
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
        //console.log(`returning tile: ${x}, ${y} = ${tiles[x][y].type}`)
        return tiles[x][y]
    } else {
        console.log(`failed to getTile: ${x}, ${y}. out of bounds`)
        return false
    }
}

function getNextTile(x, y) {
    return getTile(x, y, nextTiles)
}

function swapTiles(x, y, x2, y2) {
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT
        && x2 >= 0 && x2 < WIDTH && y2 >= 0 && y2 < HEIGHT) {
        // swap the tiles
        temp = nextTiles[x][y]
        nextTiles[x][y] = tiles[x2][y2]
        nextTiles[x2][y2] = temp
        // set the position of the tiles to their new values
        nextTiles[x][y].positionX = x
        nextTiles[x][y].positionY = y
        nextTiles[x2][y2].positionX = x2
        nextTiles[x2][y2].positionY = y2
    } else {
        console.log(`failed to swap: ${x}, ${y} and ${x2}, ${y2}. out of bounds`)
        return false
    }
}

function checkTiles(x, y, types, next) {
    if (!next) tile = tiles[x][y]
    else tile = nextTiles[x][y]
    for (i = 0; i < types.length; i++) {
        if (tile.type == types[i]) {
            return true
        }
    }
}

function preload() {
    font = loadFont('assets/font/arial.ttf')
}


function setupTiles() {
    WIDTH = 100
    HEIGHT = 100
    TILESIZE = 10
    tiles = Array.from(Array(WIDTH), () => new Array(HEIGHT))
    lifeNeighbours = Array.from(Array(WIDTH), () => new Array(HEIGHT))
    nextLifeNeighbours = Array.from(Array(WIDTH), () => new Array(HEIGHT))
    nextTiles = Array.from(Array(WIDTH), () => new Array(HEIGHT))

    offsetY = (HEIGHT * TILESIZE) / 2
    offsetX = (WIDTH * TILESIZE) / 2
    tiles[WIDTH / 2][HEIGHT / 2] = new PinkTile(WIDTH / 2, HEIGHT / 2)
    rotation = 0

    for (i = 0; i < WIDTH; i++) {
        for (j = 0; j < HEIGHT; j++) {
            tiles[i][j] = new EmptyTile(i, j)
            nextTiles[i][j] = new EmptyTile(i, j)
            if (i == 0 || i == WIDTH - 1 || j == 0 || j == HEIGHT - 1) {
                setTile(i, j, new BorderTile())
            }
            lifeNeighbours[i][j] = 0
            nextLifeNeighbours[i][j] = 0
        }
    }

    setTile(1, 1, new RedVirus())

    left = false
    right = false
}

function setup() {


    darkMode = true
    if (darkMode) {
        backgroundColor = 100
    } else {
        backgroundColor = 220
    }
    webgl = false

    perfTest = false
    debugEnabled = false

    debugUI = true

    setupTiles()
    setupInterface()

    if (webgl) {
        createCanvas(windowWidth, windowHeight, WEBGL)
        textFont(font)
    } else {
        createCanvas(windowWidth, windowHeight)

    }

    fr = 600
    speed = 0.5
    dt = 1


    fps = 1
    c = color(255, 0, 0)
    strokeWeight(0)
    count = 0
    count2 = 0

    mouseDown = false


    mouseTileX = 0
    mouseTileY = 0
    mouseDownPosX = 0
    mouseDownPosY = 0
    mouseUpPosX = 0
    mouseUpPosY = 0
    lastPosX = 0
    lastPosY = 0
    selectedTile = 0
    tileTypes = [PinkTile, BlueTile, RedVirus, BlueTile, Life, Sand, Gravel, Water]
    gameSpeed = 0
    paused = false
    pauseMenuOpen = false
    pauseToggle = false
    amountOfTileTypes = tileTypes.length - 1

    openedTime = 0
    closedTime = 0




    if (perfTest) {
        // fill entire grid with PinkTile
        for (let x = 0; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT; y++) {
                setTile(x, y, new PinkTile)
            }
        }
    }
}

function draw() {



    if (webgl) {
        translate(-width / 2, -height / 2, 0)

    }


    background(backgroundColor)


    input()


    count = count + gameSpeed * deltaTime
    if (count > 100 && !paused) tick()
    //if (checkTile(1,1,[0])) console.log("yeah")

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
                if (tile) {
                    if (tile.visible) {
                        if (!tile.level) mult = 1
                        else {
                            level = tile.level
                            mult = level / 100
                        }
                        //console.log(`filling tile: ${i}, ${j}`)
                        fill(tile.color)
                        if (tile.positionX != i || tile.positionY != j) {
                            fill(color(255, 0, 0))
                        }
                        rect(
                            i * TILESIZE + offsetX,
                            j * TILESIZE + offsetY + TILESIZE,
                            TILESIZE,
                            -TILESIZE * mult
                        )
                    }
                } else {
                    console.log(`tile is null: ${i}, ${j}`)
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
    if (debugEnabled) {
        tile = getTile(mouseTileX, mouseTileY)
        nextTile = getNextTile(mouseTileX, mouseTileY)
        if (nextTile == tile) nextTile = "same"

        info = `
DT :  ${dt.toFixed(1)}\nFPS: ${fps.toFixed(1)}
mousetile: ${mouseTileX},${mouseTileY}\n
${mouseTileX},${mouseTileY}: ${String(getTile(mouseTileX, mouseTileY).type)}
${String(getTile(mouseTileX, mouseTileY).color)}
next:${nextTiles[mouseTileX][mouseTileY]}
offset: ${offsetX}\n${offsetY}
ilesize: ${TILESIZE}
newfps:${frameRate().toFixed(2)}
start:${startX},${startY}
end:${stopX},${stopY}\n${count}\n${count2}
gamespeed: ${gameSpeed}\n
tile:${JSON.stringify(getTile(mouseTileX, mouseTileY))}
nextTile:${JSON.stringify(nextTile)}
lifeNeighbours: ${lifeNeighbours[mouseTileX][mouseTileY]}]
nextLifeNeighbours: ${nextLifeNeighbours[mouseTileX][mouseTileY]}]
color: ${getTile(mouseTileX, mouseTileY).color}
mousePos: ${mouseX},${mouseY}}`
        fill(0, 0, 0)

        text(info, textPosX + 1, textPosY + 1)
        fill(0, 255, 0)

        text(info, textPosX, textPosY)

    }

    fill(0, 0, 0)


    info2 = ""
    text(info2, 0, 50)
    text(`${selectedTile}: ${tileTypes[selectedTile]}\nrotation: ${rotation}`, width - 100, 30)
    strokeWeight(1)
    fill(0, 255, 0)


    info3 = ``
    text(info3, textPosX + 50, textPosY + 50)
    strokeWeight(0)

    drawUI()
}

function mouseWheel(event) {
    if (event.delta < 0) {
        if (TILESIZE + 5 < 100) {
            TILESIZE += 5
            offsetX = offsetX - (5 * mouseTileX)
            offsetY = offsetY - (5 * mouseTileY)
        }
    } else {
        if (TILESIZE - 5 > 3) {
            TILESIZE -= 5
            offsetX = offsetX + (5 * mouseTileX)
            offsetY = offsetY + (5 * mouseTileY)
        }
    }

    return false // prevents page scrolling
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}