const sc = document.getElementById('smokeCanvas');
const tc = document.getElementById('textCanvas');
const sctx = sc.getContext('2d');
const tctx = tc.getContext('2d');

function setSize() {
    sc.width = tc.width = window.innerWidth;
    sc.height = tc.height = window.innerHeight;
}
setSize();
window.addEventListener('resize', setSize);

const W = sc.width, H = sc.height;
const CX = W / 2, CY = H / 2 - 20;

let textParticles = [];
let smokeParticles = [];
let exitTriggered = false;
let exitProgress = 0;
let frame = 0;
let revealDone = false;

const FONT_SIZE = Math.min(W * 0.13, 110);

function sampleTextPixels() {
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const ox = off.getContext('2d');
    ox.font = `900 ${FONT_SIZE}px Arial Black, Arial`;
    ox.textAlign = 'center';
    ox.textBaseline = 'middle';
    ox.fillStyle = '#fff';
    ox.fillText('VEHICLEZONE', CX, CY);
    const d = ox.getImageData(0, 0, W, H).data;
    const pts = [];
    const step = 3;
    for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
            const i = (y * W + x) * 4;
            if (d[i + 3] > 128) pts.push({ x, y });
        }
    }
    return pts;
}

const textPts = sampleTextPixels();

function initTextParticles() {
    textParticles = textPts.map(p => ({
        tx: p.x, ty: p.y,
        x: CX + (Math.random() - 0.5) * W * 0.9,
        y: CY + (Math.random() - 0.5) * H * 0.9,
        vx: 0, vy: 0,
        alpha: 0,
        size: Math.random() * 1.8 + 0.6,
        delay: Math.random() * 60,
        age: 0,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: (Math.random() - 0.5) * 0.05,
        exitVx: 0, exitVy: 0
    }));
}
initTextParticles();

class SmokeParticle {
    constructor(zone) { this.zone = zone; this.reset(); }
    reset() {
        if (this.zone === 'left') {
            this.x = Math.random() * W * 0.22;
            this.y = H * 0.25 + Math.random() * H * 0.6;
        } else if (this.zone === 'right') {
            this.x = W * 0.78 + Math.random() * W * 0.22;
            this.y = H * 0.25 + Math.random() * H * 0.6;
        } else {
            this.x = CX + (Math.random() - 0.5) * W * 0.15;
            this.y = H * 0.55 + Math.random() * H * 0.3;
        }
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.35 + 0.05);
        this.r = Math.random() * 90 + 40;
        this.alpha = 0;
        this.tAlpha = Math.random() * 0.09 + 0.03;
        this.life = 0;
        this.maxLife = Math.random() * 220 + 140;
        this.rot = Math.random() * Math.PI * 2;
        this.rotV = (Math.random() - 0.5) * 0.004;
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.rot += this.rotV; this.life++;
        const halfLife = this.maxLife * 0.35;
        if (this.life < halfLife) {
            this.alpha = Math.min(this.alpha + 0.002, this.tAlpha);
            this.r += 0.2;
        } else {
            this.alpha = Math.max(this.alpha - 0.001, 0);
        }
        if (this.life >= this.maxLife || this.alpha <= 0) this.reset();
    }
    draw() {
        sctx.save();
        sctx.translate(this.x, this.y);
        sctx.rotate(this.rot);
        const base = exitTriggered ? Math.max(0, this.tAlpha * (1 - exitProgress * 1.5)) : this.alpha;
        const g = sctx.createRadialGradient(0, 0, 0, 0, 0, this.r);
        g.addColorStop(0, `rgba(90,80,70,${base * 1.2})`);
        g.addColorStop(0.4, `rgba(60,55,50,${base * 0.7})`);
        g.addColorStop(1, `rgba(30,25,20,0)`);
        sctx.fillStyle = g;
        sctx.beginPath();
        sctx.arc(0, 0, this.r, 0, Math.PI * 2);
        sctx.fill();
        sctx.restore();
    }
}

for (let i = 0; i < 22; i++) smokeParticles.push(new SmokeParticle('left'));
for (let i = 0; i < 22; i++) smokeParticles.push(new SmokeParticle('right'));
for (let i = 0; i < 14; i++) smokeParticles.push(new SmokeParticle('ground'));

function lerp(a, b, t) { return a + (b - a) * t; }
function easeOut(t) { return 1 - (1 - t) * (1 - t); }

function updateText() {
    textParticles.forEach(p => {
        p.age++;
        if (p.age < p.delay) return;
        p.wobble += p.wobbleSpeed;

        if (exitTriggered) {
            if (p.exitVx === 0 && p.exitVy === 0) {
                const angle = Math.atan2(p.ty - CY, p.tx - CX);
                const spd = Math.random() * 6 + 3;
                p.exitVx = Math.cos(angle) * spd + Math.random() * 2 - 1;
                p.exitVy = Math.sin(angle) * spd - Math.random() * 4;
            }
            p.x += p.exitVx * (1 + exitProgress * 3);
            p.y += p.exitVy * (1 + exitProgress * 3);
            p.exitVy += 0.04;
            p.alpha = Math.max(0, p.alpha * (1 - exitProgress * 0.06));
            p.size = Math.max(0.1, p.size * (1 - exitProgress * 0.02));
        } else {
            const t = Math.min(1, (p.age - p.delay) / 90);
            const e = easeOut(t);
            p.x = lerp(p.x, p.tx + Math.sin(p.wobble) * 1.2, 0.04 + e * 0.06);
            p.y = lerp(p.y, p.ty + Math.cos(p.wobble) * 0.8, 0.04 + e * 0.06);
            p.alpha = Math.min(p.alpha + 0.025, 1);
        }
    });
}

function drawText() {
    tctx.clearRect(0, 0, W, H);
    textParticles.forEach(p => {
        if (p.alpha <= 0.01) return;
        const smoke = Math.sin(p.wobble) * 0.15;
        const b = Math.floor(180 + smoke * 40);
        const w = Math.floor(160 + smoke * 30);
        tctx.globalAlpha = p.alpha * 0.92;
        tctx.fillStyle = `rgb(${b},${w},${Math.floor(w * 0.75)})`;
        tctx.beginPath();
        tctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        tctx.fill();
    });
    tctx.globalAlpha = 1;
}

function loop() {
    sctx.clearRect(0, 0, W, H);
    sctx.fillStyle = 'rgba(0,0,0,0.18)';
    sctx.fillRect(0, 0, W, H);

    smokeParticles.forEach(p => { p.update(); p.draw(); });

    if (exitTriggered) exitProgress = Math.min(1, exitProgress + 0.008);

    updateText();
    drawText();

    frame++;
    if (frame === 160 && !revealDone) {
        revealDone = true;
        document.getElementById('tagline').classList.add('show');
        setTimeout(() => document.getElementById('enterBtn').classList.add('show'), 400);
    }

    if (!exitTriggered || exitProgress < 1) {
        requestAnimationFrame(loop);
    } else {
        document.getElementById('splash').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('splash').style.display = 'none';
            document.getElementById('main').classList.add('visible');
        }, 1000);
    }
}
loop();

function enterSite() {
    exitTriggered = true;
    document.getElementById('enterBtn').style.transition = 'opacity 0.4s';
    document.getElementById('enterBtn').style.opacity = '0';
    document.getElementById('tagline').style.transition = 'opacity 0.4s';
    document.getElementById('tagline').style.opacity = '0';
}