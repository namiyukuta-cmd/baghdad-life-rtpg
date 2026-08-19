// 水分補給ルール補正。
// 公共の井戸は「汲む」場所なので、水容器がない状態では飲水アクションを追加しない。
// 施し所で食事を受け取れた場合は、食事と一緒に水も受け取る。

function doCharity(){
  if(state.location!=="L003") return;
  const serial=nextSerial();
  const d6=fixedRoll(serial,23,7,6);
  const c=fixedRoll(serial,41,11,10);
  const score=d6+state.abilities.Heart;
  const ok=score>c;
  advanceTime(30);

  if(ok){
    state.food=clamp(state.food+2,0,5);
    state.thirst=clamp(state.thirst+3,0,5);
    state.internal.hungerElapsed=0;
    state.internal.thirstElapsed=0;
  }

  state.internal.turn += 1;
  state.lastResult=ok
    ? `施しの食事と水を受け取れた（${score} vs ${c}）。食欲と乾きが回復した。`
    : `列には並んだが、今回は食事と水を受け取れなかった（${score} vs ${c}）。`;
  addLog(ok?"施しの食事と水を受け取った":"施し所：食事・水なし");
  finishAction();
}

const charityWaterBaseRenderActions = renderActions;
renderActions = function patchedCharityWaterRenderActions(){
  charityWaterBaseRenderActions();
  const box=document.getElementById("actions");
  [...box.querySelectorAll('.action')].forEach(button=>{
    if(button.textContent.includes("施し所で食事")){
      button.innerHTML="施し所で食事と水<small>30分</small>";
      button.onclick=doCharity;
    }
  });
};

render();
