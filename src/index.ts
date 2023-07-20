import { ExecHandler, TimerOptions } from './interface';
import { Timer } from './Timer';

const createTimer = (handler: ExecHandler, opts: TimerOptions) => {
  return new Timer(handler, opts);
};

export { Timer, createTimer };

export default createTimer;
