

var particles = []

// Movement
var gravity = 16;
var drag = 0.98;
var gravity_angle_deviation = 0.2;
var gravity_min_distance = 3;

// Colours
var blurMode = true;
var blurOpacity = 50;
var drawOpacity = 100;
var drawBrightness = 255;


function setup() {
    createCanvas(1350, 900);
    colorMode(HSB, 255);
    noStroke();

    for(var i = 0 ; i < 1000 ; i++){
        particles.push(new Particle(random(width),random(height), 0));
    }
    background(0);
}

function draw() {
    if(!blurMode){
        background(0);
    }else{
        fill(0, 0, 0, blurOpacity);
        rect(0,0,width,height);
    }  

    for (var i = 0; i < particles.length; i++) {
        particles[i].gravitateTo(mouseX, mouseY);
        particles[i].applyDrag();
        particles[i].move();
        particles[i].bounce();
        particles[i].draw();
    }
    //console.log(frameRate())
}


function mousePressed(){
    particles.push(new Particle(mouseX, mouseY));
}
