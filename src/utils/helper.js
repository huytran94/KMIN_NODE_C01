const printDataTabular = (data = []) => {
  console.table(data);
};

const findItemById = (data = [], id) =>
  data.findIndex((item) => item.id === id);

const isIdNotExist = (data = [], id) => {
  if (data.length === 0) return true;
  return findItemById(data, id) === -1;
};

const isNumber = (str) => {
  if (str.trim() === "" || str === null || str === undefined) return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const countMatch = (currentItem, criteria) => {
  return criteria.filter((item) => new RegExp(item, "i").test(currentItem))
    .length;
};

const getPostTxtContent = () => {
  
}

export { printDataTabular, isIdNotExist, isNumber, findItemById, countMatch };
