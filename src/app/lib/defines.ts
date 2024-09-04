export const signals = ["smashday", "insideday", "swingplay"] as const;

export type SignalType = typeof signals[number];