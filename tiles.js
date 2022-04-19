


class EmptyTile {
  constructor(x, y) {
    this.positionX = x
    this.positionY = y
    this.type = "empty"
    this.color = color(0, 250, 0)
    this.isTickable = false
    this.tickspeed = 10
    this.solidity = 0
    this.visible = false
    this.gravity = false
    this.weight = 0
    this.isGas = true // its air this makes sense okay

  }
  live() { } // function to run when created
  kill() { // function to run when destroyed
    tiles[this.positionX][this.positionY] = new EmptyTile(
      this.positionX,
      this.positionY
    )
  }
  tick() {
    // console.log(`ti// ck: ${this.positionX}, ${this.positionY}`)
    let lifeNeighbour = lifeNeighbours[this.positionX][this.positionY]
    if (lifeNeighbour == 3) nextTiles[this.positionX][this.positionY] = new Life()

  }
}

class Tile extends EmptyTile {
  constructor() {
    super()
    this.type = "tile"
    this.color = color(255, 0, 0)
    this.solidity = 100
    this.tickspeed = 1
    this.visible = true
    this.isGas = false
  }

  tick() { }
}

class PinkTile extends Tile {
  constructor() {
    super()
    this.type = "pink"
    this.color = color(255, 0, 255)
    this.isTickable = true
  }

  tick() {
    // console.log("pink ti// cked")
    this.color = color(255, 0, Math.floor(Math.random() * 255))

  }
  live() {
    this.tick()
  }

}

class RotatableTile extends Tile {
  constructor(rotation) {
    super()
    this.type = "rotatable"
    this.color = color(0, 255, 0)
    this.rotation = rotation
    this.rotatable = true
  }

  tick() { }
}

class BlueTile extends Tile {
  constructor() {
    super()
    this.type = "blue"
    this.color = color(0, 0, 255)
    this.infectable = true
  }
}

class BorderTile extends Tile {
  constructor() {
    super()
    this.type = "border"
    this.color = color(50, 50, 50)
    this.indestructable = true
    this.weight = 99999
  }
}

class Virus extends Tile {
  constructor() {
    super()
    this.type = "virus"
    this.virusStrength = 1
    this.isTickable = true
    this.stamina = 100
  }

  tick() {
    // console.log(// count2)
  }
}

class RedVirus extends Virus {
  constructor() {
    super()
    this.type = "redVirus"
    this.color = color(255, 0, 0)
    this.infectable = true
  }
  tick() {
    super.tick() // this runs the parent class tick function (Virus)
    if (this.stamina > 0) {
      this.color = color(240 + random(-55, 15), 0, 0)
      this.stamina -= 1
    }
  }
}

class GreenVirus extends Virus {
  constructor() {
    super()
    this.type = "greenVirus"
    this.color = color(0, 255, 0)
    this.infectable = true
  }
}

class Life extends Tile {
  constructor() {
    super()
    this.type = "life"
    this.color = color(0, 50, 0)
    this.isTickable = true
    this.tickspeed = 10
  }

  live() {
    // console.log(`life // // created at ${this.positionX}, ${this.positionY}`)
    for (i = -1; i < 2; i++) {
      for (j = -1; j < 2; j++) {

        // console.log(`${this.positionX + i}, ${this.positionY + j}`)
        if (i == 0 && j == 0) { } else {

          // console.log("not at // // center")
          lifeNeighbours[this.positionX + i][this.positionY + j]++
          let nextTile = nextTiles[this.positionX + i][this.positionY + j]
          if (nextTile.type == "empty") {
            nextTile.isTickable = true
            // console.log("final // // che// // ck. next set ti// // ckable")
          }
          let tile = tiles[this.positionX + i][this.positionY + j]
          if (tile.type == "empty" && lifeNeighbours[this.positionX + i][this.positionY + j] == 1) {
            tile.isTickable = true
            // console.log("final // // che// // ck.  set ti// // ckable")
          }
        }
      }
    }
  }

  kill() {
    // console.log(`life at ${this.positionX}, ${this.positionY} killed`)
    for (i = -1; i < 2; i++) {
      for (j = -1; j < 2; j++) {
        // console.log(`${this.positionX + i}, ${this.positionY + j}`)
        if (i == 0 && j == 0) { } else {

          // console.log("not at // // center")
          lifeNeighbours[this.positionX + i][this.positionY + j]--
          let nextTile = nextTiles[this.positionX + i][this.positionY + j]
          if (nextTile.type == "empty" && lifeNeighbours[this.positionX + i][this.positionY + j] == 0) {
            nextTile.isTickable = false
            // console.log("final // // che// // ck, next set not ti// // ckable")
          }
          let tile = tiles[this.positionX + i][this.positionY + j]
          if (tile.type == "empty" && lifeNeighbours[this.positionX + i][this.positionY + j] == 0) {
            tile.isTickable = false
            // console.log("final // // che// // ck, set not ti// // ckable")
          }
        }
      }
    }
    nextTiles[this.positionX][this.positionY] = new EmptyTile(this.positionX, this.positionY)
  }

  tick() {

    let lifeNeighbour = lifeNeighbours[this.positionX][this.positionY]
    if (lifeNeighbour != 2 && lifeNeighbour != 3) {
      nextTiles[this.positionX][this.positionY] = new EmptyTile(this.positionX, this.positionY)
    }
  }
}

class GravityTile extends Tile {
  constructor() {
    super()
    this.gravity = true
    this.weight = 1
    this.integrity = 1 // basically the gradient it will make when piling up
    this.isTickable = true
  }
  //   tick() {
  //     let tile = tiles[this.positionX][this.positionY + 1]
  //     let nextTile = nextTiles[this.positionX][this.positionY + 1]
  //     if (nextTile.type != this.type && nextTile.weight < this.weight && !nextTile.indestructable) {
  //       if ((nextTile.isLiquid || nextTile.isGas)) {

  //         let temp = nextTiles[this.positionX][this.positionY + 1]
  //         nextTiles[this.positionX][this.positionY + 1] = new

  //           temp.positionX = this.positionX
  //         temp.positionY = this.positionY

  //         nextTiles[this.positionX][this.positionY] = temp




  //       }
  //     }

  //     let leftNextTile = tiles[this.positionX - 1][this.positionY + 1]
  //     if (leftNextTile.type != this.type && leftNextTile.weight < this.weight && !nextTile.indestructable) {
  //       if ((leftNextTile.isLiquid || leftNextTile.isGas)) {
  //         left = true
  //       }
  //     }


  //     let rightNextTile = nextTiles[this.positionX + 1][this.positionY + 1]
  //     if (rightNextTile.type != this.type && rightNextTile.weight < this.weight && (rightNextTile.isLiquid || rightNextTile.isGas)) {
  //       if ((rightNextTile.isLiquid || rightNextTile.isGas)) {


  //       }
  //     }



  //     if (left && !right) {


  //       let temp = tiles[this.positionX - 1][this.positionY + 1]
  //       let temp2 = tiles[this.positionX][this.positionY]
  //       temp.positionX = this.positionX
  //       temp.positionY = this.positionY
  //       temp2.positionX = this.positionX - 1
  //       temp2.positionY = this.positionY + 1

  //       console.log(`${JSON.stringify(temp)}`)
  //       console.log(`${JSON.stringify(temp2)}`)


  //       nextTiles[this.positionX - 1][this.positionY + 1] = temp2




  //       nextTiles[this.positionX][this.positionY] = temp


  //     }
  //     if (right && !left) {

  //     }
  //     if (left && right) {
  //       let r = Math.floor(Math.random() * 2)
  //       if (r == 0) {

  //       }
  //       if (r == 1) {

  //       }
  //     }



  //   }
}

class Sand extends GravityTile {
  constructor() {
    super()
    this.type = "sand"
    this.color = color(200, 200, 20)
    this.weight = 1620
  }
  tick() {
    super.tick()
  }
}

class Gravel extends GravityTile {
  constructor() {
    super()
    this.type = "gravel"
    this.color = color(76, 76, 84)
    this.weight = 1620
  }
  tick() {
    super.tick()
  }
}

class LiquidTile extends GravityTile {
  constructor() {
    super()
    this.level = 100
    this.isLiquid = true
    this.isTickable = true
  }
  tick() {

  }
}

class Water extends LiquidTile {
  constructor() {
    super()
    this.type = "water"
    this.color = color(0, 80, 255)
    this.solidity = 0
    this.weight = 1000
  }
}
