const stringFormat = (str, data) =>
  str.replace(/{(\w+)}/g, (match, p1) => data[p1] || match);

module.exports = {
  stringFormat,
};
