var mergeTwoLists = function (list1, list2) {
  let mergedList = list1;
  mergedList = list1.concat(list2);
  mergedList.sort((a, b) => a - b);

  return mergedList;
};
const list1 = [];
const list2 = [];

console.log(mergeTwoLists(list1, list2));
