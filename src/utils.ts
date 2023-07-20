const isPositiveNum = (num: number) => {
  return (typeof num === 'number' || typeof num === 'bigint') && num > 0;
};

export { isPositiveNum };
