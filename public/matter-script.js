var engine;
var ground;
var boxes=[];
var colors1 = "f47068-ffb3ae-fff4f1-1697a6-0e606b-ffc24b".split("-").map(a=>"#"+a);
var colors2 = "355070-6d597a-b56576-e56b6f-e88c7d-eaac8b".split("-").map(a=>"#"+a);
var colors3 = "ffdedc-f1b5b5-93939b-aab7ae-c6d2c6-dfe2db".split("-").map(a=>"#"+a);
var colors4 = "ffb7a1-f5d1c3-f0bc68-aab8bb-c4d7d1-5f9595".split("-").map(a=>"#"+a);
var colors;
var overAllTexture;

const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
    });


socket.on('chat message', (msg) => {
    generateNewBox(msg);

});

function setup() {	
	createCanvas(windowWidth,windowHeight);
	pixelDensity(2);
	background(100);
	colors=random([colors1,colors2,colors3,colors4]);
	
	let {Engine,Bodies,World}= Matter

  engine = Engine.create();
	//let boxA = Bodies.rectangle(400, 200, 80, 80);
  //let boxB = Bodies.rectangle(450, 50, 80, 80);
	let wallLeft = Bodies.rectangle(0-15, height/2,30,height, {
    isStatic: true
  });
	let wallRight = Bodies.rectangle(width+15, height/2,30,height, {
    isStatic: true
  });
  let ground = Bodies.rectangle(width/2,height,width, 60, {
    isStatic: true
  });
	//boxes.push(boxA,boxB)
	World.add(engine.world, boxes);
	World.add(engine.world, [ground,wallLeft,wallRight]);
	Engine.run(engine);
	
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	// noStroke()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(150,noise(i/10,i*o/300)*random([0,50,100])))
		}
	}
	overAllTexture.updatePixels()
}

function generateNewBox(msg){
	let {Engine,Bodies,World,Constraint}= Matter
	var word=msg;
	//var sz = random([20,40,60,80,100])
	var fontsize = random([20,30,40]);
	var sz = word.length*(fontsize*3/4);
	var sy = fontsize*2;
  let box = Bodies.rectangle(random(10,width-20),random(0,30), sz, sy);
	box.color = random(colors);
	box.fontsize = fontsize;
	box.char = word;
	boxes.push(box);
	World.add(engine.world, box);
}

function draw() {
	background(100);
	fill(0);
	rect(0,0,width,height);

    if(boxes.length>0){
        for(let box of boxes){
            var vertices = box.vertices;
            fill(box.color || 255)
            // noFill()
            stroke(0)
            strokeWeight(5)
            // noStroke()
            beginShape();
            for (let vert of vertices) {
                vertex(vert.x, vert.y);
            }
            endShape(CLOSE);
            push()
                translate(box.position.x,box.position.y)
                rotate(box.angle)
                fill(0)
                noStroke()
                let useTextSize = box.size*0.8 
                textSize(box.fontsize)
                textAlign(CENTER)
                textStyle(BOLD)
                text(box.char,0,box.fontsize*0.25)
            pop()
    }
	
	}
	// if (mouseIsPressed && frameCount%3==0){
	// 	generateNewBox()
	// }
	
	push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0)
	pop()
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

