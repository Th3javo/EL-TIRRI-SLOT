const symbols=['🍒','🍋','🍊','🔔','⭐','💎','7️⃣'];
const reelsEl=document.getElementById('reels'),creditsEl=document.getElementById('credits'),betEl=document.getElementById('bet'),linesEl=document.getElementById('lines'),messageEl=document.getElementById('message'),spinBtn=document.getElementById('spin');
let credits=1000,bet=10,lines=3,spinning=false;
function render(values=symbols.slice(0,3)){reelsEl.innerHTML=values.map((s,i)=>`<div class="reel" id="reel-${i}"><span class="symbol">${s}</span></div>`).join('')}
function randomSymbol(){return symbols[Math.floor(Math.random()*symbols.length)]}
function update(){creditsEl.textContent=credits;betEl.textContent=bet;linesEl.textContent=lines}
function totalBet(){return bet*lines}
function setBet(d){if(!spinning)bet=Math.max(1,Math.min(100,bet+d)),update()}
function setLines(d){if(!spinning)lines=Math.max(1,Math.min(7,lines+d)),update()}
document.querySelector('[data-line="-1"]').onclick=()=>setLines(-1);document.querySelector('[data-line="1"]').onclick=()=>setLines(1);
function spin(){const cost=totalBet();if(spinning||credits<cost){messageEl.textContent=credits<cost?'Créditos insuficientes':'La máquina está girando...';return}spinning=true;credits-=cost;update();spinBtn.disabled=true;document.body.classList.add('spinning');messageEl.textContent=`Girando ${lines} líneas...`;const result=[randomSymbol(),randomSymbol(),randomSymbol()];[0,1,2].forEach(i=>{const reel=document.getElementById(`reel-${i}`);let ticks=0;const timer=setInterval(()=>{reel.querySelector('.symbol').textContent=randomSymbol();ticks++;if(ticks>=14+i*7){clearInterval(timer);reel.querySelector('.symbol').textContent=result[i];if(i===2)finish(result)}},65)})}
function finish(r){document.body.classList.remove('spinning');spinning=false;spinBtn.disabled=false;let mult=0;if(r[0]===r[1]&&r[1]===r[2])mult=r[0]==='7️⃣'?50:r[0]==='💎'?25:10;else if(r[0]===r[1]||r[1]===r[2]||r[0]===r[2])mult=2;if(mult){const win=bet*mult*lines;credits+=win;messageEl.textContent=mult===2?`¡DOBLE! +${win} créditos`:`¡TRIPLE! GANASTE ${win} créditos`;}else messageEl.textContent='Sin premio. ¡Otra vez!';update()}
spinBtn.addEventListener('click',spin);render();update();
