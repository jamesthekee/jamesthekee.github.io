var particles = [];
var types = 5;

var gravity = 25;
var repulsion = 0.2;
var drag = 0.925;

var conversion_range=16
var gravity_range=40000

var count = 100;
var start_distance = 10;


function setup() {
    createCanvas(1200, 800);
    noStroke();

    for(var t=0; t<types; t++){
        var angle = t*TWO_PI/types;
        var dis = start_distance;

        for (var i = 0; i < count; i++) {
            particles.push(new Particle(width/2 + dis*cos(angle), height/2 + dis*sin(angle), 3,  t, 255));
            dis += 2;
            angle += 0.125;
        }
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
    //console.log(frameRate())
}

function mousePressed(){
    particles.push(new Particle(mouseX, mouseY, 5, int(random(5)), 255));
}
