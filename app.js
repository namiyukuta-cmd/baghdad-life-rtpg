const SAVE_KEY = "baghdad-life-rtpg-v1";

const locations = {
  L001: { name: "橋のたもと", area: "川沿い", danger: "中", pickup: "river", beg: true, river: true, rest: true },
  L002: { name: "公共の井戸", area: "居住区", danger: "低", pickup: "small", rest: true, cleanWater: true },
  L003: { name: "施し所", area: "宗教施設周辺", danger: "低", pickup: "small", rest: true, charity: true },
  L004: { name: "モスク周辺", area: "宗教施設", danger: "中", pickup: "mixed", beg: true, rest: true, prayer: true },
  L005: { name: "屋根のある路地", area: "市街", danger: "中高", pickup: "mixed", beg: true, rest: true, sleep: true },
  L006: { name: "市場", area: "商業区", danger: "中", pickup: "market", beg: true, sell: true, work: true, rest: true },
  L007: { name: "ハンマーム", area: "市街", danger: "低", pickup: "small", rest: true, hammam: true },
  L008: { name: "安宿", area: "宿泊区", danger: "低", pickup: "small", rest: true, sleep: true },
  L009: { name: "王宮周辺", area: "中心部", danger: "高", pickup: "luxury", beg: false, rest: false }
};

const travelMinutes = { L002: 20, L003: 25, L004: 20, L005: 15, L006: 30, L007: 30, L008: 35, L009: 60 };

const pickupTables = {
  river: [
    [1,25,"T021","紐・縄","結束",0.10,"使い古し",1,1],
    [26,45,"T007","釘","金物",0.02,"錆あり",1,3],
    [46,60,"F001","布切れ","素材",0.05,"汚れあり",1,2],
    [61,72,"F002","木片","素材",0.15,"傷あり",1,2],
    [73,82,"F003","陶器片","素材",0.10,"欠け",1,3],
    [83,90,"T025","木匙","食器",0.05,"使い古し",1,1],
    [91,96,"T013","小壺","容器",0.30,"欠けあり",1,1],
    [97,100,"F006","革ひも","結束",0.05,"硬化",1,1]
  ],
  small: [
    [1,28,"F002","木片","素材",0.15,"傷あり",1,2],
    [29,50,"F001","布切れ","素材",0.05,"汚れあり",1,2],
    [51,68,"T007","釘","金物",0.02,"錆あり",1,2],
    [69,82,"F003","陶器片","素材",0.10,"欠け",1,2],
    [83,92,"T021","紐・縄","結束",0.10,"使い古し",1,1],
    [93,100,"T025","木匙","食器",0.05,"使い古し",1,1]
  ],
  mixed: [
    [1,22,"F001","布切れ","素材",0.05,"汚れあり",1,2],
    [23,40,"F002","木片","素材",0.15,"傷あり",1,2],
    [41,56,"T007","釘","金物",0.02,"錆あり",1,3],
    [57,70,"F003","陶器片","素材",0.10,"欠け",1,2],
    [71,82,"T021","紐・縄","結束",0.10,"使い古し",1,1],
    [83,91,"T025","木匙","食器",0.05,"使い古し",1,1],
    [92,97,"T013","小壺","容器",0.30,"欠けあり",1,1],
    [98,100,"F006","革ひも","結束",0.05,"硬化",1,1]
  ],
  market: [
    [1,22,"F009","空の包み布","素材",0.05,"使用済み",1,2],
    [23,40,"T021","紐・縄","結束",0.10,"使い古し",1,1],
    [41,56,"F002","木片","素材",0.15,"傷あり",1,2],
    [57,70,"T007","釘","金物",0.02,"錆あり",1,3],
    [71,82,"F001","布切れ","素材",0.05,"汚れあり",1,2],
    [83,91,"T013","小壺","容器",0.30,"欠けあり",1,1],
    [92,97,"T025","木匙","食器",0.05,"使い古し",1,1],
    [98,100,"F006","革ひも","結束",0.05,"硬化",1,1]
  ],
  luxury: [
    [1,30,"F001","布切れ","素材",0.05,"汚れあり",1,1],
    [31,52,"F006","革ひも","結束",0.05,"硬化",1,1],
    [53,68,"T013","小壺","容器",0.30,"欠けあり",1,1],
    [69,82,"T025","木匙","食器",0.05,"使い古し",1,1],
    [83,92,"F008","絹の細紐","装身素材",0.02,"良い",1,1],
    [93,100,"F009","空の包み布","素材",0.05,"上質",1,1]
  ]
};

const initialState = {
  version: 1,
  year: 247,
  month: 1,
  monthName: "ムハッラム",
  day: 1,
  minutes: 440,
  season: "春",
  weather: "晴れ",
  temperature: 13,
  feel: "ひんやり",
  location: "L001",
  health: 5,
  food: 5,
  thirst: 5,
  sleep: 5,
  hygiene: 3,
  money: 0,
  reputation: 0.1,
  abilities: { EDGE: 2, Heart: 2, Iron: 2, Shadow: 2, Wits: 2 },
  inventory: [
    { id:"I001", name:"ぼろ布の衣服", category:"衣服", qty:1, unitWeight:0.5, quality:"悪い", equipped:true },
    { id:"I002", name:"小さな布袋", category:"容器", qty:1, unitWeight:0.1, quality:"普通", equipped:true },
    { id:"T021", name:"紐・縄", category:"結束", qty:2, unitWeight:0.1, quality:"使い古し", equipped:false },
    { id:"F001", name:"布切れ", category:"素材", qty:1, unitWeight:0.05, quality:"汚れあり", equipped:false }
  ],
  skills: {
    begging: { name:"物乞い", lv:1, xp:0 },
    pickup: { name:"拾得", lv:1, xp:2 },
    pricing: { name:"値付け", lv:0, xp:0 },
    hauling: { name:"荷運び", lv:0, xp:0 },
    cooking: { name:"調理", lv:0, xp:0 },
    craft: { name:"手工芸", lv:0, xp:0 },
    familiar: { name:"顔なじみ", lv:0, xp:0 }
  },
  internal: {
    seed: 2470101,
    serial: 4,
    turn: 5,
    hungerElapsed: 140,
    thirstElapsed: 140,
    awakeElapsed: 140,
    eventCooldown: 0,
    prayerPrep: false,
    firstBegBridgeDone: false
  },
  lastResult: "川沿いでもう一度拾い物を探し、布切れと紐・縄を見つけた。",
  log: [
    "05:00 ゲーム開始",
    "05:10 身を清めた",
    "05:20 朝の礼拝を行った",
    "06:20 拾得：紐・縄×1",
    "07:20 拾得：布切れ×1、紐・縄×1"
  ]
};

let state = loadState();

function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
function mod(n,m){ return ((n % m) + m) % m; }
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
function fmtTime(minutes){
  const m = mod(minutes, 1440);
  const h = Math.floor(m / 60);
  return `${String(h).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;
}
function currentMinutes(){ return mod(state.minutes, 1440); }
function inRange(start,end){ const t=currentMinutes(); return t>=start && t<=end; }
function nextSerial(){ state.internal.serial += 1; return state.internal.serial; }
function fixedRoll(serial, mult, add, sides){ return mod(state.internal.seed + serial * mult + add, sides) + 1; }

function loadState(){
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? { ...clone(initialState), ...JSON.parse(raw) } : clone(initialState);
  } catch { return clone(initialState); }
}
function saveState(show=false){
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  if(show) toast("保存しました");
}

function totalWeight(){
  return state.inventory.reduce((sum,i)=>sum + i.qty * i.unitWeight,0);
}

function updateTemperature(){
  const h = currentMinutes()/60;
  if(h < 5) state.temperature = 10;
  else if(h < 7) state.temperature = 12;
  else if(h < 9) state.temperature = 14;
  else if(h < 11) state.temperature = 18;
  else if(h < 14) state.temperature = 22;
  else if(h < 16) state.temperature = 24;
  else if(h < 18) state.temperature = 22;
  else if(h < 20) state.temperature = 19;
  else if(h < 22) state.temperature = 16;
  else state.temperature = 13;
  state.feel = state.temperature <= 13 ? "ひんやり" : state.temperature <= 18 ? "穏やか" : state.temperature <= 23 ? "暖かい" : "暑い";
}

function applyNeedDecay(minutes){
  state.internal.hungerElapsed += minutes;
  state.internal.thirstElapsed += minutes;
  state.internal.awakeElapsed += minutes;

  while(state.internal.hungerElapsed >= 240){
    state.internal.hungerElapsed -= 240;
    if(state.food > 0) state.food -= 1; else state.health = Math.max(0,state.health-1);
  }
  while(state.internal.thirstElapsed >= 180){
    state.internal.thirstElapsed -= 180;
    if(state.thirst > 0) state.thirst -= 1; else state.health = Math.max(0,state.health-1);
  }
  while(state.internal.awakeElapsed >= 360){
    state.internal.awakeElapsed -= 360;
    if(state.sleep > 0) state.sleep -= 1;
  }
}

function advanceTime(minutes){
  state.minutes += minutes;
  while(state.minutes >= 1440){ state.minutes -= 1440; state.day += 1; }
  applyNeedDecay(minutes);
  updateTemperature();
}

function addLog(text){
  state.log.push(`${fmtTime(state.minutes)} ${text}`);
  if(state.log.length > 80) state.log.shift();
}

function addInventory(item, qty){
  const found = state.inventory.find(i=>i.id===item.id && i.quality===item.quality);
  if(found) found.qty += qty;
  else state.inventory.push({ ...item, qty, equipped:false });
}

function pickupCandidate(group, roll, qtyRoll){
  const table = pickupTables[group] || [];
  const row = table.find(r=>roll>=r[0] && roll<=r[1]);
  if(!row) return null;
  const span = row[8]-row[7]+1;
  return {
    id:row[2], name:row[3], category:row[4], unitWeight:row[5], quality:row[6],
    qty: row[7] + mod(qtyRoll-1, span)
  };
}

function doPickup(){
  const loc = locations[state.location];
  if(!loc.pickup){ return; }
  const serial = nextSerial();
  const d6 = fixedRoll(serial,17,11,6);
  const c1 = fixedRoll(serial,31,7,10);
  const c2 = fixedRoll(serial,47,13,10);
  const bonus = Math.max(state.skills.pickup.lv-1,0);
  const score = Math.min(10,d6 + state.abilities.Wits + bonus);
  const beats = Number(score>c1) + Number(score>c2);
  const result = beats===2 ? "strong" : beats===1 ? "weak" : "miss";
  const count = result==="strong" ? 2 : result==="weak" ? 1 : 0;
  const found = [];

  for(let n=0;n<count;n++){
    const roll = n===0 ? fixedRoll(serial,59,19,100) : fixedRoll(serial,71,23,100);
    const qRoll = n===0 ? fixedRoll(serial,83,29,100) : fixedRoll(serial,97,31,100);
    const item = pickupCandidate(loc.pickup, roll, qRoll);
    if(item){ addInventory(item,item.qty); found.push(`${item.name}×${item.qty}`); }
  }

  state.skills.pickup.xp += 1;
  if(state.skills.pickup.xp >= 10){ state.skills.pickup.xp -= 10; state.skills.pickup.lv += 1; }

  const eventRoll = fixedRoll(serial,101,37,100);
  let eventText = "";
  if(state.internal.eventCooldown<=0 && eventRoll<=5){
    eventText = "近くを通った荷運び人が一度こちらを見たが、そのまま人波へ消えていった。";
    state.internal.eventCooldown = 2;
  } else {
    state.internal.eventCooldown = Math.max(0,state.internal.eventCooldown-1);
  }

  advanceTime(60);
  state.internal.turn += 1;
  const label = result==="strong" ? "強い成功" : result==="weak" ? "弱い成功" : "失敗";
  const loot = found.length ? `見つけた：${found.join("、")}。` : "使えそうなものは見つからなかった。";
  state.lastResult = `拾得判定：${label}（${d6}+Wits${state.abilities.Wits}${bonus?`+技能${bonus}`:""}=${score} vs ${c1}/${c2}）。${loot}${eventText ? ` ${eventText}`:""}`;
  addLog(`拾得：${label}${found.length?`／${found.join("、")}`:""}`);
  finishAction();
}

function doBeg(){
  const loc = locations[state.location];
  if(!loc.beg) return;
  const serial = nextSerial();
  const d6 = fixedRoll(serial,13,5,6);
  const c1 = fixedRoll(serial,29,3,10);
  const c2 = fixedRoll(serial,43,9,10);
  const score = Math.min(10,d6 + state.abilities.Heart + Math.max(state.skills.begging.lv-1,0));
  const beats = Number(score>c1)+Number(score>c2);
  let income = beats===2 ? 0.3 : beats===1 ? 0.1 : 0;
  state.money = Math.round((state.money + income)*10)/10;
  state.skills.begging.xp += 1;
  let event = "";
  if(state.location==="L001" && !state.internal.firstBegBridgeDone){
    state.internal.firstBegBridgeDone = true;
    event = "橋を渡る年配の男が歩みを緩め、黙って小銭を置いていった。";
    state.reputation = Math.round((state.reputation+0.1)*10)/10;
  }
  advanceTime(60);
  state.internal.turn += 1;
  const label = beats===2?"強い成功":beats===1?"弱い成功":"失敗";
  state.lastResult = `物乞い：${label}（${d6}+Heart${state.abilities.Heart}=${score} vs ${c1}/${c2}）。${income?`所持金+${income}。`:"施しは得られなかった。"}${event?` ${event}`:""}`;
  addLog(`物乞い：${label}${income?`／+${income}`:""}`);
  finishAction();
}

function doDrinkRiver(){
  if(!locations[state.location].river) return;
  const serial = nextSerial();
  const risk = fixedRoll(serial,37,17,10);
  state.thirst = clamp(state.thirst+2,0,5);
  state.internal.thirstElapsed = 0;
  let text = "川の水で喉を潤した。乾きが回復した。";
  if(risk>=9){ state.health = Math.max(0,state.health-1); text += " しばらくして腹に鈍い不調を感じる。体力-1。"; }
  advanceTime(20);
  state.internal.turn += 1;
  state.lastResult = text;
  addLog("川の水を飲んだ");
  finishAction();
}

function doRest(){
  if(!locations[state.location].rest) return;
  nextSerial();
  advanceTime(30);
  state.health = clamp(state.health+1,0,5);
  state.internal.turn += 1;
  state.lastResult = "座れる場所を見つけて30分休んだ。体力を少し整えた。";
  addLog("30分休んだ");
  finishAction();
}

function doCleanse(){
  const loc=locations[state.location];
  if(!(loc.river||loc.cleanWater)) return;
  nextSerial();
  advanceTime(10);
  state.hygiene = clamp(state.hygiene+1,0,5);
  state.internal.prayerPrep = true;
  state.internal.turn += 1;
  state.lastResult = "水辺で身を清めた。";
  addLog("身を清めた");
  finishAction();
}

function prayerWindow(){
  return inRange(270,360)||inRange(720,780)||inRange(900,1020)||inRange(1080,1140)||inRange(1170,1290);
}
function doPrayer(){
  if(!state.internal.prayerPrep || !prayerWindow()) return;
  nextSerial();
  advanceTime(10);
  state.reputation = Math.round((state.reputation+0.1)*10)/10;
  state.internal.prayerPrep = false;
  state.internal.turn += 1;
  state.lastResult = "礼拝を行った。周囲からの評判がわずかに上がった。";
  addLog("礼拝を行った");
  finishAction();
}

function doCharity(){
  if(state.location!=="L003") return;
  const serial=nextSerial();
  const d6=fixedRoll(serial,23,7,6);
  const c=fixedRoll(serial,41,11,10);
  const score=d6+state.abilities.Heart;
  const ok=score>c;
  advanceTime(30);
  if(ok){ state.food=clamp(state.food+2,0,5); state.internal.hungerElapsed=0; }
  state.internal.turn += 1;
  state.lastResult=ok?`施しの食事を受け取れた（${score} vs ${c}）。食欲が回復した。`:`列には並んだが、今回は食事を受け取れなかった（${score} vs ${c}）。`;
  addLog(ok?"施しの食事を受け取った":"施し所：食事なし");
  finishAction();
}

function doWorkSearch(){
  if(state.location!=="L006") return;
  const serial=nextSerial();
  const d6=fixedRoll(serial,19,13,6);
  const c1=fixedRoll(serial,33,5,10), c2=fixedRoll(serial,49,7,10);
  const score=d6+state.abilities.Heart;
  const beats=Number(score>c1)+Number(score>c2);
  advanceTime(60);
  state.internal.turn += 1;
  if(beats===2){ state.lastResult=`仕事探し：強い成功（${score} vs ${c1}/${c2}）。荷運びの短い仕事を頼めそうな商人を見つけた。`; }
  else if(beats===1){ state.lastResult=`仕事探し：弱い成功（${score} vs ${c1}/${c2}）。仕事口の噂をひとつ聞けた。`; }
  else state.lastResult=`仕事探し：失敗（${score} vs ${c1}/${c2}）。今すぐ雇う者は見つからなかった。`;
  addLog("市場で仕事を探した");
  finishAction();
}

function doSellOne(){
  if(state.location!=="L006") return;
  const item=state.inventory.find(i=>!i.equipped && i.qty>0);
  if(!item){ state.lastResult="売れそうな拾得物を持っていない。"; render(); return; }
  nextSerial();
  item.qty-=1;
  const price = item.id==="F008" ? 0.5 : item.id==="T013" ? 0.3 : 0.1;
  state.money=Math.round((state.money+price)*10)/10;
  if(item.qty<=0) state.inventory=state.inventory.filter(i=>i!==item);
  advanceTime(30);
  state.internal.turn +=1;
  state.lastResult=`${item.name}×1を売った。所持金+${price}。`;
  addLog(`売却：${item.name}×1`);
  finishAction();
}

function moveTo(id){
  const duration=travelMinutes[id];
  if(!duration || id===state.location) return;
  const serial=nextSerial();
  advanceTime(duration);
  state.location=id;
  state.internal.turn+=1;
  const eventRoll=fixedRoll(serial,67,21,100);
  const event=eventRoll<=3?" 道の途中で荷車が詰まり、少し人波に揉まれた。":"";
  state.lastResult=`${locations[id].name}へ移動した。${duration}分経過。${event}`;
  addLog(`移動：${locations[id].name}`);
  finishAction();
}

function finishAction(){
  saveState(false);
  render();
}

function actionAvailable(action){
  const loc=locations[state.location];
  const t=currentMinutes();
  switch(action){
    case "pickup": return t>=270&&t<=1320&&!!loc.pickup;
    case "beg": return t>=360&&t<=1200&&!!loc.beg;
    case "river": return !!loc.river;
    case "rest": return !!loc.rest;
    case "cleanse": return !!(loc.river||loc.cleanWater);
    case "prayer": return prayerWindow()&&state.internal.prayerPrep;
    case "charity": return loc.charity && (inRange(420,540)||inRange(1020,1140));
    case "work": return loc.work&&t>=360&&t<=1020;
    case "sell": return loc.sell&&t>=420&&t<=1140&&state.inventory.some(i=>!i.equipped&&i.qty>0);
    default:return false;
  }
}

function renderActions(){
  const defs=[
    ["pickup","拾い物を探す","60分",doPickup,true],
    ["beg","路上で物乞い","60分",doBeg,false],
    ["charity","施し所で食事","30分",doCharity,false],
    ["work","仕事を探す","60分",doWorkSearch,false],
    ["sell","拾い物を1つ売る","30分",doSellOne,false],
    ["river","川の水を飲む","20分・病気リスク",doDrinkRiver,false],
    ["cleanse","身を清める","10分",doCleanse,false],
    ["prayer","礼拝","10分",doPrayer,false],
    ["rest","休む","30分",doRest,false]
  ];
  const box=document.getElementById("actions");
  box.innerHTML="";
  defs.filter(d=>actionAvailable(d[0])).forEach(d=>{
    const b=document.createElement("button");
    b.className=`action${d[4]?" primary":""}`;
    b.innerHTML=`${d[1]}<small>${d[2]}</small>`;
    b.onclick=d[3];
    box.appendChild(b);
  });
  if(!box.children.length) box.innerHTML='<div class="muted">今ここで実行できる行動はありません。</div>';
}

function renderMoves(){
  const box=document.getElementById("moves");
  box.innerHTML="";
  Object.entries(travelMinutes).forEach(([id,min])=>{
    if(id===state.location) return;
    const b=document.createElement("button");
    b.className="move";
    b.innerHTML=`${locations[id].name}<small>${min}分</small>`;
    b.onclick=()=>moveTo(id);
    box.appendChild(b);
  });
}

function render(){
  document.getElementById("dateText").textContent=`${state.year}AH・${state.monthName}${state.day}日`;
  document.getElementById("timeText").textContent=fmtTime(state.minutes);
  document.getElementById("weatherText").textContent=`季節：${state.season}／天候：${state.weather}／気温：${state.temperature}℃／体感：${state.feel}`;
  document.getElementById("locationText").textContent=locations[state.location].name;
  document.getElementById("moneyText").textContent=state.money;
  document.getElementById("repText").textContent=state.reputation.toFixed(1);
  document.getElementById("weightText").textContent=`${totalWeight().toFixed(2)}kg`;
  document.getElementById("resultText").textContent=state.lastResult;

  const meters=[["体力",state.health],["食欲",state.food],["乾き",state.thirst],["睡眠",state.sleep],["衛生",state.hygiene]];
  document.getElementById("meters").innerHTML=meters.map(([n,v])=>`<div class="meter"><span class="meter-name">${n}</span><span class="meter-value">${v}</span><span class="meter-dots">${"●".repeat(v)}${"○".repeat(5-v)}</span></div>`).join("");
  document.getElementById("abilities").innerHTML=Object.entries(state.abilities).map(([k,v])=>`<span>${k}<b>${v}</b></span>`).join("");

  document.getElementById("inventory").innerHTML=state.inventory.map(i=>`<div class="list-row"><span>${i.name}${i.equipped?"［装備］":""}<br><small class="muted">${i.quality}</small></span><strong>×${i.qty}</strong></div>`).join("");
  document.getElementById("skills").innerHTML=Object.values(state.skills).map(s=>`<div class="list-row"><span>${s.name}</span><span>Lv${s.lv}　XP ${s.xp}/10</span></div>`).join("");
  document.getElementById("log").innerHTML=[...state.log].reverse().map(x=>`<div class="list-row"><span>${x}</span></div>`).join("");

  renderActions();
  renderMoves();
}

function toast(text){
  const el=document.getElementById("toast");
  el.textContent=text; el.hidden=false;
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>el.hidden=true,1200);
}

document.getElementById("saveBtn").onclick=()=>saveState(true);
document.getElementById("resetBtn").onclick=()=>{
  if(confirm("この端末のセーブを初期状態に戻しますか？")){
    state=clone(initialState); saveState(false); render(); toast("初期状態に戻しました");
  }
};

updateTemperature();
render();
