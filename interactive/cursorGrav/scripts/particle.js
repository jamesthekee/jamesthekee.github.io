

class Particle {
    constructor(x_, y_, t) {
        this.x = x_;
        this.y = y_;
        this.type = t;

        this.xv = 0
        this.yv = 0;
    }

    gravitateTo(gravx, gravy){
        var d = sq(this.x-gravx) + sq(this.y-gravy);
        if(d < gravity_min_distance*gravity_min_distance){
          d = gravity_min_distance;
        }else{
          d = sqrt(d);
        }

        var angle = atan2(gravy-this.y, gravx-this.x) + random(0, gravity_angle_deviation);
        
        this.xv += gravity*cos(angle)/d;
        this.yv += gravity*sin(angle)/d;
    }

    gravitateTo2(gravx, gravy){
        var d = sq(this.x-gravx) + sq(this.y-gravy);
        if(d < gravity_min_distance*gravity_min_distance){
          d = gravity_min_distance;
        }

        var angle = atan2(gravy-this.y, gravx-this.x) + random(0, gravity_angle_deviation);
        
        this.xv += gravity*cos(angle)/d;
        this.yv += gravity*sin(angle)/d;
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
        var vel_angle = atan2(this.yv, this.xv);
        var speed = sqrt(sq(this.xv) + sq(this.yv));
        var col = color(map(vel_angle, 0, PI, 127, 0), map(speed, 0, 10, 150, 255), drawBrightness, drawOpacity);
        fill(col);
        ellipse(this.x, this.y, 6, 6);
    }
}