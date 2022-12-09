export const generateId = () =>
  Date.now().toString() + Math.floor(Math.random() * 10000).toString();
