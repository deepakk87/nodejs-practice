class MyPriorityQueue<T> {
  arr: T[];
  compFun: (a: T, b: T) => boolean;
  constructor(compFun = (a, b) => a < b) {
    this.arr = [];
    this.compFun = compFun;
  }

  top() {
    return this.arr[0];
  }

  pop() {
    const heapifyDown = (index: number) => {
      if (index >= this.arr.length) {
        return;
      }
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (left >= this.arr.length) {
        return;
      }
      let indexToUse = left;
      if (
        right < this.arr.length &&
        !this.compFun(this.arr[left], this.arr[right])
      ) {
        indexToUse = right;
      }
      if (!this.compFun(this.arr[index], this.arr[indexToUse])) {
        //swap
        const tmp = this.arr[index];
        this.arr[index] = this.arr[indexToUse];
        this.arr[indexToUse] = tmp;
        //Recursively swap
        heapifyDown(indexToUse);
      }
    };
    if (this.arr.length <= 1) {
      return this.arr.pop();
    }
    const val = this.arr[0];
    this.arr[0] = this.arr.pop();
    heapifyDown(0);
    return val;
  }

  enqueue(val: T) {
    this.arr.push(val);
    const heapifyUp = (index: number) => {
      if (index <= 0) {
        return;
      }

      const parent = Math.floor((index + 1) / 2) - 1;
      if (this.compFun(this.arr[index], this.arr[parent])) {
        //swap
        const tmp = this.arr[index];
        this.arr[index] = this.arr[parent];
        this.arr[parent] = tmp;
        //Recursively swap
        heapifyUp(parent);
      }
    };
    heapifyUp(this.arr.length - 1);
  }

  empty() {
    return this.arr.length == 0;
  }
}

class ListNode {
  val: number;
  next: ListNode;
  constructor(num = 0, next = null) {
    this.val = num;
    this.next = next;
  }
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const qq = new MyPriorityQueue<ListNode>((a, b) => a.val < b.val);

  for (const node of lists) {
    // console.log(node.val);
    qq.enqueue(node);
  }
  const HEAD = new ListNode();
  let current = HEAD;

  while (!qq.empty()) {
    const tmp = qq.pop();
    console.log(tmp.val);
    if (tmp.next) {
      qq.enqueue(tmp.next);
    }
    current.next = tmp;
    current = current.next;
  }

  return HEAD.next;
}

describe('Simple Priority Queue', () => {
  it('test that priority queue works base cases', async () => {
    const pq = new MyPriorityQueue<number>();
    expect(pq.pop()).toBeUndefined();
    expect(pq.top()).toBeUndefined();
    pq.enqueue(5);
    expect(pq.top()).toBe(5);
  });

  it('test that priority queue works with data', async () => {
    const pq = new MyPriorityQueue<number>();
    pq.enqueue(7);
    pq.enqueue(18);
    pq.enqueue(8);
    pq.enqueue(25);
    pq.enqueue(15);
    pq.enqueue(5);
    expect(pq.top()).toBe(5);
    expect(pq.pop()).toBe(5);
    expect(pq.pop()).toBe(7);
    expect(pq.pop()).toBe(8);
    expect(pq.pop()).toBe(15);
    expect(pq.pop()).toBe(18);
    expect(pq.pop()).toBe(25);
  });

  it('test that priority queue works base cases', async () => {
    const l1 = new ListNode(5);
    const l2 = new ListNode(4, l1);
    const l3 = new ListNode(1, l2);

    const l4 = new ListNode(4);
    const l5 = new ListNode(3, l4);
    const l6 = new ListNode(1, l5);

    const l7 = new ListNode(6);
    const l8 = new ListNode(2, l7);

    mergeKLists([l3, l6, l8]);
  });
});
