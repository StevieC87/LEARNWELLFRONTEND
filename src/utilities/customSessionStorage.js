// store/customStorage.js

const isBrowser = typeof window !== "undefined";

const customSessionStorage = {
  getItem: (key) => {
    if (isBrowser) {
      return sessionStorage.getItem(key);
    } else {
      // Return null
      return null;
    }
  },
  setItem: (key, value) => {
    if (isBrowser) {
      sessionStorage.setItem(key, value);
    }
    // Return a resolved Promise even if we do nothing
    return Promise.resolve();
  },
  removeItem: (key) => {
    if (isBrowser) {
      sessionStorage.removeItem(key);
    }
    // Return a resolved Promise even if we do nothing
    return Promise.resolve();
  },
};

export default customSessionStorage;
