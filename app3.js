function solution(first, second) {
  const words1 = first.match(/[a-zA-Z]+/g) || [];
  const words2 = second.match(/[a-zA-Z]+/g) || [];

  const wordsSet1 = new Set(words1);
  const wordsSet2 = new Set(words2);

  let commonWordCount = 0;

  for (const word of wordsSet1) {
    if (wordsSet2.has(word)) {
      commonWordCount += 1;
    }
  }
  return commonWordCount;
}

console.log(solution("hello hello you", "you hello hello? haaa"));
