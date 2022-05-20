type ModifiersKeys = "shift" | "alt" | "ctrl";
type Modifiers = Record<ModifiersKeys, boolean>;

const multiplierFromModifiers = (modifiers: Modifiers) => {
  let ret = 1;
  if (modifiers.shift) ret *= 10;
  if (modifiers.alt) ret *= 100;
  if (modifiers.ctrl) ret *= 10000;
  return ret;
};

export type { ModifiersKeys, Modifiers };
export { multiplierFromModifiers };