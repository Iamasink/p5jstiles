class EmptyTile {
    constructor(x, y) {
        this.position = { x: x, y: y };
        this.type = "empty";
        this.color = color(0, 250, 0);
        this.isTickable = false
    }
    kill() {
        tiles[this.position.x][this.position.y] = new EmptyTile(this.position.x, this.position.y)
    }
    getPosition() {
        return this.position;
    }
}


class Tile extends EmptyTile {
    constructor() {
        super()
        this.type = "tile";
        this.color = color(255, 0, 0);
    }
    getPosition() {
        return this.position;
    }

    tick() {}
}

class PinkTile extends Tile {
    constructor() {
        super();
        this.type = "pink";
        this.color = color(255, 0, 255);
        this.isTickable = true
    }

    tick() {
        //console.log("pink ticked")
        this.color = color(255, 0, random(255));
    }
}

class RotatableTile extends Tile {
    constructor(rotation) {
        super();
        this.type = "rotatable";
        this.color = color(0, 255, 0);
        this.rotation = rotation;
        this.rotatable = true;
    }

    tick() {}
}

class BlueTile extends Tile {
    constructor() {
        super();
        this.type = "blue";
        this.color = color(0, 0, 255);
        this.infectable = true;
    }
}

class BorderTile extends Tile {
    constructor() {
        super();
        this.type = "border";
        this.color = color(50, 50, 50);
        this.indestructable = true;
    }
}

class Virus extends Tile {
    constructor() {
        super();
        this.type = "virus";
        this.virusStrength = 1;
        this.isTickable = true
        this.stamina = 100;

    }

    tick() {
        //console.log(count2)
    }
}

class RedVirus extends Virus {
    constructor() {
        super();
        this.type = "redVirus";
        this.color = color(255, 0, 0);
        this.infectable = true;
    }
    tick() {
        super.tick() // this runs the parent class tick function (Virus)
        if (this.stamina > 0) {
            this.color = color(240 + random(-55, 15), 0, 0);
            this.stamina -= 1;
        }
    }
}

class GreenVirus extends Virus {
    constructor() {
        super();
        this.type = "greenVirus";
        this.color = color(0, 255, 0);
        this.infectable = true;
    }
}

class Life extends Tile {
    constructor() {
        super();
        this.type = "life";
        this.color = color(0, 0, 0);
        console.log(this.getPosition())

        // for (i = -1; i < 2; i++) {
        //     for (j = -1; j < 2; j++) {
        //         lifeNeighbours[super.getPosition().x + i][super.getPosition().y + j] += 1
        //     }
        // }


    }
    kill() {
        for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
                lifeNeighbours[x + i][y + j] -= 1
            }
        }
        tiles[this.position.x][this.position.y] = new EmptyTile(this.position.x, this.position.y)
    }
}

class Sand extends Tile {
    constructor() {
        super();
        this.type = "sand";
        this.color = color(200, 200, 20);
    }
}

class Water extends Tile {
    constructor() {
        super();
        this.type = "water";
        this.color = color(0, 80, 255);
    }
}