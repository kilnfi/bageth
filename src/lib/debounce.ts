export default () => {
  let timeout: NodeJS.Timeout;
  return (callback: () => void | Promise<void>, time = 250) => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, time);
  };
};
