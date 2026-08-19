// 表示だけを補正する小さなパッチ。
// 本体のゲーム処理は app.js のまま維持する。

const UI_METER_MAX = 5;
// 総運搬上限はまだゲーム正本で未設定。
// 袋・籠などの収納容量とは別ルールとして後で設定する。
const UI_MAX_CARRY_KG = null;

const baseRender = render;
render = function patchedRender(){
  baseRender();

  const values = [state.health, state.food, state.thirst, state.sleep, state.hygiene];
  document.querySelectorAll('.meter').forEach((meter, index) => {
    const value = meter.querySelector('.meter-value');
    if(value) value.textContent = `${values[index]}/${UI_METER_MAX}`;
    const dots = meter.querySelector('.meter-dots');
    if(dots) dots.remove();
  });

  const weight = document.getElementById('weightText');
  if(weight){
    const current = totalWeight().toFixed(2);
    weight.textContent = UI_MAX_CARRY_KG == null
      ? `${current}/―kg`
      : `${current}/${UI_MAX_CARRY_KG.toFixed(2)}kg`;
  }
};

render();
