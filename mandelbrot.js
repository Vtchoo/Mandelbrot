
var centerX = canvas.width/2
var centerY = canvas.height/2
var limit = 3
var sup_limitX = limit - 0.5
var inf_limitX = -limit - 0.5
var rangeX = sup_limitX - inf_limitX
var sup_limitY = limit * canvas.height/canvas.width
var inf_limitY = -limit * canvas.height/canvas.width
var rangeY = sup_limitY - inf_limitY
var max_it = 100
var brightnessIndex = [canvas.width*canvas.height] 

var startX, startY, endX, endY
var drawRect = false

needs_update = true

function setup() {

	//createCanvas(500, 500)
	createCanvas(1200, 600);
	background(220);
	pixelDensity(1)
}

function draw() {

	loadPixels()
  
  	if (needs_update){
		for (i = 0 ; i < canvas.width ; i++){

			for (j = 0 ; j < canvas.height ; j++){

				var bright = 0

				//var a = map(i , 0 , canvas.width , -limit , limit)
				//var b = map(j , 0 , canvas.height , -limit , limit)

				var a = inf_limitX + (i/canvas.width) * rangeX
				var b = inf_limitY + (j/canvas.height) * rangeY

				var ca = a
				var cb = b

				var n = 0
				var z = 0

				while (n < max_it){
					var aa = a*a - b*b
					var bb = 2*a*b

					a = aa + ca
					b = bb + cb

					if ( abs(a+b) > 20){ break; }

					n++
				}

				brightnessIndex[j * canvas.width + i] = 255 * (1 - n / max_it)

				if (n == max_it){ bright = 0 }
			}
		}
		needs_update = false
	}

	for (i = 0 ; i < canvas.width ; i++){
			for (j = 0 ; j < canvas.height ; j++){
				
				bright = brightnessIndex[j * canvas.width + i]

				var index = (j * canvas.width + i)*4 ;
				pixels[index + 0] = bright * j/canvas.height
				pixels[index + 1] = bright //* Math.random()
				pixels[index + 2] = bright * i/canvas.width
				pixels[index + 3] = 255
			}
		}

	updatePixels()

	if (drawRect){
		noFill()
		stroke('red')
		rect(startX, startY, mouseX - startX, mouseY - startY)
	}
}

canvas.onmousedown = function(){
	startX = mouseX
	startY = mouseY
	drawRect = true
}

canvas.onmouseup = function(){
	endX = mouseX
	endY = mouseY

	if (startX > endX){
		var temp = startX
		startX = endX
		endX = temp
	}

	if (startY > endY){
		var temp = startY
		startY = endY
		endY = temp
	}

	var deltaX = endX - startX
	var deltaY = endY - startY
	var prop = deltaX/deltaY

	var new_inf_limitX, new_sup_limitX, new_rangeX
	var new_inf_limitY, new_sup_limitY, new_rangeY

	if (prop > canvas.width/canvas.height){

		deltaY = deltaX * canvas.height/canvas.width

		new_inf_limitX = inf_limitX + startX*rangeX/canvas.width
		new_sup_limitX = inf_limitX + endX*rangeX/canvas.width
		new_rangeX = new_sup_limitX - new_inf_limitX

		new_rangeY = new_rangeX * canvas.height/canvas.width
		new_inf_limitY = ((endY + startY)/2)*rangeY/canvas.height + inf_limitY - new_rangeY/2
		new_sup_limitY = ((endY + startY)/2)*rangeY/canvas.height + inf_limitY + new_rangeY/2

		//new_inf_limitY = inf_limitY + startY*rangeY/canvas.height
		//new_sup_limitY = inf_limitY + endY*rangeY/canvas.height
		//new_rangeY = new_sup_limitY - new_inf_limitY
	
	}else{

		deltaX = deltaY * canvas.width/canvas.height

		new_inf_limitY = inf_limitY + startY*rangeY/canvas.height
		new_sup_limitY = inf_limitY + endY*rangeY/canvas.height
		new_rangeY = new_sup_limitY - new_inf_limitY

		new_rangeX = new_rangeY * canvas.width/canvas.height
		new_inf_limitX = ((endX + startX)/2)*rangeX/canvas.width + inf_limitX - new_rangeX/2
		new_sup_limitX = ((endX + startX)/2)*rangeX/canvas.width + inf_limitX + new_rangeX/2

	}

	inf_limitX = new_inf_limitX
	sup_limitX = new_sup_limitX
	rangeX = new_rangeX

	inf_limitY = new_inf_limitY
	sup_limitY = new_sup_limitY
	rangeY = new_rangeY

	needs_update = true
	console.log("Update")

	drawRect = false
}


