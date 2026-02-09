export const uid = (): string => {
  const c = globalThis.crypto as Crypto & {
    randomUUID?: () => string;
    getRandomValues?: (array: Uint8Array) => Uint8Array;
  };

  if (c?.randomUUID) return c.randomUUID();

  if (c?.getRandomValues) {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
      "",
    );
    return `${Date.now().toString(16)}-${hex}`;
  }

  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
};
