function findFirstOdd(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    const arrayNumbers = numbers[i];
    if (arrayNumbers % 2 !== 0) {
      return numbers[i];
    }
  }
}

console.log(findFirstOdd([1, 4, 3]));
