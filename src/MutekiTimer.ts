/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const wsetTimeout = window.setTimeout;
const wclearTimeout = window.clearTimeout;

const SOURCE = `\
var t = 0;
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
const TIMER_PATH = __guard__(
  window.URL != null ? window.URL : (window as any).webkitURL,
  (x) =>
    x.createObjectURL(
      (() => {
        try {
          return new Blob([SOURCE], { type: 'text/javascript' });
        } catch (e) {
          return null;
        }
      })()
    )
);

class MutekiTimer {
  timer: Worker | number;

  constructor() {
    if (TIMER_PATH) {
      this.timer = new Worker(TIMER_PATH);
    } else {
      this.timer = 0;
    }
  }

  setTimeout(func, interval) {
    if (interval == null) {
      interval = 100;
    }
    if (typeof this.timer === 'number') {
      return (this.timer = wsetTimeout(func, interval));
    } else {
      this.timer.onmessage = func;
      return this.timer.postMessage(interval);
    }
  }

  clearTimeout() {
    if (typeof this.timer === 'number') {
      return clearTimeout(this.timer);
    } else {
      return this.timer.postMessage(0);
    }
  }
}

let tid = +new Date();
const pool = {};
const _setTimeout = function (func, interval) {
  const t = new MutekiTimer();
  t.setTimeout(func, interval);
  pool[++tid] = t;
  return tid;
};

const _clearTimeout = function (id) {
  if (pool[id] != null) {
    pool[id].clearTimeout();
  }
  return undefined;
};

export { MutekiTimer };

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
