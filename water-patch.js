// 水分補給の不足を補う小さなゲーム処理パッチ。
// 公共の井戸では、その場で飲むだけなら容器を不要とする。
// 容器は「水を汲んで持ち運ぶ」処理を追加するときに使う。

function doDrinkWell(){
  if(state.location !== "L002") return;
  nextSerial();
  advanceTime(10);
  state.thirst = clamp(state.thirst + 3, 0, 5);
  state.internal.thirstElapsed = 0;
  state.internal.turn += 1;
  state.lastResult = "公共の井戸で水を飲んだ。乾きが回復した。";
  addLog("井戸の水を飲んだ");
  finishAction();
}

const waterBaseActionAvailable = actionAvailable;
actionAvailable = function patchedActionAvailable(action){
  if(action === "wellDrink"){
    const t = currentMinutes();
    return state.location === "L002" && t >= 270 && t <= 1260;
  }
  return waterBaseActionAvailable(action);
};

const waterBaseRenderActions = renderActions;
renderActions = function patchedRenderActions(){
  waterBaseRenderActions();
  if(!actionAvailable("wellDrink")) return;

  const box = document.getElementById("actions");
  const b = document.createElement("button");
  b.className = "action";
  b.innerHTML = "井戸の水を飲む<small>10分・乾き+3</small>";
  b.onclick = doDrinkWell;
  box.appendChild(b);
};

render();
