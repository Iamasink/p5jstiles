function input() {
    if (!paused) {


        mouseTileX = Math.floor((mouseX - offsetX) / TILESIZE)
        mouseTileY = Math.floor((mouseY - offsetY) / TILESIZE)

        if (keyIsDown(87)) {
            //w
            offsetY += speed * deltaTime
        }
        if (keyIsDown(65)) {
            //a
            offsetX += speed * deltaTime
        }
        if (keyIsDown(83)) {
            //s
            offsetY -= speed * deltaTime
        }
        if (keyIsDown(68)) {
            //d
            offsetX -= speed * deltaTime
        }
        if (keyIsDown(49)) {
            //1
            if (TILESIZE < 100) {
                TILESIZE++
                offsetX = offsetX - mouseTileX
                offsetY = offsetY - mouseTileY
            }
        }

        if (keyIsDown(50)) {
            //2

            if (TILESIZE > 3) {
                TILESIZE--
                offsetX = offsetX + mouseTileX
                offsetY = offsetY + mouseTileY
            }
        }

        if (keyIsDown(51)) {
            //3
            if (!lock51) {
                selectedTile++
                if (selectedTile > amountOfTileTypes) {
                    selectedTile = 0
                }
                lock51 = true
            }
        } else {
            lock51 = false
        }

        if (keyIsDown(52)) {
            //4
            if (!lock52) {
                tick()
                lock52 = true
            }
        } else {
            lock52 = false
        }

        // if 5 key pressed incease game speed to a max of 3
        if (keyIsDown(53)) {
            //5
            if (!lock53) {
                if (gameSpeed < 5) {
                    gameSpeed++
                } else {
                    gameSpeed = 0
                }
                lock53 = true
            }
        } else {
            lock53 = false
        }

        // if 6 key pressed
        if (keyIsDown(54)) {
            //6
            if (!lock54) {
                if (debugEnabled) {
                    debugEnabled = false
                } else {
                    debugEnabled = true
                }
                lock54 = true
            }
        } else {
            lock54 = false
        }




        // if r key pressed 
        if (keyIsDown(82)) {
            if (!lock82) {
                if (rotation > 2) {
                    rotation = 0
                } else {
                    rotation += 1
                }

                lock82 = true
            }
        } else {
            lock82 = false
        }

        // if p key pressed
        if (keyIsDown(80)) {
            if (!lock80) {
                // fill entire grid with pinkTile
                for (let x = 0; x < WIDTH; x++) {
                    for (let y = 0; y < HEIGHT; y++) {
                        setTile(x, y, new PinkTile)
                    }
                }

                lock80 = true
            }
        } else {
            lock80 = false
        }



        if (mouseIsPressed) {
            setTile(mouseTileX, mouseTileY, new tileTypes[selectedTile]())
            // console.log(JSON.stringify(pauseMenu))
        }







        if (
            mouseTileX >= 0 &&
            mouseTileY >= 0 &&
            mouseTileX < WIDTH &&
            mouseTileY < HEIGHT
        ) {
            lastPosX = mouseTileX
            lastPosY = mouseTileY
        }

        if (lastPosX != mouseTileX || lastPosY != mouseTileY) {
            if (tiles[lastPosX][lastPosY] == 2) {
                tiles[lastPosX][lastPosY] = 0
                if (tiles[lastPosX][lastPosY] == 0) {
                    tiles[lastPosX][lastPosY] = 2
                }
            }
        }
    }
    // always
    if (mouseIsPressed) {
        if (mouseDown == false) {
            mouseDownPosX = mouseX
            mouseDownPosY = mouseY
            //console.log(`mouseDownPos: ${mouseDownPosX},${mouseDownPosY}`)
            mouseDown = true
        }

    } else {
        if (mouseDown) {
            mouseUpPosX = mouseX
            mouseUpPosY = mouseY
            //console.log(`mouseUpPos: ${mouseUpPosX},${mouseUpPosY}`)
            mouseDown = false

        }
    }



}
function keyPressed() {
    if (keyCode === ESCAPE) {
        togglePauseMenu()
    } else if (keyCode === RIGHT_ARROW) {
        console.log(checkTile(1, 1, 1))
    }
}