function isPalindrome(x) {
  const reverse = x.toString().split("").reverse().join("");
  console.log(reverse);
  console.log(x.toString());
  return x.toString() === reverse;
}

// console.log(isPalindrome(121));

function romanToInt(s) {
  const symbols = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const x = s.split("");
  let totalSum = 0;
  for (i = 0; i < x.length; i++) {
    // console.log(symbol, index);
    let increment = symbols[x[i]];
    if (x[i] === "I" && x[i + 1] === "V") {
      increment = 4;
      i++;
    } else if (x[i] === "I" && x[i + 1] === "X") {
      increment = 9;
      i++;
    } else if (x[i] === "X" && x[i + 1] === "L") {
      increment = 40;
      i++;
    } else if (x[i] === "X" && x[i + 1] === "C") {
      increment = 90;
      i++;
    } else if (x[i] === "C" && x[i + 1] === "D") {
      increment = 400;
      i++;
    } else if (x[i] === "C" && x[i + 1] === "M") {
      increment = 900;
      i++;
    }
    totalSum += increment;
  }
  return totalSum;
}

console.log(romanToInt("MCMXCIV"));
