const fragmentShaderSource = `
    precision mediump float;
    
    uniform vec2 iResolution;
    uniform float iTime;
    
    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = fragCoord/iResolution.xy;
        vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
        fragColor = vec4(col,1.0);
    }
    
    void main() {
        vec4 color;
        mainImage(color, gl_FragCoord.xy);
        gl_FragColor = color;
    }
`;

const shaderVortex = `
#define MOD3 vec3(.1031,.11369,.13787)
#define PI 3.141592654
#define gridscale 4.
#define aberration 0.08
#define smoothness 0.1
#define vortexes 100.
#define vortexWidth 0.2
#define swirliness .7

precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

vec3 hash33(vec3 p3){
	p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}
float perlin_noise(vec3 p){
    vec3 pi = floor(p);
    vec3 pf = p - pi;
    vec3 w = pf * pf * (3.0 - 2.0 * pf);
    return 	mix(mix(mix(dot(pf - vec3(0, 0, 0), hash33(pi + vec3(0, 0, 0))), 
                        dot(pf - vec3(1, 0, 0), hash33(pi + vec3(1, 0, 0))),w.x),
                	mix(dot(pf - vec3(0, 0, 1), hash33(pi + vec3(0, 0, 1))), 
                        dot(pf - vec3(1, 0, 1), hash33(pi + vec3(1, 0, 1))),w.x),w.z),
        		mix(mix(dot(pf - vec3(0, 1, 0), hash33(pi + vec3(0, 1, 0))), 
                        dot(pf - vec3(1, 1, 0), hash33(pi + vec3(1, 1, 0))),w.x),
                   	mix(dot(pf - vec3(0, 1, 1), hash33(pi + vec3(0, 1, 1))), 
                        dot(pf - vec3(1, 1, 1), hash33(pi + vec3(1, 1, 1))),w.x),w.z),w.y);
}


float monoboard(vec2 p){
    float t = mod(floor(gridscale*p.x)+floor(gridscale*p.y),2.0);
    return clamp(t, 0.2, 0.9);

}

float smoothSquareWave(float x, float eps){
    return sin(x*PI)/sqrt(pow(sin(x*PI),2.)+eps);
}

vec3 checkerboard2(vec2 p){
    p = p*gridscale;
    float t = mod(floor(p.x)+floor(p.y),2.);

    float r1 = smoothSquareWave(t+p.y+aberration, smoothness);
    float g1 = smoothSquareWave(t+p.y, smoothness);
    float b1 = smoothSquareWave(t+p.y-aberration, smoothness);

    float r2 = smoothSquareWave(t+p.x+aberration, smoothness);
    float g2 = smoothSquareWave(t+p.x, smoothness);
    float b2 = smoothSquareWave(t+p.x-aberration, smoothness);

    float r = abs(r1-r2);
    float g = abs(g1-g2);
    float b = abs(b1-b2);
    
    return vec3(r,g,b);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    vec2 chessv = uv;
    
    vec2 vort, dir;
    float rad, z,d,angle;
    
    for(float i=0.; i<vortexes; i++){
        vort.x = 1.7*perlin_noise(vec3(-i*5.3, .2*iTime+i, 0.))*sin(.2*iTime);
        vort.y = 1.*perlin_noise(vec3(i*2.7+.8, .2*iTime+1.+i, 3.))*cos(.2*iTime);
        rad = (.5+.5*sin(.3*iTime))*2.*(.5+perlin_noise(vec3(i*10., .2*iTime+1., 3.)));
        d = length(uv-vort);
        z = smoothstep(vortexWidth,0.,abs(d-rad));
        
        angle = mod(.2*i, swirliness*2.*PI);
        dir = vec2(sin(angle),cos(angle));
        uv += .08*z*dir;
        
    }

    vec3 col = checkerboard2(uv);
    fragColor = vec4(col,1.0);
}

void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}
    

`;

const shaderMosaic = `

precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);
    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.y;

    float pi = 3.14159;
    float spin = 1.0;
    float radius = .8;
    vec2 squareSize = vec2(0.16);
    
    float sinscale = 12.0;

    
    float st = spin*iTime;
    vec2 square1 = radius*vec2(sin(st), cos(st));
    vec2 square2 = radius*vec2(sin(st+.666*pi), cos(st+.666*pi));
    vec2 square3 = radius*vec2(sin(st+1.3333*pi), cos(st+1.3333*pi));
    
    float dist1 = length(max(vec2(0.), abs(uv-square1)-squareSize));
    float dist2 = length(max(vec2(0.), abs(uv-square2)-squareSize));
    float dist3 = length(max(vec2(0.), abs(uv-square3)-squareSize));
    
    float md = min(min(dist1,dist2),dist3);

    
    float mDist = 1. + 5./((dist1+dist2+dist3));
    float mDist2 = 1. + .3/(.1+md);

    float v1 = 0.5*sin(sinscale*dist1*mDist+4.0*iTime)+0.5;
    float v2 = 0.5*sin(sinscale*dist2*mDist+4.0*iTime)+0.5;
    float v3 = 0.5*sin(sinscale*dist3*mDist+4.0*iTime)+0.5;
    
    vec3 pcol = palette(md+iTime);
    vec3 pcol2 = palette(pow(v1*v2*v3,.111)*md + .2*iTime);
  
    float combined = 0.;
    for(float i=0.; i<2.0; i++){
    combined += .25/(v1*v2*v3 - 3.7*max(v1,max(v2,v3)) + 1.6);
    combined += .25/(v1*v2*v3 - 3.7*max(v1,max(v2,v3)) + 2.2);
    combined += .25/(v1*v2*v3 - 3.7*max(v1,max(v2,v3)) + 2.8);
    }
    
    vec3 col = combined*pcol2;
    fragColor = vec4(col,1.0);
}
    
void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}
`;

const shaderSmoothMin = `
precision mediump float;

uniform vec2 iResolution;
uniform vec4 iMouse;
uniform float iTime;

float pi = 3.14159265;
#define MOD3 vec3(.1031,.11369,.13787)


vec3 hash33(vec3 p3){
	p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}
float perlin_noise(vec3 p){
    vec3 pi = floor(p);
    vec3 pf = p - pi;
    
    vec3 w = pf * pf * (3.0 - 2.0 * pf);
    
    return 	mix(
        		mix(
                	mix(dot(pf - vec3(0, 0, 0), hash33(pi + vec3(0, 0, 0))), 
                        dot(pf - vec3(1, 0, 0), hash33(pi + vec3(1, 0, 0))),
                       	w.x),
                	mix(dot(pf - vec3(0, 0, 1), hash33(pi + vec3(0, 0, 1))), 
                        dot(pf - vec3(1, 0, 1), hash33(pi + vec3(1, 0, 1))),
                       	w.x),
                	w.z),
        		mix(
                    mix(dot(pf - vec3(0, 1, 0), hash33(pi + vec3(0, 1, 0))), 
                        dot(pf - vec3(1, 1, 0), hash33(pi + vec3(1, 1, 0))),
                       	w.x),
                   	mix(dot(pf - vec3(0, 1, 1), hash33(pi + vec3(0, 1, 1))), 
                        dot(pf - vec3(1, 1, 1), hash33(pi + vec3(1, 1, 1))),
                       	w.x),
                	w.z),
    			w.y);
}

vec3 palette( in float t)
{
    vec3 a=vec3(0.5, 0.5, 0.5);
    vec3 b=vec3(0.5, 0.5, 0.5);
    vec3 c=vec3(1.);
    vec3 d=vec3(0., 0.33, .66);
    return a + b*cos( 6.28318*(c*t+d) );
}

float smin( float a, float b, float k )
{
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k*(1.0/4.0);
}

float SDF(vec2 x, vec2 y){
    float d1 = 4.*length(x)-0.4;
    float d2 = 4.2*length(x-y)-0.1;
    
    return smin(d1,d2,8.);
}

vec2 grad(vec2 x, vec2 y){
    vec2 eps = vec2(0.,0.001);
    return vec2(SDF(x+eps.yx, y)-SDF(x, y), SDF(x+eps.xy, y)-SDF(x, y));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    vec2 mv = (2.0*iMouse.xy-iResolution.xy)/iResolution.y;

    float d = SDF(uv, mv);
    vec2 g = normalize(grad(uv, mv));
    float ang = atan(g.y,g.x);
    
    vec3 col = palette(ang / (2.*pi) + iTime + d*0.2);
    float lineStrength = .5*sin(5.0*d+ - 3.0*iTime);
    float term = 0.1/lineStrength;
    term = pow(term,.7);
    vec3 finalColor = vec3(0.);//col * term;
    finalColor = max(finalColor,vec3(0.));
    
    lineStrength = .5*sin(5.0*d+ - 3.0*iTime +iMouse.x*.1) + .5;
    term = 0.1/lineStrength;
    term = pow(term,.7);
    
    finalColor += col*term;
    fragColor = vec4(finalColor,1.);
}

void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}


`;

const shaderSubversion = `
precision mediump float;

uniform vec2 iResolution;
uniform vec4 iMouse;
uniform float iTime;

float func(vec2 uv, float t){
    float scale = 1.;
    float d = scale;
    float shift = floor(uv.x*3. + uv.y*0.2);
    float delta = 1.6*sin(.3*t+shift);
    vec2 dx = vec2(0.02);

    
    for (float i=0.;i<5.;i++){
        uv += d*tan(mod(uv+i*dx,pow(.5,i))+shift);
        shift += delta;
        if(i<5.)d = mod(length(uv),scale);
    }
    d = mod(d,1.);
    return d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.*iResolution.xy-fragCoord)/iResolution.y;
    float t=iTime*.5;
    
    // Display two over eachother for 3d/chromatic abberation sort of thing.
    float r = func(uv,t);
    float g = func(uv+vec2(0.025,0.), t);
    vec3 col = vec3(r, g, g);  
    fragColor=vec4(col,1.);
}
void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}    
`
const shaderJulia = `
precision mediump float;

uniform vec2 iResolution;
uniform vec4 iMouse;
uniform float iTime;


vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    
    float a = uv.x * 4.0 - 2.0;
    float b = uv.y * 2.0 - 1.0;
    float a0 = 0.8*cos(1.0*iTime);//a;
    float b0 = 0.8*sin(1.0*iTime);//b;
    float maxIter = 20.0;
    float i = 0.0;
    int steps = 19;

    for (int n = 0; n < 20; n++) {
        float aa = a * a;
        float bb = b * b;
        if (aa + bb > 4.0) {
            steps=n;
            break;
        }
        float twoab = 2.0 * a * b;
        a = aa - bb + a0;
        b = twoab + b0;
    }
    i = float(steps);
       
    
    float x = (1.0 + i) / maxIter;
    vec3 col = palette(x+0.1*iTime + 0.03*length(vec2(a,b)));
    vec3 color = col;
    
    fragColor = vec4(color, 1.0);
}
void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}      
`
const shaderCross = `
precision mediump float;

uniform vec2 iResolution;
uniform vec4 iMouse;
uniform float iTime;


vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    
    float d = length(uv);
    float mDist =  (10.0/(d+5.2*sin(iTime)+5.0));
    
    
    
    float dist1 = length(max(vec2(0.), abs(uv+vec2(0., -0.15))-vec2(0.35,0.075)));
    float v1 = 0.5*sin(6.0*dist1*mDist+8.0*iTime)+0.5;
    
    float dist2 = length(max(vec2(0.), abs(uv)-vec2(0.075, 0.5)));
    float v2 = 0.5*sin(6.0*dist2*mDist+8.0*iTime)+0.5;
    
    vec3 pcol = palette(min(dist1,dist2)+iTime);
    
    //float v3 = .03/(v1*v2);
    float v3 = .002/(v1*v2) + 0.2/max(v1,v2);
    //v3 *= max(0.0,dist1)*max(0.0,dist2); // Add negative cross in middle
    
    vec3 col = v3*pcol;

    fragColor = vec4(col,1.0);
}

void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}      
`



const ids = ["shaderCanvas1", "shaderCanvas2", "shaderCanvas3", "shaderCanvas4", "shaderCanvas5", "shaderCanvas6"]
const shaders = [shaderVortex, shaderMosaic, shaderSmoothMin, shaderSubversion, shaderJulia, shaderCross]

for(let i=0; i<6; i++){
    let canvas = document.getElementById(ids[i]);
    let viewer = new ShaderViewer(canvas, shaders[i]);
    canvas.addEventListener('mouseover', () => viewer.setActive(true));
    canvas.addEventListener('mouseout', () => viewer.setActive(false));
    viewer.start();
}

// const canvas = document.getElementById('shaderCanvas1');
// const viewer = new ShaderViewer(canvas, shaderVortex);
// canvas.addEventListener('mouseover', () => viewer.setActive(true));
// canvas.addEventListener('mouseout', () => viewer.setActive(false));
// viewer.start();

// const canvas2 = document.getElementById('shaderCanvas2');
// const viewer2 = new ShaderViewer(canvas2, shaderMosaic);
// canvas2.addEventListener('mouseover', () => viewer2.setActive(true));
// canvas2.addEventListener('mouseout', () => viewer2.setActive(false));
// viewer2.start();

// const canvas3 = document.getElementById('shaderCanvas3');
// const viewer3 = new ShaderViewer(canvas3, shaderSmoothMin);
// canvas3.addEventListener('mouseover', () => viewer3.setActive(true));
// canvas3.addEventListener('mouseout', () => viewer3.setActive(false));
// viewer3.start();

