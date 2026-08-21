const E=id=>document.getElementById(id),symbols=['🍒','🍋','🍊','🔔','⭐','💎','7️⃣'];
const pay={'🍒':8,'🍋':8,'🍊':10,'🔔':12,'⭐':15,'💎':25,'7️⃣':50};
const LINE_PATTERNS={1:[[0,0,0]],2:[[0,0,0],[1,1,1]],3:[[0,0,0],[1,1,1],[2,2,2]],5:[[0,0,0],[1,1,1],[2,2,2],[0,1,2],[2,1,0]],7:[[0,0,0],[1,1,1],[2,2,2],[0,1,2],[2,1,0],[0,0,1],[2,2,1]]};
let credits=1000,bet=10,lines=3,spinning=false,history=[];
const reels=E('reels');
function random(){return symbols[Math.floor(Math.random()*symbols.length)]}
function render(v=['🍒','🔔','7️⃣']){reels.innerHTML=v.map((s,i)=>`<div class="reel" id="reel-${i}"><span class="symbol">${s}</span></div>`).join('')}
function total(){return bet*lines} function update(){E('credits').textContent=credits;E('bet').textContent=bet;E('lines').textContent=lines;E('total').textContent=total()}
function changeBet(d){if(!spinning){bet=Math.max(1,Math.min(100,bet+d));update()}}function changeLines(d){if(!spinning){lines=[1,2,3,5,7].reduce((p,n)=>n<=lines+d?n:p,1);update()}}
E('betDown').onclick=()=>changeBet(-1);E('betUp').onclick=()=>changeBet(1);document.querySelector('[data-line="-1"]').onclick=()=>changeLines(-1);document.querySelector('[data-line="1"]').onclick=()=>changeLines(1);
function evaluate(result){let wins=[];const matrix=[result];for(const line of LINE_PATTERNS[lines]){const[a,b,c]=line.map((row,i)=>matrix[0][i]);if(a===b&&b===c)wins.push({line,symbol:a,mult:pay[a]});else if(a===b||b===c||a===c)wins.push({line,symbol:'DOUBLE',mult:2})}return wins}
function payout(wins){return wins.reduce((sum,w)=>sum+bet*w.mult,0)}
function addHistory(r,win){history.unshift({r,win});history=history.slice(0,6);const h=E('historyList');if(h)h.innerHTML=history.map(x=>`<span>${x.r.join(' ')} ${x.win?`<b>+${x.win}</b>`:'—'}</span>`).join('')}
function highlight(wins){document.querySelectorAll('.reel').forEach(r=>r.classList.remove('winner'));if(wins.length)document.querySelectorAll('.reel').forEach(r=>r.classList.add('winner'))}
function flash(big=false){const f=E('winFlash');if(!f)return;f.className='win-flash active '+(big?'big':'');setTimeout(()=>f.className='win-flash',800)}
function spin(){const cost=total();if(spinning)return;if(credits<cost){E('message').textContent='Créditos insuficientes';return}spinning=true;credits-=cost;update();E('spin').disabled=true;document.body.classList.add('spinning');E('message').textContent=`Girando ${lines} líneas...`;const result=[random(),random(),random()];[0,1,2].forEach(i=>{const reel=E(`reel-${i}`),interval=setInterval(()=>reel.querySelector('.symbol').textContent=random(),55);setTimeout(()=>{clearInterval(interval);reel.querySelector('.symbol').textContent=result[i];if(i===2)finish(result)},850+i*450)})}
function finish(r){const wins=evaluate(r),win=payout(wins),triple=wins.some(w=>w.mult>15);spinning=false;E('spin').disabled=false;document.body.classList.remove('spinning');highlight(wins);if(win){credits+=win;E('message').textContent=triple?`🔥 ¡JACKPOT! +${win} CRÉDITOS`:`✨ ¡PREMIO! +${win} CRÉDITOS`;flash(triple)}else E('message').textContent='Sin premio — ¡sigue girando!';addHistory(r,win);update();setTimeout(()=>highlight([]),1600)}
E('spin').onclick=spin;render();update();
