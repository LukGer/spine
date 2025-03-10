export const rubberBand = (value: number, limit: number): number => {
  "worklet";
  const sign = Math.sign(value);
  const abs = Math.abs(value);

  if (abs <= limit) {
    return value;
  }

  return sign * limit * (1 + Math.log10((abs - limit) / limit + 1) * 0.75);
};
