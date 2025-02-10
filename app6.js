function longestCommonPrefix(strs) {
  const arrayLength = strs.length;
  let minWordLength = strs[0].length;
  for (let i = 1; i < arrayLength; i++) {
    if (strs[i].length < minWordLength) {
      minWordLength = strs[i].length;
    }
  }

  let commonPrefix = "";
  for (let i = 0; i < minWordLength; i++) {
    const currentChar = strs[0][i];
    for (let j = 1; j < arrayLength; j++) {
      if (strs[j][i] !== currentChar) {
        return commonPrefix;
      }
    }
    commonPrefix += currentChar;
  }
  return commonPrefix;
}

console.log(longestCommonPrefix2(["flower", "flow", "flight"]));
console.log("flower".indexOf("l"));

function longestCommonPrefix2(strs) {
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, prefix.length - 1);
    }
  }
  return prefix;
}
