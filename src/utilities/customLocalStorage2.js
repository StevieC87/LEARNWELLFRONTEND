const isBrowser = typeof window !== "undefined";
const customLocalStorage = {
  getItem: (key) => {
    if (isBrowser) {
      return localStorage.getItem(key);
    } else {
      return null;
    }
  },
  setItem: (key, value) => {
    if (isBrowser) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (isBrowser) {
      localStorage.removeItem(key);
    }
  },
};

export default customLocalStorage;
