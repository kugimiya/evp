export const isPointOnLine = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, thickness: number): boolean => {
  const a = y2 - y1;
  const b = -(x2 - x1);
  const c = a * x1 + b * y1;
  const distance = Math.abs(a * x3 + b * y3 - c) / Math.sqrt(a * a + b * b);

  return distance <= thickness;
};
