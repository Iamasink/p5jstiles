function input() {
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

    if (keyIsDown(53)) {
        //5
        if (!lock53) {
            if (gameSpeed > 50) {
                gameSpeed = 0
            } else {
                gameSpeed += 5
            }

            lock53 = true
        }
    } else {
        lock53 = false
    }

    if (mouseIsPressed) {
        if (
            mouseTileX >= 0 &&
            mouseTileY >= 0 &&
            mouseTileX < WIDTH &&
            mouseTileY < HEIGHT
        ) {
            tiles[mouseTileX][mouseTileY] = selectedTile
            nextTiles[mouseTileX][mouseTileY] = selectedTile
        }
    } else {}





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