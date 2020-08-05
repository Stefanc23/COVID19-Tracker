export const casesTypeColors = {
  cases: {
    hex: "#cc1034",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd77d",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#6c757d",
    half_op: "rgba(108, 117, 125, 0.5)",
    multiplier: 2000,
  },
};

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
