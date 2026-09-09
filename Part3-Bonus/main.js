var findKthPositive = function (arr, k) {
  let missing = 0;
  let current = 1;
  let index = 0;

  while (missing < k) {
    if (index < arr.length && arr[index] === current) {
      index++;
    } else {
      missing++;
    }

    if (missing === k) {
      return current;
    }

    current++;
  }
};

// Test
const arr = [2, 3, 4, 7, 11];
const k = 5;

console.log(findKthPositive(arr, k)); // 9
