// The same limits as backend/Sections/Users/UserControllers/passwordPolicy.js,
// which is the one that decides. These only save a round trip.
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;
export const PASSWORD_LENGTH_MESSAGE = `Use between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters`;
