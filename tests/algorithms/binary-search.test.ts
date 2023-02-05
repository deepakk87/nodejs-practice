function binarySearch(
  nums: number[],
  start: number,
  end: number,
  target: number,
) {
  if (end - start <= 0) return -1;

  const mid = Math.floor((start + end) / 2);

  console.log(mid);

  if (nums[mid] == target) return mid;
  // left sorted
  if (nums[start] <= nums[mid]) {
    if (target > nums[mid] || target < nums[start]) {
      return binarySearch(nums, mid + 1, end, target);
    } else {
      return binarySearch(nums, start, mid, target);
    }
  } else {
    // right sorted
    if (target < nums[mid] || target > nums[end - 1]) {
      return binarySearch(nums, start, mid, target);
    } else {
      return binarySearch(nums, mid + 1, end, target);
    }
  }
}

function search(nums: number[], target: number): number {
  return binarySearch(nums, 0, nums.length, target);
}

function lowerBound(arr: number[], target: number) {
  let low = 0;
  let high = arr.length;
  let index = -1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] == target) {
      index = mid;
    }
    console.log(`${low}, ${high}, ${mid}`);
    if (target <= arr[mid]) {
      // target >= arr
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return index;
}

function upperBound(arr: number[], target: number) {
  let low = 0;
  let high = arr.length;
  let index = -1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] == target) {
      index = mid;
    }
    console.log(`${low}, ${high}, ${mid}`);
    if (target >= arr[mid]) {
      // target >= arr
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return index;
}

function searchInsert(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length;
  let index = low;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    console.log(`${low}, ${high}, ${mid}`);
    index = low;
    if (target <= nums[mid]) {
      // target >= arr
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return index;
}

describe('Simple binary search on Rotated Array Test', () => {
  it('test that  works', async () => {
    expect(search([3, 1], 3)).toBe(0);
  });

  it('test that  works 2', async () => {
    expect(search([4, 5, 6, 7, 0, 1, 2], 0)).toBe(4);
  });

  it('test that lowerbound/upperbound works 1', async () => {
    expect(lowerBound([1, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4], 3)).toBe(1);
    expect(upperBound([1, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4], 3)).toBe(6);
  });

  it('test that lowerBound/upperbound works 2', async () => {
    expect(lowerBound([1, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4], 2)).toBe(-1);
    expect(upperBound([1, 1, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4], 2)).toBe(-1);
  });

  it('test that lowerBound/upperbound works 3', async () => {
    expect(upperBound([5, 7, 7, 8, 8, 10], 8)).toBe(4);
    expect(lowerBound([5, 7, 7, 8, 8, 10], 8)).toBe(3);
  });

  it('test that search insert works', async () => {
    expect(searchInsert([1, 3, 5, 6], 7)).toBe(4);
  });
});
