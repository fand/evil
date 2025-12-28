const mirror = (array) => {
  const obj = {};
  array.forEach(e => obj[e] = e);
  return obj;
};

export default mirror;
