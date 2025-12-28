const mirror = (array) => {
  const obj = {};
  array.forEach(e => obj[e] = e);
  return obj;
};

export const PayloadSources = mirror([
  'SERVER_ACTION',
  'VIEW_ACTION'
]);
