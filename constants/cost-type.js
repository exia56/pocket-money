const typeMapInt = {
  "Breakfast": 1,
  "Lunch": 2,
  "Dinner": 3,
  "Groceries": 4,
  "Motor": 5,
  "Out": 6,
  "Supper": 7,
  "Other": 8,
};
let intMapType = {};
Object.keys(typeMapInt).forEach(v => {
  intMapType[typeMapInt[v]] = v;
});

module.exports = {
  typeMapInt,
  intMapType,
  genReverseMap: function (costTypes) {
    const reverseMap = {};
    Object.entries(costTypes)
      .forEach(([key, value]) => {
        reverseMap[value] = key;
      });

    return reverseMap;
  }
}