export const signals = ["smashday", "insideday", "swingplay"] as const;
export type SignalType = typeof signals[number];

export const ipAddress = "192.168.0.113:3000";