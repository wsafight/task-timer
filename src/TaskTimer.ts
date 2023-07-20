import { ExecHandler, TaskTimerOptions } from './interface';
import { isPositiveNum } from './utils';

const DEFAULT_SLEEP = 1000;

const DEFAULT_OPTIONS: TaskTimerOptions = {
  sleep: DEFAULT_SLEEP,
  loop: false,
  immediately: false,
};

class TaskTimer {
  /** 函数句柄  */
  readonly handler?: (...rest: any[]) => void;

  /** 是否循环，循环几次 */
  readonly loop: TaskTimerOptions['loop'] = false;

  /** 配置 sleep 是否为函数 */
  readonly sleepFun?: (time: number) => number;

  /** 是否立即执行一次 */
  readonly immediately: boolean = false;

  /** 等待时间 */
  readonly sleepTime: number = DEFAULT_SLEEP;

  /** setTimeout 返回的句柄，用于清除 */
  timerId: any = 0;

  /** 执行次数，stop 时候可能会清除数据 */
  time: number = 0;

  constructor(handler: ExecHandler, options: TaskTimerOptions) {
    const { sleep, loop, immediately } = { ...DEFAULT_OPTIONS, ...options };
    if (typeof handler === 'function') {
      this.handler = handler;
    }
    if (typeof sleep === 'function') {
      this.sleepFun = sleep;
    } else if (isPositiveNum(sleep)) {
      this.sleepTime = sleep;
    }
    this.immediately = immediately ?? false;
    this.loop = loop ?? false;
  }

  start() {
    this.immediatelyExec();
    this.loopExec();
  }

  loopExec() {
    this.clearTimer();
    this.time++;
    this.timerId = setTimeout(() => {
      this.timerId = 0;
      this.execHandler();
      this.next();
    }, this.getSleepTime());
  }

  next() {
    if (typeof this.loop === 'boolean' && this.loop) {
      this.loopExec();
      return;
    }
    if (typeof this.loop === 'number' && this.time <= this.loop) {
      this.loopExec();
    }
  }

  execHandler() {
    if (!this.handler) {
      return;
    }
    this.handler.apply(this);
  }

  /**
   * 立即执行
   */
  immediatelyExec() {
    if (!this.immediately) {
      return;
    }
    this.execHandler();
  }

  private getSleepTime() {
    if (!this.sleepFun) {
      return this.sleepTime;
    }
    const result = this.sleepFun(this.time);
    return isPositiveNum(result) ? result : this.sleepTime;
  }

  private clearTimer() {
    if (this.timerId === 0) {
      return;
    }
    clearTimeout(this.timerId);
    this.timerId = 0;
  }

  stop(
    { reset = true } = {
      reset: true,
    },
  ) {
    this.clearTimer();
    if (reset) {
      this.time = 0;
    }
  }
}

export { TaskTimer };
