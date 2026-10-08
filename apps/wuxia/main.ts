import p5 from 'p5';
import { Engine, createP5Host, createWebGL2RendererPlugin,
  createCanvasSurfacePlugin, CanvasSurfaceToken,
  type EnginePlugin } from '@inkgames/engine';

const frame = document.getElementById('arena') as HTMLCanvasElement;
const stage = document.getElementById('stage')!;
frame.remove();
let ctx: CanvasRenderingContext2D;
let surface: { invalidate(): void };
const healthLabel = document.getElementById('health')!;
const waveLabel = document.getElementById('wave')!;
const scoreLabel = document.getElementById('score')!;
const statusLabel = document.getElementById('status')!;
const W = frame.width, H = frame.height;
const GROUND = H - 72;
type Fighter = { x:number; y:number; vx:number; health:number; cooldown:number; flash:number; dir:number; kind:'swordsman'|'archer' };
type Slash = { x:number; y:number; radius:number; life:number; dir:number };
type Arrow = { x:number; y:number; vx:number; life:number };
let hero: Fighter;
let foes: Fighter[];
let slashes: Slash[];
let arrows: Arrow[];
let sparks: { x:number; y:number; life:number }[];
let score = 0, wave = 0, waveDelay = 0, deadDelay = 0, time = 0;
function reset() {
  hero = { x:W/2, y:GROUND, vx:0, health:100, cooldown:0, flash:0, dir:1, kind:'swordsman' };
  foes=[]; slashes=[]; arrows=[]; sparks=[];
  score=0; wave=0; waveDelay=0; deadDelay=0; time=0;
  statusLabel.textContent='江湖路远';
  nextWave();
}
function nextWave() {
  wave++;
  const count = Math.min(3+wave,11);
  foes = Array.from({length:count},(_,i) => ({
    x:i%2===0 ? 36-i*24 : W-36+i*24, y:GROUND,
    vx:0, health: i%4===3 ? 38 : 28, cooldown:35+i*13, flash:0,
    dir:i%2===0?1:-1, kind:i%4===3?'archer':'swordsman',
  }));
  hero.health=Math.min(100,hero.health+12);
  statusLabel.textContent=`第 ${wave} 波 · 风起云涌`;
}
function hit(x:number,y:number) {
  sparks.push({x,y,life:18});
  if (sparks.length>40) sparks.shift();
}
function update() {
  time++;
  for (const s of slashes) s.life--;
  slashes=slashes.filter(s=>s.life>0);
  for (const s of sparks) s.life--;
  sparks=sparks.filter(s=>s.life>0);
  if (hero.health<=0) {
    deadDelay++;
    statusLabel.textContent='力战而竭 · 即将重来';
    if (deadDelay>=150) reset();
    return;
  }
  if (!foes.length) {
    waveDelay++;
    statusLabel.textContent='尘埃落定 · 下一波将至';
    if (waveDelay>=110) { waveDelay=0; nextWave(); }
  }
  const target = foes.reduce<Fighter|undefined>((best,foe) =>
    !best || Math.abs(foe.x-hero.x)<Math.abs(best.x-hero.x) ? foe : best,undefined);
  hero.cooldown=Math.max(0,hero.cooldown-1);
  hero.flash=Math.max(0,hero.flash-1);
  if (target) {
    const distance=target.x-hero.x;
    hero.dir=distance>=0?1:-1;
    const aim=Math.abs(distance)<66 ? 0 : hero.dir*3.7;
    hero.vx+=(aim-hero.vx)*.16;
    hero.x=Math.max(32,Math.min(W-32,hero.x+hero.vx));
    if (Math.abs(distance)<76 && hero.cooldown===0) {
      hero.cooldown=25;
      slashes.push({x:hero.x+hero.dir*40,y:GROUND-30,radius:58,life:11,dir:hero.dir});
      for (const foe of foes) {
        if (Math.abs(foe.x-hero.x)<88 && (foe.x-hero.x)*hero.dir>=-15) {
          foe.health-=23; foe.flash=8; foe.x+=hero.dir*18; hit(foe.x,GROUND-34);
        }
      }
    }
  } else hero.vx*=.85;
  for (const foe of foes) {
    foe.cooldown=Math.max(0,foe.cooldown-1);
    foe.flash=Math.max(0,foe.flash-1);
    const dx=hero.x-foe.x;
    foe.dir=dx>=0?1:-1;
    const gap=foe.kind==='archer'?175:38;
    if (Math.abs(dx)>gap+12) foe.x+=foe.dir*(foe.kind==='archer'?1.15:1.7);
    else if (foe.kind==='archer' && Math.abs(dx)<gap-32) foe.x-=foe.dir*1.1;
    if (Math.abs(dx)<(foe.kind==='archer'?340:43) && foe.cooldown===0) {
      foe.cooldown=foe.kind==='archer'?105:65;
      if (foe.kind==='archer') arrows.push({x:foe.x,y:GROUND-38,vx:foe.dir*5.5,life:130});
      else if (hero.flash===0) { hero.health=Math.max(0,hero.health-9); hero.flash=24; hit(hero.x,GROUND-32); }
    }
  }
  for (const arrow of arrows) {
    arrow.x+=arrow.vx; arrow.life--;
    if (Math.abs(arrow.x-hero.x)<17 && hero.flash===0 && hero.health>0) {
      arrow.life=0; hero.health=Math.max(0,hero.health-7); hero.flash=22; hit(hero.x,GROUND-34);
    }
  }
  arrows=arrows.filter(arrow=>arrow.life>0 && arrow.x>0 && arrow.x<W);
  const defeated=foes.filter(foe=>foe.health<=0).length;
  if (defeated) score+=defeated;
  foes=foes.filter(foe=>foe.health>0);
  healthLabel.textContent=`气血：${hero.health}`;
  waveLabel.textContent=`第 ${wave} 波`;
  scoreLabel.textContent=`斩敌：${score}`;
}
function fighter(f:Fighter, heroBody=false) {
  ctx.save(); ctx.translate(f.x,f.y); ctx.scale(f.dir,1);
  if (f.flash>0 && f.flash%4<2) ctx.globalAlpha=.45;
  ctx.fillStyle='#242828'; ctx.beginPath(); ctx.ellipse(0,2,22,5,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=heroBody?'#3e5862':f.kind==='archer'?'#685a43':'#793f36';
  ctx.beginPath(); ctx.moveTo(-15,-53);ctx.lineTo(14,-53);ctx.lineTo(19,-11);ctx.lineTo(-18,-11);ctx.fill();
  ctx.strokeStyle='#2e2925';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-8,-13);ctx.lineTo(-10,0);ctx.moveTo(9,-13);ctx.lineTo(10,0);ctx.stroke();
  ctx.fillStyle='#d8b896';ctx.beginPath();ctx.arc(0,-65,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=heroBody?'#171d20':'#362c29';ctx.fillRect(-15,-79,30,8);
  ctx.strokeStyle=heroBody?'#d5e1e1':'#b6a388';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(8,-42);ctx.lineTo(31,-54);ctx.lineTo(48,-56);ctx.stroke();
  if (!heroBody) { ctx.fillStyle='#8f3d30';ctx.fillRect(-15,-90,30*Math.max(0,f.health)/(f.kind==='archer'?38:28),3); }
  ctx.restore();
}
function render() {
  ctx.fillStyle='#e4dbc8';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#d5c8b1';
  for (let i=0;i<5;i++) {
    const x=i*250-80;
    ctx.beginPath();ctx.moveTo(x,H-72);ctx.lineTo(x+175,185+i%3*38);ctx.lineTo(x+350,H-72);ctx.fill();
  }
  ctx.fillStyle='#ede4d3';ctx.fillRect(0,GROUND,W,H-GROUND);
  ctx.fillStyle='#9b8a70';ctx.fillRect(0,GROUND,W,2);
  ctx.fillStyle='#9e7254';ctx.font='28px serif';ctx.fillText('剑影江湖',32,48);
  ctx.fillStyle='#b5936a';
  for(let i=0;i<18;i++) { const x=(i*137+time*.3)%W;const y=65+(i*83)%340;
    ctx.globalAlpha=.25;ctx.fillRect(x,y,2,2); }
  ctx.globalAlpha=1;
  for(const foe of foes) fighter(foe);
  fighter(hero,true);
  for(const slash of slashes) {
    ctx.save();ctx.globalAlpha=slash.life/11;ctx.strokeStyle='#faf6e9';ctx.lineWidth=5;
    ctx.beginPath();ctx.arc(slash.x,slash.y,slash.radius,slash.dir>0?-1.1:2,slash.dir>0?1.2:4.3);ctx.stroke();ctx.restore();
  }
  ctx.strokeStyle='#5f4033';ctx.lineWidth=3;
  for(const arrow of arrows) {ctx.beginPath();ctx.moveTo(arrow.x,arrow.y);ctx.lineTo(arrow.x-arrow.vx*3,arrow.y+2);ctx.stroke();}
  for(const spark of sparks) {ctx.fillStyle=`rgba(151,56,42,${spark.life/18})`;ctx.beginPath();ctx.arc(spark.x,spark.y,3+(18-spark.life)*.5,0,Math.PI*2);ctx.fill();}
  if (hero.health<=0) {ctx.fillStyle='#171c20a8';ctx.fillRect(0,0,W,H);ctx.fillStyle='#f1e7d5';ctx.font='42px serif';ctx.textAlign='center';ctx.fillText('胜败乃江湖常事',W/2,H/2);ctx.textAlign='start';}
}
function createWuxiaPlugin(): EnginePlugin {
  return {
    manifest: {
      id:'wuxia-autobattle', version:'1.0.0',
      requires:[{token:CanvasSurfaceToken,range:'^1.0.0'}],
      fixedPhase:'gameplay',
      // 必须声明 renderPhase：引擎只调用 renderPhase 匹配的插件（core/engine.ts 的
      // RENDER_PHASES 循环）。缺这一项时 render() 永不执行，surface.invalidate() 也就
      // 从不触发，画面停在首帧的空纹理上（表现为画布一直只有 CSS 底色）。
      // 取 'ink' 而非 'ui'：canvas-surface 自己在 'ui' 阶段上传并贴屏，本插件必须
      // 先画完 2D 画布，否则贴上去的是上一帧的内容。
      renderPhase:'ink',
    },
    register() {},
    init(context) {
      const canvasSurface = context.get(CanvasSurfaceToken);
      ctx = canvasSurface.context;
      surface = canvasSurface;
      reset();
      const onRestart=()=>context.commands.enqueue('WuxiaRestart',{});
      document.getElementById('restart')!.addEventListener('click',onRestart);
      context.resources.add(()=>document.getElementById('restart')!.removeEventListener('click',onRestart));
      context.resources.add(context.commands.on('WuxiaRestart',()=>reset()));
    },
    fixedUpdate() { update(); },
    render() { render(); surface.invalidate(); },
  };
}
type P5Constructor = Parameters<typeof createP5Host>[0];
async function boot() {
  const host = await createP5Host(p5 as unknown as P5Constructor, stage, W, H);
  const engine = new Engine({
    host, fixedHz: 60,
    plugins: [
      createWebGL2RendererPlugin(host.canvas, host.gl),
      createCanvasSurfacePlugin(W, H),
      createWuxiaPlugin(),
    ],
  });
  await engine.init();
  engine.start();
  window.addEventListener('beforeunload', () => {
    void engine.dispose().finally(() => host.dispose());
  });
}
void boot().catch(error => { document.getElementById('status')!.textContent = `启动失败：${String(error)}`; });
