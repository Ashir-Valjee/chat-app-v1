function solution(input) {
  let longestPalindrome = "";
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j <= input.length; j++) {
      const subString = input.slice(i, j);
      if (
        subString === subString.split("").reverse().join("") &&
        subString.length > longestPalindrome.length
      ) {
        longestPalindrome = subString;
      }
    }
  }
  return longestPalindrome;
}

console.log(solution("bob has a tom"));
