class Button {
    /* Constructor expects parameters for
    fill color, x and y coordinates that
    will be used to initialize class properties.
    */
    constructor(bColor, x, y, x2, y2) {
        this.color = bColor
        this.x = x
        this.y = y
        this.x2 = x2
        this.y2 = y2
        this.pressed = false
        this.visible = true
    }


    display() {
        fill(this.color)
        rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y)
    }

    move() { // method!
        this.x += this.speed
            // Wrap x around boundaries
        if (this.x < -20) {
            this.x = width
        } else if (this.x > width) {
            this.x = -20
        }
    }
}

function setupTiles() {
    WIDTH = 100
    HEIGHT = 100
    TILESIZE = 10
    tiles = Array.from(Array(WIDTH), () => new Array(HEIGHT))
    nextTiles = Array.from(Array(WIDTH), () => new Array(HEIGHT))
    offsetY = (HEIGHT * -TILESIZE) / 2
    offsetX = (WIDTH * -TILESIZE) / 2
    tiles[1][1] = 1
    tiles[WIDTH / 2][HEIGHT / 2] = 1


    for (i = 0; i < WIDTH - 1; i++) {
        for (j = 0; j < HEIGHT - 1; j++) {
            tiles[i][j] = 0
            nextTiles[i][j] = 0
        }
    }
}

function setup() {
    button1 = new Button("blue", 10, 10, 50, 50)


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
    tileTypes = ["blank", "blue", "border", "red", "green", "black", "sand", "explosion", "water"]
    selectedTile = 0
    gameSpeed = 0
    paused = false
    amountOfTileTypes = tileTypes.length - 1



}



function draw() {
    if (!paused) { // unpaused behaviour

        input()
        count = count + gameSpeed * deltaTime
        if (count > 100) tick()
            //if (checkTile(1,1,[0])) console.log("yeah")
        strokeWeight(1)
        frameRate(fr)

        //tiles[0][((mouseTileY + offsetY) / TILESIZE).toFixed(0)] = 2;
        //tiles[((mouseTileX - offsetX) / TILESIZE).toFixed(0)][0] = 2

        background(220)
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
                if (
                    j + 1 > -1 * (offsetY / TILESIZE) &&
                    j - 1 < -1 * (offsetY / TILESIZE) + height / TILESIZE &&
                    i + 1 > -1 * (offsetX / TILESIZE) &&
                    i - 1 < -1 * (offsetX / TILESIZE) + width / TILESIZE
                ) {
                    if (i == 0 || i == WIDTH - 1 || j == 0 || j == HEIGHT - 1) {
                        tiles[i][j] = 2
                    }
                    switch (tiles[i][j]) {
                        case 0: // blank
                            c = color(255, 204, 0)
                            break
                        case 1: // blue
                            c = color(0, 0, 255)
                            break
                        case 2: // border
                            c = color(50, 50, 50)
                            break
                        case 3: // red
                            c = color(255, 0, 0)
                            break
                        case 4: // green
                            c = color(0, 255, 50)
                            break
                        case 5: // black
                            c = color(0, 0, 0)
                            break
                        case 6: // sand
                            c = color(200, 200, 20)
                            break
                        case 7: // explosion
                            c = color(255, 0, 0)
                            break
                        case 8: // water
                            c = color(0, 80, 255)
                            break
                        default:
                            c = color(255, 90, 40)
                    }

                    if (tiles[i][j]) {
                        strokeWeight(0)
                        fill(c)
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



        if (tiles[mouseTileX][mouseTileY] || tiles[mouseTileX][mouseTileY] === 0) {
            infoTile = tiles[mouseTileX][mouseTileY]
        } else {
            infoTile = "N/A"
        }
        strokeWeight(4)
        info = `DT :  ${dt.toFixed(1)}\nFPS: ${fps.toFixed(
			1
		)}\nmousetile: ${mouseTileX} \n${mouseTileY}\n\n${infoTile}\nnext:${nextTiles[mouseTileX][mouseTileY]
			}\noffset: ${offsetX}\n${offsetY}\ntilesize: ${TILESIZE}\nnewfps:${frameRate().toFixed(2)}\nstart:${startX},${startY}\nend:${stopX},${stopY}\n${count}\n${count2}\ngamespeed: ${gameSpeed}`
        fill(0, 0, 0)

        //text(info, textPosX + 1, textPosY + 1)
        info2 = ""
        text(info2, 0, 50)
        text(`${selectedTile}: ${tileTypes[selectedTile]}`, width - 100, 30)
        strokeWeight(1)
        fill(0, 255, 0)
            //text(info, textPosX, textPosY)
        strokeWeight(0)
    } else { // paused behaviour
        button1.display()
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
        // prevents page scrolling
    return false
}

function keyPressed() {
    if (keyCode === ESCAPE) {
        if (paused) { paused = false } else { paused = true }
    } else if (keyCode === RIGHT_ARROW) {
        value = 0
    }
}