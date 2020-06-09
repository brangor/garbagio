const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const c = canvas.getContext('2d')

const squareArray = []
squaresWide = canvas.width/20
squaresTall = canvas.height/20
spinIncrementor = .01
direction = 0

const colorMin = "#101010"
const colorMax = "#ffffff"
const colorArray = gradient(colorMin, colorMax, 100)

const debounce = (func) => {
  let timer
  return (event) => {
    if (timer) { clearTimeout(timer) }
    timer = setTimeout(func, 100, event)
  }
}

window.addEventListener('resize', debounce(() => {
  canvas.width = window.innerWidth+20
  canvas.height = window.innerHeight+20
  squaresWide = canvas.width/20
  squaresTall = canvas.height/20
  init()
}))

const init = () => {
  squareArray.length = 0
  id = 0
  for (let i = 0; i < squaresWide; i++) {
    for (let j = 0; j < squaresTall; j++) {
      x = i * 20
      y = j * 20
      width = 25
      squareArray.push(new Square(x, y, width))
    }
  }
}

const Square = function(x, y, width) {
  this.x = x
  this.y = y
  this.width = width
  this.gradientIncrement = 1
  this.colorIndex = Math.floor(Math.random() * Math.floor(colorArray.length))
  this.color = colorArray[this.colorIndex]

  this.draw = function() {
    c.fillStyle = this.color
    c.fillRect(this.x, this.y, width, width)
  }

  this.update = function(direction) {
    this.x += Math.cos(direction)*5;
    this.y += Math.sin(direction)*5;
    this.colorIndex = this.colorIndex + this.gradientIncrement

    if (this.colorIndex >= colorArray.length-10) {
      this.gradientIncrement = -1
    } else if (this.colorIndex <= 0) {
      this.gradientIncrement = 1
    }

    this.color = colorArray[this.colorIndex]

    c.fillStyle = this.color
    if (this.x > innerWidth) {
      this.x = 0
    }

    if (this.y > innerHeight ) {
      this.y = 0
    }

    if (this.x < 0) {
      this.x = innerWidth;
    }

    if (this.y < 0 ) {
      this.y = innerHeight
    }

    this.draw()
  }
}

const animate = () => {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, innerWidth, innerHeight)

  direction += spinIncrementor

  if (direction > 100) {
    direction = 0
  } else if (Math.floor(10*direction) % 25 == 0) {
    spinIncrementor = ((Math.random() * 2) - 1) * .01
  }

  for (let i = 0; i < squareArray.length; i++) {
    squareArray[i].update(direction)
  }

}

init()
animate()

function gradient(startColor, endColor, steps) {
  var start = {
    'Hex'   : startColor,
    'R'     : parseInt(startColor.slice(1,3), 16),
    'G'     : parseInt(startColor.slice(3,5), 16),
    'B'     : parseInt(startColor.slice(5,7), 16)
  }
  var end = {
    'Hex'   : endColor,
    'R'     : parseInt(endColor.slice(1,3), 16),
    'G'     : parseInt(endColor.slice(3,5), 16),
    'B'     : parseInt(endColor.slice(5,7), 16)
  }
  diffR = end['R'] - start['R'];
  diffG = end['G'] - start['G'];
  diffB = end['B'] - start['B'];

  stepsHex  = new Array();
  stepsR    = new Array();
  stepsG    = new Array();
  stepsB    = new Array();

  for(var i = 0; i <= steps; i++) {
    stepsR[i] = start['R'] + ((diffR / steps) * i);
    stepsG[i] = start['G'] + ((diffG / steps) * i);
    stepsB[i] = start['B'] + ((diffB / steps) * i);
    stepsHex[i] = '#' + Math.round(stepsR[i]).toString(16) + '' + Math.round(stepsG[i]).toString(16) + '' + Math.round(stepsB[i]).toString(16);
  }
  return stepsHex;

}
