// Newton's Law of Cooling
// https://www.khanacademy.org/math/differential-equations/first-order-differential-equations/exponential-models-diff-eq/v/newtons-law-of-cooling

const width = 600
const height = 350

class Block {
    constructor(x, y, width, height, k=0.2){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.maxT = 300;
        this.minT = -300;
        this.k = k; // coupling constant
        this.temperature = 0;
    }

    calcC(outsideT, insideT, time) {
        //  T == Ce^{-kt} + T_o => (T - T_o)/e^{-kt} = C
        this.c = (insideT - outsideT) / Math.exp(-this.k*time)
        this.temperature = insideT;
    }

    draw(p){
        let zero = p.color(200);
        let cold = p.color(108, 225, 229);
        let hot = p.color(255, 153, 153);
        const percent = Math.abs(p.constrain(this.temperature, this.minT, this.maxT)) / this.maxT
        p.fill(p.lerpColor(zero, this.temperature > 0 ? hot : cold , percent));
        p.stroke('lightgrey');
        p.rect(this.x, this.y, this.width, this.height)
        p.textSize(24);
        p.fill('black');
        p.text(`${p.round(this.temperature)}℃`, this.x + 10, this.y + 30);
        p.text(`k=${this.k}`, this.x + 10, this.y + 60);
    }

    calcTemp(outsideT, t) {
        // dT/dt == -k(T - T_o) ==>
        //  T == Ce^{-kt} + T_o
        this.temperature = this.c * Math.exp(-this.k * t) + outsideT
    }
}


let outside = 0;
let block;
let time = 0;
let blocks = []

new p5((p)=>{
    p.setup=()=>{
        p.createCanvas(width, height);
        const w = 100;
        const h = 100;
        const block1 = new Block(width/2 - w - w/2-30,  50, w, h)
        block1.calcC(outside, 300, time)
        const block2 = new Block(width/2 - w/2,  50, w, h)
        block2.calcC(outside, 30, time)
        const block3 = new Block(width/2 + w/2 + 30,  50, w, h)
        block3.calcC(outside, -300, time)
        const block4 = new Block(width/2 - w - w/2 - 30, 50 + h + 30, w, h, 0.8)
        block4.calcC(outside, 300, time)
        const block5 = new Block(width/2 - w/2,  50 + h + 30, w, h, 1)
        block5.calcC(outside, 300, time)
        const block6 = new Block(width/2 + w/2 + 30,  50 + h + 30, w, h, 0)
        block6.calcC(outside, -300, time)
        blocks.push(block1, block2, block3, block4, block5, block6)

    }
    p.draw=()=>{
        time += 0.005;
        p.background(255);
        blocks.forEach(b => {
            b.calcTemp(outside, time);
            b.draw(p)
        })
        p.fill('black');
        p.text(`outside ${outside}℃`, 10, 30);
    }
})
