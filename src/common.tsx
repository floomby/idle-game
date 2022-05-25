type ModifiersKeys = "shift" | "alt" | "ctrl";
type Modifiers = Record<ModifiersKeys, boolean>;

const multiplierFromModifiers = (modifiers: Modifiers) => {
  let ret = 1;
  if (modifiers.shift) ret *= 10;
  if (modifiers.ctrl) ret *= 100;
  if (modifiers.alt) ret *= 10000;
  return ret;
};

const boxMuller = (mean: number, stdDev: number): number => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return boxMuller(mean, stdDev); // resample between 0 and 1 if out of range
  num = mean + stdDev * (num * 2 - 1); // Change to Gaussian
  return num;
};

export type { ModifiersKeys, Modifiers };
export { multiplierFromModifiers, boxMuller as random };
