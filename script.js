const E=id=>document.getElementById(id),symbols=['🍒','🍋','🍊','🔔','⭐','💎','7️⃣'];
const pay={'🍒':8,'🍋':8,'🍊':10,'🔔':12,'⭐':15,'💎':25,'7️⃣':50};
let credits=1000,bet=10,lines=3,spinning=false,history=[];const reels=E('reels');
function random(){return symbols[Math.floor(Math.random()*symbols.length)]}
function render(v=['🍒','🔔','7️⃣']){reels.innerHTML=v.map((s,i)=>`<div class="reel" id="reel-${i}"><span class="symbol">${s}</span></div>`).join('')}
function total(){return bet*lines} function update(){E('credits').textContent=credits;E('bet').textContent=bet;E('lines').textContent=lines;E('total').textContent=total()}
function changeBet(d){if(!spinning){bet=Math.max(1,Math.min(100,bet+d));update()}}function changeLines(d){if(!spinning){lines=Math.max(1,Math.min(7,lines+d));update()}}
E('betDown').onclick=()=>changeBet(-1);E('betUp').onclick=()=>changeBet(1);document.querySelector('[data-line="-1"]').onclick=()=>changeLines(-1);document.querySelector('[data-line="1"]').onclick=()=>changeLines(1);
function payout(r){const[a,b,c]=r;if(a===b&&b===c)return bet*lines*pay[a];if(a===b||b===c||a===c)return bet*lines*2;return 0}
function addHistory(r,win){history.unshift({r,win});history=history.slice(0,6);E('historyList').innerHTML=history.map(x=>`<span>${x.r.join(' ')} ${x.win?`<b>+${x.win}</b>`:'—'}</span>`).join('')}
function flash(big=false){const f=E('winFlash');f.className='win-flash active '+(big?'big':'');setTimeout(()=>f.className='win-flash',700)}
function spin(){const cost=total();if(spinning)return;if(credits<cost){E('message').textContent='Créditos insuficientes';return}spinning=true;credits-=cost;update();E('spin').disabled=true;document.body.classList.add('spinning');E('message').textContent=`Girando ${lines} líneas...`;const result=[random(),random(),random()];[0,1,2].forEach(i=>{const reel=E(`reel-${i}`),interval=setInterval(()=>reel.querySelector('.symbol').textContent=random(),55);setTimeout(()=>{clearInterval(interval);reel.querySelector('.symbol').textContent=result[i];if(i===2)finish(result)},850+i*450)})}
function finish(r){const win=payout(r),triple=r[0]===r[1]&&r[1]===r[2];spinning=false;E('spin').disabled=false;document.body.classList.remove('spinning');if(win){credits+=win;E('message').textContent=triple?`🔥 ¡PREMIO! +${win} CRÉDITOS`:`✨ ¡DOBLE! +${win} CRÉDITOS`;flash(triple)}else E('message').textContent='Sin premio — ¡sigue girando!';addHistory(r,win);update()}
E('spin').onclick=spin;render();update();
