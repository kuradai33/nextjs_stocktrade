export const signals = ["smashday", "insideday", "swingplay"] as const;
export type SignalType = typeof signals[number];

export const ipAddress = true ? "192.168.0.112:3000" : "localhost:3000";