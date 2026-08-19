// 施し所・水分補給ルール補正。
// 公共の井戸は「汲む」場所なので、水容器がない状態では飲水アクションを追加しない。
// 施し所は低所得時の生活保障として、時間帯内なら原則として食事と水を受け取れる。
// ただし待ち時間は時間帯で変化し、一定以上の所持金がある場合は満杯扱いで利用できない。

// 経済バランス確定前の暫定値。後で設定値だけ差し替えられるよう1か所にまとめる。
const CHARITY_MONEY_LIMIT = 1.0;

function ensureCharityInternal(){
  if(!state.internal) state.internal = {};
  if(typeof state.internal.charityReceivedCount !== "number") state.internal.charityReceivedCount = 0;
  if(typeof state.internal.charityUnreturnedCount !== "number") state.internal.charityUnreturnedCount = 0;
}

function charityWindowOpen(){
  return state.location === "L003" && (inRange(420,540) || inRange(1020,1140));
}

function charityBlockedByMoney(){
  return state.money >= CHARITY_MONEY_LIMIT;
}

function charityWaitMinutes(){
  const t = currentMinutes();
  // 配給開始直後は列が長く、終盤ほど短くなる。
  // 朝 07:00-09:00 / 夕 17:00-19:00
  if((t >= 420 && t < 450) || (t >= 1020 && t < 1050)) return 60;
  if((t >= 450 && t < 495) || (t >= 1050 && t < 1095)) return 40;
  return 20;
}

function doCharity(){
  ensureCharityInternal();
  if(!charityWindowOpen()) return;

  if(charityBlockedByMoney()){
    state.lastResult = "今日は施し所は満杯だ。中には入れなかった。";
    render();
    return;
  }

  nextSerial();
  const wait = charityWaitMinutes();
  advanceTime(wait);

  // 低所得時は原則として受け取れる。判定は行わない。
  state.food = clamp(state.food + 2, 0, 5);
  state.thirst = clamp(state.thirst + 3, 0, 5);
  state.internal.hungerElapsed = 0;
  state.internal.thirstElapsed = 0;
  state.internal.charityReceivedCount += 1;
  state.internal.charityUnreturnedCount += 1;
  state.internal.turn += 1;

  state.lastResult = `施し所の列に${wait}分並び、食事と水を受け取った。食欲と乾きが回復した。`;
  addLog(`施し所：食事と水／待ち${wait}分`);
  finishAction();
}

// 施し所へ向かう時点で所持金上限に達しているなら、
// ゲーム上は「今日は満杯」として中へ入れない。
const charityBaseMoveTo = moveTo;
moveTo = function patchedCharityMoveTo(id){
  ensureCharityInternal();
  if(id === "L003" && charityBlockedByMoney()){
    state.lastResult = "今日は施し所は満杯だ。中には入れなかった。";
    render();
    return;
  }
  charityBaseMoveTo(id);
};

// 元のA004は判定式だったので、施し所についてだけ利用可否を上書きする。
const charityBaseActionAvailable = actionAvailable;
actionAvailable = function patchedCharityActionAvailable(action){
  if(action === "charity"){
    if(!charityWindowOpen()) return false;
    return !charityBlockedByMoney();
  }
  return charityBaseActionAvailable(action);
};

const charityBaseRenderActions = renderActions;
renderActions = function patchedCharityRenderActions(){
  ensureCharityInternal();
  charityBaseRenderActions();
  const box = document.getElementById("actions");

  [...box.querySelectorAll('.action')].forEach(button => {
    if(button.textContent.includes("施し所で食事")){
      const wait = charityWaitMinutes();
      button.innerHTML = `施し所で食事と水<small>${wait}分・原則受給</small>`;
      button.onclick = doCharity;
    }
  });

  // 時間帯内だが所持金条件で利用不可の場合は、理由を見える形で残す。
  if(state.location === "L003" && (inRange(420,540) || inRange(1020,1140)) && charityBlockedByMoney()){
    const b = document.createElement("button");
    b.className = "action";
    b.disabled = true;
    b.innerHTML = "今日は施し所は満杯だ<small>現在は利用できない</small>";
    box.appendChild(b);
  }
};

ensureCharityInternal();
render();
