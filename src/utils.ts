const isPositiveNum = (num: number) => {
  return (typeof num === 'number' || typeof num === 'bigint') && num > 0;
};

const isObject = (val: any) =>
  val !== null && (typeof val === 'object' || typeof val === 'function');

const isPromise = <T>(val: any): val is Promise<T> => {
  return (
    val instanceof Promise ||
    (isObject(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function')
  );
};

export { isPositiveNum, isPromise };
