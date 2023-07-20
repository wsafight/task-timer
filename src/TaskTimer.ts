import { ExecHandler, TaskTimerOptions } from './interface';
import { isPositiveNum, isPromise } from './utils';

const DEFAULT_SLEEP = 1000;

const DEFAULT_OPTIONS: TaskTimerOptions = {
  sleep: DEFAULT_SLEEP,
  loop: false,
  immediately: false,
  isWaitAsync: false,
};

class TaskTimer {
  /** 函数句柄  */
  readonly handler?: (...rest: any[]) => void | Promise<void>;

  /** 是否循环，循环几次 */
  readonly loop: TaskTimerOptions['loop'] = false;

  /** 配置 sleep 是否为函数 */
  readonly sleepFun?: (time: number) => number;

  /** 是否立即执行一次 */
  readonly immediately: boolean = false;

  /** 等待时间 */
  readonly sleepTime: number = DEFAULT_SLEEP;

  /** 是否在运行中 */
  running: boolean = false;

  /** setTimeout 返回的句柄，用于清除 */
  timerId: any = 0;

  /** 执行次数，stop 时候可能会清除数据 */
  time: number = 0;

  /** 是否等待异步函数执行完成 */
  isWaitAsync: boolean = false;

  constructor(handler: ExecHandler, options: TaskTimerOptions) {
    const { sleep, loop, immediately, isWaitAsync } = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

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
    this.isWaitAsync = isWaitAsync;
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    let result: null | Promise<void> = null;
    if (this.immediately) {
      result = this.execHandler();
    }
    this.waitAsync(result, this.loopExec);
  }

  stop(
    { reset = true } = {
      reset: true,
    },
  ) {
    this.running = false;
    this.clearTimer();
    if (reset) {
      this.time = 0;
    }
  }

  private waitAsync(result: null | Promise<void>, nextStep: () => void) {
    if (!this.waitAsync) {
      nextStep();
      return;
    }

    if (!isPromise(result)) {
      nextStep();
      return;
    }

    result.then(() => {
      nextStep();
    });
  }

  private loopExec() {
    this.clearTimer();
    this.time++;
    const sleepTime = this.getSleepTime();

    this.timerId = setTimeout(() => {
      this.timerId = 0;
      const result = this.execHandler();
      this.waitAsync(result, this.next);
    }, sleepTime);
  }

  private next() {
    if (typeof this.loop === 'boolean' && this.loop) {
      this.loopExec();
      return;
    }
    if (typeof this.loop === 'number' && this.time <= this.loop) {
      this.loopExec();
      return;
    }
    this.running = false;
  }

  private execHandler(): null | Promise<void> {
    if (!this.handler) {
      return null;
    }
    try {
      return this.handler.apply(this) ?? null;
    } catch (err) {}
    return null;
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
}

export { TaskTimer };
