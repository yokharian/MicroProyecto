/**
 * Constant vars of the application
 *  - Tokens, ports, API URL's, etc.
 */

export const __PRODUCTION__ = process.env.PRODUCTION_MODE ?? false;
export const __PORT__: number = parseInt(process.env.SERVER_PORT ?? "3000");
