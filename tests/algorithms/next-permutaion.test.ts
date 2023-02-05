function nextPermutation(nums: number[]): number[] {
  let i, j;
  if (nums.length <= 1) {
    return nums;
  }

  for (i = nums.length - 2; i >= 0; i--) {
    if (nums[i] < nums[i + 1]) {
      break;
    }
  }

  if (i < 0) {
    return nums.reverse();
  }
  for (j = nums.length - 1; j > i; j--) {
    if (nums[j] > nums[i]) {
      break;
    }
  }
  //swap
  const tmp = nums[i];
  nums[i] = nums[j];
  nums[j] = tmp;

  // reverse
  const arr2 = nums.slice(i + 1).reverse();
  nums.length = nums.length - arr2.length;
  nums.push(...arr2);
  return nums;
}

describe('Simple Test', () => {
  it('test that  works', async () => {
    expect(nextPermutation([3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('test that  works 2', async () => {
    expect(nextPermutation([1, 3, 2])).toEqual([2, 1, 3]);
  });

  it('test that  works 3', async () => {
    expect(nextPermutation([1, 1])).toEqual([1, 1]);
  });

  it('test that  works 4', async () => {
    expect(nextPermutation([1, 3, 2])).toEqual([2, 1, 3]);
  });

});
