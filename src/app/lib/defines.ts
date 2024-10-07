export const signals = ["smashday", "insideday", "swingplay"] as const;
export type SignalType = typeof signals[number];

export const ipAddress = false ? "192.168.0.120:3000" : "localhost:3000";