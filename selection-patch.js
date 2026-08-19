// 行動・移動を即実行せず、選択してから「決定」するための操作パッチ。
// 移動先を選ぶと、その場所へ到着した時点で実行できる行動を先に確認できる。

let plannedMoveId = null;
let plannedActionKey = null;
let plannedActionExecute = null;

const selectionBaseRenderActions = renderActions;
const selectionBaseRenderMoves = renderMoves;

function previewActionState(callback){
  if(!plannedMoveId){
    callback();
    return;
  }

  const liveState = state;
  try {
    state = clone(liveState);
    const minutes = travelMinutes[plannedMoveId] || 0;
    advanceTime(minutes);
    state.location = plannedMoveId;
    callback();
  } finally {
    state = liveState;
  }
}

function actionKeyFromButton(button){
  const cloneButton = button.cloneNode(true);
  const small = cloneButton.querySelector('small');
  if(small) small.remove();
  return cloneButton.textContent.trim();
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

renderActions = function selectableRenderActions(){
  previewActionState(() => selectionBaseRenderActions());

  const box = document.getElementById('actions');
  [...box.querySelectorAll('button.action')].forEach(button => {
    if(button.disabled) return;

    const originalExecute = button.onclick;
    const key = actionKeyFromButton(button);

    if(key === plannedActionKey){
      button.classList.add('selected-choice');
      plannedActionExecute = originalExecute;
    }

    button.onclick = () => {
      plannedActionKey = key;
      plannedActionExecute = originalExecute;
      [...box.querySelectorAll('button.action')].forEach(b => b.classList.remove('selected-choice'));
      button.classList.add('selected-choice');
      resetDecisionConfirm();
    };
  });

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
      plannedActionExecute = null;
      resetDecisionConfirm();
      renderMoves();
      renderActions();
    };
  });
};

function clearPlan(){
  plannedMoveId = null;
  plannedActionKey = null;
  plannedActionExecute = null;
  resetDecisionConfirm();
}

function showDecisionConfirm(){
  if(!plannedMoveId && !plannedActionKey){
    toast('行動か移動を選んでください');
    return;
  }

  const decisionBtn = document.getElementById('decisionBtn');
  const confirmBox = document.getElementById('decisionConfirm');
  if(decisionBtn) decisionBtn.hidden = true;
  if(confirmBox) confirmBox.hidden = false;
}

function executePlan(){
  const moveId = plannedMoveId;
  const actionExecute = plannedActionExecute;
  const hasAction = !!plannedActionKey && typeof actionExecute === 'function';

  clearPlan();

  if(moveId){
    moveTo(moveId);
    // 所持金や施し所条件などで移動できなかった場合は、その先の行動も実行しない。
    if(state.location !== moveId) return;
  }

  if(hasAction) actionExecute();
}

document.getElementById('decisionBtn').onclick = showDecisionConfirm;
document.getElementById('decisionYes').onclick = executePlan;
document.getElementById('decisionNo').onclick = resetDecisionConfirm;

render();
