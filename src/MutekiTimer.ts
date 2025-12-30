const SOURCE = `\
let t = 0;
onmessage = function(e) {
  if (t) {
    t = clearTimeout(t), 0;
  }
  if (typeof e.data === "number" && e.data > 0) {
    t = setTimeout(function() {
      postMessage(0);
    }, e.data);
  }
};\
`;
const TIMER_PATH = URL.createObjectURL(
  new Blob([SOURCE], { type: 'text/javascript' })
);

export class MutekiTimer {
  timer: Worker | number;

  constructor() {
    if (TIMER_PATH) {
      this.timer = new Worker(TIMER_PATH);
    } else {
      this.timer = 0;
    }
  }

  setTimeout(func: () => void, interval: number = 100) {
    if (typeof this.timer === 'number') {
      this.timer = setTimeout(func, interval);
    } else {
      this.timer.onmessage = func;
      this.timer.postMessage(interval);
    }
  }

  clearTimeout() {
    if (typeof this.timer === 'number') {
      clearTimeout(this.timer);
    } else {
      this.timer.postMessage(0);
    }
  }
}
