export const useLocalStorage = (key, initialData = []) => {
  const get = () => {
    const data = JSON.parse(localStorage.getItem(key));
    if (!data) {
      set(initialData);
      return initialData;
    }
    return data;
  };
  const set = (data) => localStorage.setItem(key, JSON.stringify(data));
  return { get, set };
};
