// Simple binary search
// https://leetcode.com/problems/binary-search
// https://leetcode.com/problems/search-insert-position/
// https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
function lowerBound(arr: number[], target: number) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    console.log(`low = ${low}, high = ${high}, mid = ${mid}`);
    if (arr[mid] < target) {
      // target >= arr
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

function upperBound(arr: number[], target: number) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    // console.log(`${low}, ${high}, ${mid}`);
    if (!(target < arr[mid])) {
      // target >= arr
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return high;
}

function searchRange(nums: number[], target: number): number[] {
  let low = lowerBound(nums, target);
  let up = upperBound(nums, target);

  low = nums[low] == target ? low : -1;
  up = nums[up - 1] == target ? up - 1 : -1;
  return [low, up];
}

function search(nums: number[], target: number): number {
  const index = lowerBound(nums, target);
  return nums[index] == target ? index : -1;
}

describe('Simple Test', () => {
  it('test that  works', async () => {
    expect(search([2, 5], 5)).toBe(1);
  });

  it('test that  works 2', async () => {
    expect(searchRange([5, 7, 7, 8, 8, 10], 8)).toEqual([3, 4]);
  });
});
