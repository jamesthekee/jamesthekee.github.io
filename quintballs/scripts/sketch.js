var particles = [];
var types = 5;

var gravity = 25;
var repulsion = 0.2;
var drag = 0.925;

var conversion_range=16
var gravity_range=40000

var count = 50;


function setup() {
    createCanvas(1200, 800);
    noStroke();

    particles = [];
    for (var i = 0; i < count; i++) {
        particles[i] = new Particle(random(width)/2 + width/4, random(height)/2 + height/4, 3, int(random(5)), 255);
    }
}

function draw() {
    background(0);


    for (var i = 0; i < particles.length; i++) {
        particles[i].applyGravity(particles);
        particles[i].applyDrag();
        particles[i].move();
        particles[i].bounce();
        particles[i].draw();
    }
}

function mousePressed(){
    //particles.push(new Particle(mouseX, mouseY, 4, 3, int(random(5)), 255));
    particles.push(new Particle(mouseX, mouseY, 3, int(random(5)), 255));
    console.log(particles);
}
