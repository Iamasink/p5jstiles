function setupInterface() {
	// setup pause menu
	transitionTime = 1000 //ms


	pauseMenu = {
		openTime: 0,
		closeTime: 1000,
		background: {
			color: [0, 0, 0, 200],
			transitionTime: 1000
		},
		ui:
			[new Frame(25, 0, 50, 100, [
				new Button(0, 20, 100, 10,
					() => { togglePauseMenu() },
					"black", "white", "Resume", "white"),
				new Button(0, 35, 100, 10,
					() => { },
					"black", "white", "", "white"),
				new Button(0, 50, 100, 10,
					() => { },
					"black", "white", "It worked earlier.", "white"),
				new Slider(0, 65, 100, 10,
					() => { },
					"pink", "green", "It worked earlier.", "white"),


			])]


	}
}

function easeInQuint(time, beginning, change, duration) {
	return change * (time /= duration) * time * time * time * time + beginning
}

function togglePauseMenu() {
	if (pauseToggle) {
		closedTime = millis()
		pauseMenu.closeTime = 0
		pauseToggle = false

		setTimeout(() => {
			paused = false
		}, 1000)
	} else {
		pauseToggle = true
		paused = true
		openedTime = millis()
		pauseMenu.openTime = 0
	}
}


function drawUI() {
	if (paused) {
		drawPauseMenu()
	}
}

function drawPauseMenu() {
	// console.log(`// closedTime: ${// closedTime}, // closeTime: ${pauseMenu.// closeTime}, openedTime: ${openedTime}, openTime: ${pauseMenu.openTime}`)
	push()
	// background
	fillColor = []


	if (pauseMenu.openTime < pauseMenu.background.transitionTime) {
		pauseMenu.openTime = millis() - openedTime
	} else { pauseMenu.openTime = pauseMenu.background.transitionTime }
	for (i = 0; i < pauseMenu.background.color.length; i++) {
		fillColor[i] = pauseMenu.background.color[i]
	}
	if (pauseMenu.closeTime < pauseMenu.background.transitionTime) {
		pauseMenu.closeTime = millis() - closedTime
		// console.log(pauseMenu.// closeTime)
	} else { pauseMenu.closeTime = pauseMenu.background.transitionTime }




	fillColor[3] = (pauseMenu.openTime / pauseMenu.background.transitionTime) * pauseMenu.background.color[3]

	fill(fillColor[0], fillColor[1], fillColor[2], fillColor[3])
	rect(0, 0, windowWidth, windowHeight)


	for (let i = 0; i < pauseMenu.ui.length; i++) {
		pauseMenu.ui[i].display()
	}
	pop()
}




class UIObject {
	constructor(x, y, w, h,
		animInX = x, animInY = y, animInW = w, animInH = h, animinOpacity = 255, animInEasing = easeInQuint(),
		animOutX = x, animOutY = y, animOutW = w, animOutH = h, animOutOpacity = 255, animOutEasing = easeInQuint()) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.offsetX = 0
		this.offsetY = 0
		this.offsetW = 0
		this.offsetH = 0
		this.hasparent = null
		this.animIn = animIn
		this.animOut = animOut

		[x, y, w, h, opacity, time, easing]
	}
	animIn() {
		this.animInTime = 0
		this.isAnimatingIn = true
	}

	animate() {
		if (this.isAnimatingIn) {

		}
	}

	animateIn(time, maximumTime, offsetX, offsetY, offsetW, offsetH) {
		// if (time < maximumTime) {
		// 	time = millis() - time
		// } else { time = maximumTime }


		// this.offsetY = easeInQuint(time, offsetY, -offsetY, maximumTime)
		// this.offsetW = easeInQuint(time, offsetW, -offsetW, maximumTime)
		// this.offsetX = easeInQuint(time, offsetX, -offsetX, maximumTime)
		// this.offsetH = easeInQuint(time, offsetH, -offsetH, maximumTime)
	}
	animateOut(time, maximumTime, offsetX, offsetY, offsetW, offsetH) {
		// if (time < maximumTime) {
		// 	time = millis() - time
		// } else { time = maximumTime }

		// this.offsetY = easeInQuint(time, offsetY, -offsetY, maximumTime)
		// this.offsetW = easeInQuint(time, offsetW, -offsetW, maximumTime)
		// this.offsetX = easeInQuint(time, offsetX, -offsetX, maximumTime)
		// this.offsetH = easeInQuint(time, offsetH, -offsetH, maximumTime)
	}

	calculatePos() {
		if (!this.hasparent) {
			this.parentpixelsx = 0
			this.parentpixelsy = 0
			this.parentpixelsw = windowWidth
			this.parentpixelsh = windowHeight
		}

		this.pixelsx = (((this.x + this.offsetX) / 100) * this.parentpixelsw) + this.parentpixelsx
		this.pixelsy = (((this.y + this.offsetY) / 100) * this.parentpixelsh) + this.parentpixelsy
		this.pixelsw = (((this.w + this.offsetW) / 100) * this.parentpixelsw)
		this.pixelsh = (((this.h + this.offsetH) / 100) * this.parentpixelsh)

		if (this.children) {
			for (i = 0; i < this.children.length; i++) {
				this.children[i].hasparent = true
				this.children[i].parentpixelsx = this.pixelsx
				this.children[i].parentpixelsy = this.pixelsy
				this.children[i].parentpixelsw = this.pixelsw
				this.children[i].parentpixelsh = this.pixelsh
			}
		}

	}


}

class Frame extends UIObject {
	constructor(x, y, w, h, children) {
		super(x, y, w, h)
		this.children = children
		for (i = 0; i < this.children.length; i++) {
			this.children[i].hasparent = true
		}
	}

	display() {
		this.calculatePos()


		// console.log(this.pixelsx, this.pixelsy, this.pixelsw, this.pixelsh)

		if (debugUI) {
			push()
			strokeWeight(1)
			stroke(0, 250, 0, 150)
			fill(250, 0, 0, 150)
			rect(this.pixelsx, this.pixelsy, this.pixelsw, this.pixelsh)


			pop()
		}
		if (this.children) {
			for (i = 0; i < this.children.length; i++) {
				this.children[i].display()
			}
		}

	}
}



class Button extends UIObject {
	constructor(x, y, w, h, onClickFunc, primaryColor, secondaryColor, text, textPrimaryColor, textSecondaryColor) {
		super(x, y, w, h)
		this.primaryColor = primaryColor
		this.secondaryColor = secondaryColor
		this.text = text
		this.textPrimaryColor = textPrimaryColor
		this.textSecondaryColor = textSecondaryColor
		this.pressed = false
		this.onClickFunc = onClickFunc
	}

	display() {
		this.calculatePos()
		this.whenPressed()
		fill(this.color)
		rect(this.pixelsx, this.pixelsy, this.pixelsw, this.pixelsh)
		fill(this.textPrimaryColor)
		textAlign(CENTER, CENTER)
		textSize(this.pixelsh)
		textStyle(BOLD)
		text(this.text, this.pixelsx + this.pixelsw / 2, this.pixelsy + this.pixelsh / 2)

	}
	whenPressed() {

		//console.log(mouseDownPosX, this.pixelsx, this.mouseDownPosY, this.pixelsy, this.pixelsw, this.pixelsh)
		// every time the mouse is down, mousedowpos is set to the mouse position
		// when the mouse is lifted, mouseuppos is set to the mouse position

		// if the down position is within the bounds of the button, the button is pressed until the mousepos is not within the button and not clicked
		// if the down and up position are both within the bounds of the button, the button is clicked



		if (this.pressed) {
			this.color = this.secondaryColor
			if (mouseUpPosX > this.pixelsx
				&& mouseUpPosX < this.pixelsx + this.pixelsw
				&& mouseUpPosY > this.pixelsy
				&& mouseUpPosY < this.pixelsy + this.pixelsh) {
				if (!this.hasClicked) {
					this.onClick()
					this.hasClicked = true
				}
			}
		} else {
			this.color = this.primaryColor

		}

		if (mouseIsPressed
			&& mouseDownPosX > this.pixelsx
			&& mouseDownPosX < this.pixelsx + this.pixelsw
			&& mouseDownPosY > this.pixelsy
			&& mouseDownPosY < this.pixelsy + this.pixelsh) {
			this.pressed = true
		} else {
			this.pressed = false
			this.hasClicked = false

		}



	}
	onClick() {
		// console.log("// cli// ck!")
		this.onClickFunc()
	}
}

class Slider extends UIObject {
	constructor(x, y, w, h, onClickFunc, primaryColor, secondaryColor, text, textPrimaryColor, textSecondaryColor) {
		super(x, y, w, h)
		this.primaryColor = primaryColor
		this.secondaryColor = secondaryColor
		this.text = text
		this.textPrimaryColor = textPrimaryColor
		this.textSecondaryColor = textSecondaryColor
		this.pressed = false
		this.onClickFunc = onClickFunc
		this.value = 0
		this.maximumValue = 100
	}

	display() {
		this.calculatePos()
		this.whenPressed()
		// fill(this.color)
		// rect(this.pixelsx, this.pixelsy / 2, this.pixelsw, this.pixelsh)
		fill(this.color)
		rect(this.pixelsx, this.pixelsy + this.pixelsh / 4, this.pixelsw, this.pixelsh / 2)
		fill(this.secondaryColor)
		rect((this.pixelsx + this.pixelsw * (this.value / this.maximumValue)) - this.pixelsw * 0.005, this.pixelsy, this.pixelsw * 0.01, this.pixelsh)


	}
	whenPressed() {
		this.color = this.primaryColor
	}
}


// class Button extends UIObject {
// 	constructor(x, y, w, h, color, secondaryColor) {
// 		super(x, y, w, h)
// 		if (!this.pressedColor) {
// 			this.pressedColor = this.color
// 		}
// 		this.color = color
// 		this.secondaryColor = secondaryColor
// 	}

// 	display() {
// 		let maximumWidth = windowWidth
// 		let maximumHeight = windowHeight

// 		if (this.hasparent) {
// 			maximumWidth = this.parentpixelsw
// 			maximumHeight = this.parentpixelsh
// 			// console.log(`parent: `, this.parentpixelsw, this.parentpixelsh)
// 		}

// 		this.pixelsx = (this.x / 100) * maximumWidth
// 		this.pixelsy = (this.y / 100) * maximumHeight
// 		this.pixelsw = (this.w / 100) * maximumWidth
// 		this.pixelsh = (this.h / 100) * maximumHeight


// 		this.checkClicked()
// 		//text(this.text, this.x + 5, this.y + this.sizeY / 2)
// 		if (!this.pressed) {
// 			fill(this.color)
// 		} else {
// 			fill(this.secondaryColor)
// 		}
// 		// console.log(this.parentpixelsx, this.pixelsx, this.parentpixelsy, this.pixelsy, this.pixelsw, this.pixelsh)
// 		// console.log(this.parentpixelsx, this.parentpixelsy, this.parentpixelsw, this.parentpixelsh)
// 		// console.log(`re// ct: `, (this.x / 100) * this.parentpixelsw + this.parentpixelsx, (this.y / 100) * this.parentpixelsh + this.parentpixelsy, (this.w / 100) * this.parentpixelsw, (this.h / 100) * this.parentpixelsh)
// 		rect(this.parentpixelsx + this.pixelsx,
// 			this.parentpixelsy + this.pixelsy,
// 			this.pixelsw,
// 			this.pixelsh)
// 	}

// 	checkClicked() {

// 		if (
// 			mouseIsPressed &&
// 			mouseX > this.pixelsx - this.pixelsw / 2 &&
// 			mouseX < this.pixelsx + this.pixelsw / 2 &&
// 			mouseY > this.pixelsy - this.pixelsh / 2 &&
// 			mouseY < this.pixelsy + this.pixelsh / 2
// 		) {
// 			this.pressed = true
// 		} else {
// 			this.pressed = false
// 			if (this.pressed) { this.click() }
// 		}
// 	}
// 	click() {
// 		// console.log("// cli// ck!")
// 	}
// }

