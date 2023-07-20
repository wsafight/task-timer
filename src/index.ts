import { ExecHandler, TaskTimerOptions } from './interface';
import { TaskTimer } from './TaskTimer';

const createTaskTimer = (handler: ExecHandler, opts: TaskTimerOptions) => {
  return new TaskTimer(handler, opts);
};

export { TaskTimer, createTaskTimer };

export default createTaskTimer;
