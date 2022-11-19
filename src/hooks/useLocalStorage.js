export function useLocalStorage(key, initialData = []) {
  function get() {
    const data = JSON.parse(localStorage.getItem(key));
    if (!data) {
      set(initialData);
      return initialData;
    }
    return data;
  }

  function set(data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  return { get, set };
}
