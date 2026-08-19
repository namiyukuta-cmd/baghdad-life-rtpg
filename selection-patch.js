// 行動・移動を即実行せず、選択してから「決定」するための操作パッチ。
// 移動先を選ぶと、その場所へ到着した時点で可能な行動を直接組み立てて表示する。
// 既存renderActionsの多重パッチに依存しないようにして、施し所などが消える不具合を防ぐ。

let plannedMoveId = null;
let plannedActionKey = null;

const selectionBaseRenderMoves = renderMoves;

const ACTION_DEFS = [
  { key:'pickup',  label:'拾い物を探す',       detail:'60分',              fn:()=>doPickup(),     primary:true },
  { key:'beg',     label:'路上で物乞い',       detail:'60分',              fn:()=>doBeg() },
  { key:'charity', label:'施し所で食事と水',   detail:'',                  fn:()=>doCharity() },
  { key:'work',    label:'仕事を探す',         detail:'60分',              fn:()=>doWorkSearch() },
  { key:'sell',    label:'拾い物を1つ売る',    detail:'30分',              fn:()=>doSellOne() },
  { key:'river',   label:'川の水を飲む',       detail:'20分・病気リスク',  fn:()=>doDrinkRiver() },
  { key:'cleanse', label:'身を清める',         detail:'10分',              fn:()=>doCleanse() },
  { key:'prayer',  label:'礼拝',               detail:'10分',              fn:()=>doPrayer() },
  { key:'rest',    label:'休む',               detail:'30分',              fn:()=>doRest() }
];

function withPreviewState(callback){
  const liveState = state;
  try {
    if(plannedMoveId){
      state = clone(liveState);
      const minutes = travelMinutes[plannedMoveId] || 0;
      advanceTime(minutes);
      state.location = plannedMoveId;
    }
    return callback();
  } finally {
    state = liveState;
  }
}

function previewLocationId(){
  return plannedMoveId || state.location;
}

function resetDecisionConfirm(){
  const decisionBtn = document.getElementById('decisionBtn');
  const confirmBox = document.getElementById('decisionConfirm');
  if(decisionBtn) decisionBtn.hidden = false;
  if(confirmBox) confirmBox.hidden = true;
}

function updateActionHeading(){
  const title = document.getElementById('actionTitle');
  if(!title) return;
  title.textContent = plannedMoveId ? `行動（${locations[plannedMoveId].name}）` : '行動';
}

function addActionButton(box, def, detail, disabled=false, overrideLabel=null){
  const b = document.createElement('button');
  b.className = `action${def && def.primary ? ' primary' : ''}`;
  if(disabled) b.disabled = true;
  const label = overrideLabel || (def ? def.label : '');
  b.innerHTML = `${label}${detail ? `<small>${detail}</small>` : ''}`;

  if(!disabled && def){
    if(def.key === plannedActionKey) b.classList.add('selected-choice');
    b.onclick = () => {
      plannedActionKey = plannedActionKey === def.key ? null : def.key;
      resetDecisionConfirm();
      renderActions();
    };
  }
  box.appendChild(b);
}

renderActions = function selectableRenderActions(){
  const box = document.getElementById('actions');
  box.innerHTML = '';

  withPreviewState(() => {
    const locId = state.location;

    // 施し所だけは、利用不可の理由も見えるようにする。
    if(locId === 'L003'){
      const needsHelp = typeof charityNeedsHelp === 'function'
        ? charityNeedsHelp()
        : !(state.food >= 5 && state.thirst >= 5);

      if(needsHelp){
        const blocked = typeof charityBlockedByMoney === 'function' && charityBlockedByMoney();
        const open = (inRange(420,540) || inRange(1020,1140));
        const charityDef = ACTION_DEFS.find(d => d.key === 'charity');

        if(blocked){
          addActionButton(box, charityDef, '現在は利用できない', true, '今日は施し所は満杯だ');
        } else if(open){
          const wait = typeof charityWaitMinutes === 'function' ? charityWaitMinutes() : 30;
          addActionButton(box, charityDef, `${wait}分・原則受給`);
        } else {
          addActionButton(box, charityDef, '配給時間 07:00-09:00 / 17:00-19:00', true);
        }
      }
    }

    // 施し所以外の通常行動。
    ACTION_DEFS.filter(def => def.key !== 'charity').forEach(def => {
      if(actionAvailable(def.key)) addActionButton(box, def, def.detail);
    });
  });

  if(!box.children.length){
    box.innerHTML = '<div class="muted">ここで実行できる行動はありません。</div>';
  }

  updateActionHeading();
};

renderMoves = function selectableRenderMoves(){
  selectionBaseRenderMoves();
  const box = document.getElementById('moves');

  [...box.querySelectorAll('button.move')].forEach(button => {
    const id = Object.keys(locations).find(locationId => button.textContent.includes(locations[locationId].name));
    if(!id) return;

    if(id === plannedMoveId) button.classList.add('selected-choice');

    button.onclick = () => {
      plannedMoveId = plannedMoveId === id ? null : id;
      plannedActionKey = null;
      resetDecisionConfirm();
      renderMoves();
      renderActions();
    };
  });
};

function clearPlan(){
  plannedMoveId = null;
  plannedActionKey = null;
  resetDecisionConfirm();
}

function showDecisionConfirm(){
  if(!plannedMoveId && !plannedActionKey){
    toast('行動か移動を選んでください');
    return;
  }
  document.getElementById('decisionBtn').hidden = true;
  document.getElementById('decisionConfirm').hidden = false;
}

function executePlan(){
  const moveId = plannedMoveId;
  const actionKey = plannedActionKey;
  const actionDef = ACTION_DEFS.find(d => d.key === actionKey);

  clearPlan();

  if(moveId){
    moveTo(moveId);
    if(state.location !== moveId) return;
  }

  if(actionDef && actionAvailable(actionDef.key)){
    actionDef.fn();
  } else if(actionKey === 'charity' && actionDef){
    // 施し所は独自条件を持つため、doCharity側にも最終判定させる。
    actionDef.fn();
  }
}

document.getElementById('decisionBtn').onclick = showDecisionConfirm;
document.getElementById('decisionYes').onclick = executePlan;
document.getElementById('decisionNo').onclick = resetDecisionConfirm;

render();
