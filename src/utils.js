export const sortData = (data, type = "cases") => {
  let sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a[type] > b[type]) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};
