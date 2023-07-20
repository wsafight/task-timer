export interface TaskTimerOptions {
  sleep: ((time: number) => number) | number;
  loop: boolean | number;
  immediately: boolean;
}

export type ExecHandler = () => void;
