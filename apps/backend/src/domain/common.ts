export type Uuid = string;
/**
 * ISO 8601 Timestamp in a string format.
 * E.g. 2022-11-26T08:00:00.000Z
 */
export type Iso8601Timestamp = string;

export const getCurrentTimestamp = (): Iso8601Timestamp => new Date().toISOString();
