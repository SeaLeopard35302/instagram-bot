function sleep(milliseconds) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + milliseconds) {
    end = new Date().getTime();
  }
}

module.exports = sleep