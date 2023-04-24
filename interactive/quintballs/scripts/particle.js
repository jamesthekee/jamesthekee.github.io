

class Particle {
    constructor(x_, y_, r, t, opacity) {
        this.x = x_;
        this.y = y_;

        this.xv = 0
        this.yv = 0;

        this.radius = r;
        this.type = t;
        this.opacity = opacity;

        this.setColor(this.opacity);
    }
    
    setColor(){
        switch(this.type){
            case 0:
                this.color = color(0, 0, 250);
                break;
            case 1:
                this.color = color(250, 0, 0);
                break;
            case 2:
                this.color = color(35, 250, 20);
                break;
            case 3:
                this.color = color(250, 175, 0);
                break;
            case 4:
                this.color = color(220, 0, 130);
                break;
        }
        this.color.setAlpha(this.opacity);
    }

    applyGravity(particles){
        for(var i=0; i<particles.length; i++){
            if(particles[i].type != this.type){
                var sq_distance = sq(this.x-particles[i].x) + sq(this.y-particles[i].y);
            
                if(sq_distance < conversion_range && (this.type+1) % types == particles[i].type){
                    particles[i].type = this.type;
                    particles[i].setColor();
                }

                //succ particle
                else if (sq_distance < gravity_range){
                    if(sq_distance < 0.5)
                        sq_distance = 0.5;

                    var angle = atan2(particles[i].y-this.y, particles[i].x-this.x);
                    if((this.type+1) % types == particles[i].type){
                        this.xv += gravity * cos(angle) / sq_distance;
                        this.yv += gravity * sin(angle) / sq_distance;
                    }
                    else if((this.type-1) % types == particles[i].type){
                        this.xv -= repulsion * gravity * cos(angle) / sq_distance;
                        this.yv -= repulsion * gravity * sin(angle) / sq_distance;
                    }
                }
            }
        }
    }

    applyDrag(){
        this.xv *= drag;
        this.yv *= drag;
    }

    move(){
        this.x += this.xv;
        this.y += this.yv;
    }

    bounce(){
        if((this.x < 0)||(this.x > width))this.xv *= -1;
        if((this.y < 0)||(this.y > height))this.yv *= -1;
    }

    draw() {
        fill(this.color);
        ellipse(this.x, this.y, 2*this.radius, 2*this.radius);
    }
}