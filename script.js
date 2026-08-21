const symbols=['🍒','🍋','🍊','🔔','⭐','💎','7️⃣'];
const reelsEl=document.getElementById('reels');
const creditsEl=document.getElementById('credits');
const betEl=document.getElementById('bet');
const messageEl=document.getElementById('message');
const spinBtn=document.getElementById('spin');
let credits=1000, bet=10, spinning=false;

function render(values=symbols.slice(0,3)){
  reelsEl.innerHTML=values.map((s,i)=>`<div class="reel" id="reel-${i}"><span class="symbol">${s}</span></div>`).join('');
}
function randomSymbol(){return symbols[Math.floor(Math.random()*symbols.length)]}
function update(){creditsEl.textContent=credits;betEl.textContent=bet}
function setBet(delta){if(spinning)return;bet=Math.max(1,Math.min(100,bet+delta));update()}

document.querySelector('[data-bet="1"]').onclick=()=>setBet(-1);
document.querySelector('[data-bet="plus"]').onclick=()=>setBet(1);

function spin(){
  if(spinning||credits<bet)return;
  spinning=true; credits-=bet; update(); spinBtn.disabled=true; document.body.classList.add('spinning'); messageEl.textContent='Girando...';
  const result=[randomSymbol(),randomSymbol(),randomSymbol()];
  [0,1,2].forEach(i=>{
    const reel=document.getElementById(`reel-${i}`);
    let ticks=0; const timer=setInterval(()=>{reel.querySelector('.symbol').textContent=randomSymbol();ticks++;if(ticks>=12+i*6){clearInterval(timer);reel.querySelector('.symbol').textContent=result[i];if(i===2)finish(result)}},70);
  });
}
function finish(result){
  document.body.classList.remove('spinning'); spinning=false; spinBtn.disabled=false;
  if(result[0]===result[1]&&result[1]===result[2]){const multiplier=result[0]==='7️⃣'?50:result[0]==='💎'?25:10;const win=bet*multiplier;credits+=win;messageEl.textContent=`¡${result.join(' ')}! GANASTE ${win} créditos`}
  else if(result[0]===result[1]||result[1]===result[2]||result[0]===result[2]){const win=bet*2;credits+=win;messageEl.textContent=`¡DOBLE! +${win} créditos`}
  else messageEl.textContent='Sin premio. ¡Otra vez!'; update();
}
spinBtn.addEventListener('click',spin);render();update();
