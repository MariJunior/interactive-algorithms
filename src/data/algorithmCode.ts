// Код для каждого алгоритма — три варианта

export interface AlgorithmCode {
  jsBasic: string;
  jsModern: string;
  typescript: string;
}

export const algorithmCode: Record<string, AlgorithmCode> = {
  "bubble-sort": {
    jsBasic: `function bubbleSort(arr) {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    let swapped = false
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        const temp = a[j]
        a[j] = a[j + 1]
        a[j + 1] = temp
        swapped = true
      }
    }
    if (!swapped) break
  }
  return a
}`,

    jsModern: `function bubbleSort(arr) {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    let swapped = false
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swapped = true
      }
    }
    if (!swapped) break
  }
  return a
}`,

    typescript: `function bubbleSort<T>(
  arr: T[],
  compareFn = (a: T, b: T) => a > b
): T[] {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    let swapped = false
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (compareFn(a[j], a[j + 1])) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swapped = true
      }
    }
    if (!swapped) break
  }
  return a
}`,
  },

  "selection-sort": {
    jsBasic: `function selectionSort(arr) {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    let minIndex = i
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      const temp = a[i]
      a[i] = a[minIndex]
      a[minIndex] = temp
    }
  }
  return a
}`,

    jsModern: `function selectionSort(arr) {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    const minIndex = a
      .slice(i)
      .reduce((minIdx, val, idx) =>
        val < a[i + minIdx] ? idx : minIdx, 0) + i
    if (minIndex !== i) {
      ;[a[i], a[minIndex]] = [a[minIndex], a[i]]
    }
  }
  return a
}`,

    typescript: `function selectionSort<T>(
  arr: T[],
  compareFn = (a: T, b: T) => a < b
): T[] {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    let minIndex = i
    for (let j = i + 1; j < a.length; j++) {
      if (compareFn(a[j], a[minIndex])) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      ;[a[i], a[minIndex]] = [a[minIndex], a[i]]
    }
  }
  return a
}`,
  },

  "insertion-sort": {
    jsBasic: `function insertionSort(arr) {
  const a = [...arr]
  for (let i = 1; i < a.length; i++) {
    const current = a[i]
    let j = i - 1
    while (j >= 0 && a[j] > current) {
      a[j + 1] = a[j]
      j--
    }
    a[j + 1] = current
  }
  return a
}`,

    jsModern: `function insertionSort(arr) {
  return [...arr].reduce((sorted, current) => {
    const insertAt = sorted.findIndex(el => el > current)
    if (insertAt === -1) {
      sorted.push(current)
    } else {
      sorted.splice(insertAt, 0, current)
    }
    return sorted
  }, [])
}`,

    typescript: `function insertionSort<T>(
  arr: T[],
  compareFn = (a: T, b: T) => a > b
): T[] {
  const a = [...arr]
  for (let i = 1; i < a.length; i++) {
    const current = a[i]
    let j = i - 1
    while (j >= 0 && compareFn(a[j], current)) {
      a[j + 1] = a[j]
      j--
    }
    a[j + 1] = current
  }
  return a
}`,
  },

  "merge-sort": {
    jsBasic: `function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice()

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  return merge(left, right)
}

function merge(left, right) {
  const result = []
  let i = 0
  let j = 0

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i])
      i++
    } else {
      result.push(right[j])
      j++
    }
  }

  while (i < left.length) {
    result.push(left[i])
    i++
  }

  while (j < right.length) {
    result.push(right[j])
    j++
  }

  return result
}`,

    jsModern: `function mergeSort(arr) {
  if (arr.length <= 1) return [...arr]

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  return merge(left, right)
}

function merge(left, right) {
  const result = []
  let i = 0
  let j = 0

  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++])
  }

  return [...result, ...left.slice(i), ...right.slice(j)]
}`,

    typescript: `function mergeSort<T>(
  arr: T[],
  compareFn = (a: T, b: T) => (a <= b ? -1 : 1)
): T[] {
  if (arr.length <= 1) return [...arr]

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid), compareFn)
  const right = mergeSort(arr.slice(mid), compareFn)

  return merge(left, right, compareFn)
}

function merge<T>(
  left: T[],
  right: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  const result: T[] = []
  let i = 0
  let j = 0

  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i++])
    } else {
      result.push(right[j++])
    }
  }

  return result.concat(left.slice(i), right.slice(j))
}`,
  },

  "quick-sort": {
    jsBasic: `function quickSort(arr) {
  const a = arr.slice()
  sortRange(a, 0, a.length - 1)
  return a
}

function sortRange(a, lo, hi) {
  if (lo >= hi) return
  const pivotIndex = partition(a, lo, hi)
  sortRange(a, lo, pivotIndex - 1)
  sortRange(a, pivotIndex + 1, hi)
}

function partition(a, lo, hi) {
  const pivot = a[hi]
  let store = lo
  for (let i = lo; i < hi; i++) {
    if (a[i] < pivot) {
      const temp = a[i]
      a[i] = a[store]
      a[store] = temp
      store++
    }
  }
  const temp = a[store]
  a[store] = a[hi]
  a[hi] = temp
  return store
}`,

    jsModern: `function quickSort(arr) {
  const a = [...arr]
  const sortRange = (lo, hi) => {
    if (lo >= hi) return
    const pivot = a[hi]
    let store = lo
    for (let i = lo; i < hi; i++) {
      if (a[i] < pivot) {
        ;[a[i], a[store]] = [a[store], a[i]]
        store++
      }
    }
    ;[a[store], a[hi]] = [a[hi], a[store]]
    sortRange(lo, store - 1)
    sortRange(store + 1, hi)
  }
  sortRange(0, a.length - 1)
  return a
}`,

    typescript: `function quickSort<T>(
  arr: T[],
  compareFn = (a: T, b: T) => (a < b ? -1 : a > b ? 1 : 0)
): T[] {
  const a = [...arr]

  const partition = (lo: number, hi: number): number => {
    const pivot = a[hi]
    let store = lo
    for (let i = lo; i < hi; i++) {
      if (compareFn(a[i], pivot) < 0) {
        ;[a[i], a[store]] = [a[store], a[i]]
        store++
      }
    }
    ;[a[store], a[hi]] = [a[hi], a[store]]
    return store
  }

  const sortRange = (lo: number, hi: number) => {
    if (lo >= hi) return
    const pivotIndex = partition(lo, hi)
    sortRange(lo, pivotIndex - 1)
    sortRange(pivotIndex + 1, hi)
  }

  sortRange(0, a.length - 1)
  return a
}`,
  },

  "heap-sort": {
    jsBasic: `function heapSort(arr) {
  const a = arr.slice()
  const n = a.length

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(a, n, i)
  }

  for (let end = n - 1; end > 0; end--) {
    const temp = a[0]
    a[0] = a[end]
    a[end] = temp
    heapify(a, end, 0)
  }

  return a
}

function heapify(a, heapSize, root) {
  let largest = root
  const left = 2 * root + 1
  const right = 2 * root + 2

  if (left < heapSize && a[left] > a[largest]) largest = left
  if (right < heapSize && a[right] > a[largest]) largest = right

  if (largest !== root) {
    const temp = a[root]
    a[root] = a[largest]
    a[largest] = temp
    heapify(a, heapSize, largest)
  }
}`,

    jsModern: `function heapSort(arr) {
  const a = [...arr]
  const heapify = (heapSize, root) => {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2
    if (left < heapSize && a[left] > a[largest]) largest = left
    if (right < heapSize && a[right] > a[largest]) largest = right
    if (largest !== root) {
      ;[a[root], a[largest]] = [a[largest], a[root]]
      heapify(heapSize, largest)
    }
  }

  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) heapify(a.length, i)
  for (let end = a.length - 1; end > 0; end--) {
    ;[a[0], a[end]] = [a[end], a[0]]
    heapify(end, 0)
  }
  return a
}`,

    typescript: `function heapSort<T>(
  arr: T[],
  compareFn = (a: T, b: T) => (a < b ? -1 : a > b ? 1 : 0)
): T[] {
  const a = [...arr]

  const heapify = (heapSize: number, root: number) => {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2
    if (left < heapSize && compareFn(a[left], a[largest]) > 0) largest = left
    if (right < heapSize && compareFn(a[right], a[largest]) > 0) largest = right
    if (largest !== root) {
      ;[a[root], a[largest]] = [a[largest], a[root]]
      heapify(heapSize, largest)
    }
  }

  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) heapify(a.length, i)
  for (let end = a.length - 1; end > 0; end--) {
    ;[a[0], a[end]] = [a[end], a[0]]
    heapify(end, 0)
  }
  return a
}`,
  },

  "radix-sort": {
    jsBasic: `function radixSort(arr) {
  if (arr.length <= 1) return arr.slice()
  const a = arr.slice()
  const max = Math.max.apply(null, a)

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(a, exp)
  }
  return a
}

function countingSortByDigit(a, exp) {
  const n = a.length
  const output = new Array(n)
  const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(a[i] / exp) % 10
    counts[digit]++
  }
  for (let i = 1; i < 10; i++) counts[i] += counts[i - 1]
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(a[i] / exp) % 10
    counts[digit]--
    output[counts[digit]] = a[i]
  }
  for (let i = 0; i < n; i++) a[i] = output[i]
}`,

    jsModern: `function radixSort(arr) {
  if (arr.length <= 1) return [...arr]
  const a = [...arr]
  const max = Math.max(...a)

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const counts = Array(10).fill(0)
    for (const value of a) counts[Math.floor(value / exp) % 10]++
    for (let i = 1; i < 10; i++) counts[i] += counts[i - 1]
    const output = Array(a.length)
    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10
      output[--counts[digit]] = a[i]
    }
    output.forEach((value, index) => { a[index] = value })
  }
  return a
}`,

    typescript: `function radixSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr]
  if (arr.some((v) => v < 0 || !Number.isInteger(v))) {
    throw new Error("Only non-negative integers")
  }

  const a = [...arr]
  const max = Math.max(...a)

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const counts = new Array<number>(10).fill(0)
    for (const value of a) counts[Math.floor(value / exp) % 10]++
    for (let i = 1; i < 10; i++) counts[i] += counts[i - 1]
    const output = new Array<number>(a.length)
    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10
      output[--counts[digit]] = a[i]
    }
    a.splice(0, a.length, ...output)
  }
  return a
}`,
  },

  "counting-sort": {
    jsBasic: `function countingSort(arr) {
  if (arr.length <= 1) return arr.slice()
  let min = arr[0]
  let max = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i]
    if (arr[i] > max) max = arr[i]
  }

  const counts = []
  for (let i = 0; i < max - min + 1; i++) counts[i] = 0
  for (let i = 0; i < arr.length; i++) counts[arr[i] - min]++
  for (let i = 1; i < counts.length; i++) counts[i] += counts[i - 1]

  const result = new Array(arr.length)
  for (let i = arr.length - 1; i >= 0; i--) {
    const value = arr[i]
    counts[value - min]--
    result[counts[value - min]] = value
  }
  return result
}`,

    jsModern: `function countingSort(arr) {
  if (arr.length <= 1) return [...arr]
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const counts = Array(max - min + 1).fill(0)
  for (const value of arr) counts[value - min]++
  for (let i = 1; i < counts.length; i++) counts[i] += counts[i - 1]
  const result = Array(arr.length)
  for (let i = arr.length - 1; i >= 0; i--) {
    result[--counts[arr[i] - min]] = arr[i]
  }
  return result
}`,

    typescript: `function countingSort(arr: number[]): number[] {
  if (arr.length <= 1) return [...arr]
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const counts = new Array<number>(max - min + 1).fill(0)
  for (const value of arr) counts[value - min]++
  for (let i = 1; i < counts.length; i++) counts[i] += counts[i - 1]
  const result = new Array<number>(arr.length)
  for (let i = arr.length - 1; i >= 0; i--) {
    result[--counts[arr[i] - min]] = arr[i]
  }
  return result
}`,
  },

  "linear-search": {
    jsBasic: `function linearSearch(arr, target) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i
    }
  }
  return -1
}`,

    jsModern: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i
  }
  return -1
}`,

    typescript: `function linearSearch<T>(
  arr: readonly T[],
  target: T
): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i
  }
  return -1
}`,
  },

  "binary-search": {
    jsBasic: `function binarySearch(arr, target) {
  var low = 0
  var high = arr.length - 1

  while (low <= high) {
    var mid = Math.floor((low + high) / 2)
    if (arr[mid] === target) return mid
    if (arr[mid] < target) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return -1
}`,

    jsModern: `function binarySearch(arr, target) {
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (arr[mid] === target) return mid
    arr[mid] < target ? (low = mid + 1) : (high = mid - 1)
  }
  return -1
}`,

    typescript: `function binarySearch(
  arr: readonly number[],
  target: number
): number {
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (arr[mid] === target) return mid
    if (arr[mid] < target) low = mid + 1
    else high = mid - 1
  }
  return -1
}`,
  },

  bfs: {
    jsBasic: `function bfs(adj, start) {
  var visited = {}
  var queue = [start]
  var order = []
  visited[start] = true

  while (queue.length > 0) {
    var current = queue.shift()
    order.push(current)
    var neighbors = adj[current] || []
    for (var i = 0; i < neighbors.length; i++) {
      var next = neighbors[i]
      if (!visited[next]) {
        visited[next] = true
        queue.push(next)
      }
    }
  }
  return order
}`,

    jsModern: `function bfs(adj, start) {
  const visited = new Set([start])
  const queue = [start]
  const order = []

  while (queue.length > 0) {
    const current = queue.shift()
    order.push(current)
    for (const next of adj[current] ?? []) {
      if (!visited.has(next)) {
        visited.add(next)
        queue.push(next)
      }
    }
  }
  return order
}`,

    typescript: `function bfs(
  adj: ReadonlyMap<string, readonly string[]>,
  start: string
): string[] {
  const visited = new Set<string>([start])
  const queue: string[] = [start]
  const order: string[] = []

  while (queue.length > 0) {
    const current = queue.shift()!
    order.push(current)
    for (const next of adj.get(current) ?? []) {
      if (!visited.has(next)) {
        visited.add(next)
        queue.push(next)
      }
    }
  }
  return order
}`,
  },

  dfs: {
    jsBasic: `function dfs(adj, start) {
  var visited = {}
  var stack = [start]
  var order = []

  while (stack.length > 0) {
    var current = stack.pop()
    if (visited[current]) continue
    visited[current] = true
    order.push(current)
    var neighbors = (adj[current] || []).slice().reverse()
    for (var i = 0; i < neighbors.length; i++) {
      if (!visited[neighbors[i]]) stack.push(neighbors[i])
    }
  }
  return order
}`,

    jsModern: `function dfs(adj, start) {
  const visited = new Set()
  const stack = [start]
  const order = []

  while (stack.length > 0) {
    const current = stack.pop()
    if (visited.has(current)) continue
    visited.add(current)
    order.push(current)
    for (const next of [...(adj[current] ?? [])].reverse()) {
      if (!visited.has(next)) stack.push(next)
    }
  }
  return order
}`,

    typescript: `function dfs(
  adj: ReadonlyMap<string, readonly string[]>,
  start: string
): string[] {
  const visited = new Set<string>()
  const stack: string[] = [start]
  const order: string[] = []

  while (stack.length > 0) {
    const current = stack.pop()!
    if (visited.has(current)) continue
    visited.add(current)
    order.push(current)
    for (const next of [...(adj.get(current) ?? [])].reverse()) {
      if (!visited.has(next)) stack.push(next)
    }
  }
  return order
}`,
  },

  "preorder-traversal": {
    jsBasic: `function preorder(node, order) {
  if (!node) return order
  order.push(node.value)
  preorder(node.left, order)
  preorder(node.right, order)
  return order
}`,

    jsModern: `function preorder(node, order = []) {
  if (!node) return order
  order.push(node.value)
  preorder(node.left, order)
  preorder(node.right, order)
  return order
}`,

    typescript: `interface BinNode {
  value: number
  left?: BinNode
  right?: BinNode
}

function preorder(node: BinNode | undefined, order: number[] = []): number[] {
  if (!node) return order
  order.push(node.value)
  preorder(node.left, order)
  preorder(node.right, order)
  return order
}`,
  },

  "inorder-traversal": {
    jsBasic: `function inorder(node, order) {
  if (!node) return order
  inorder(node.left, order)
  order.push(node.value)
  inorder(node.right, order)
  return order
}`,

    jsModern: `function inorder(node, order = []) {
  if (!node) return order
  inorder(node.left, order)
  order.push(node.value)
  inorder(node.right, order)
  return order
}`,

    typescript: `interface BinNode {
  value: number
  left?: BinNode
  right?: BinNode
}

function inorder(node: BinNode | undefined, order: number[] = []): number[] {
  if (!node) return order
  inorder(node.left, order)
  order.push(node.value)
  inorder(node.right, order)
  return order
}`,
  },

  "postorder-traversal": {
    jsBasic: `function postorder(node, order) {
  if (!node) return order
  postorder(node.left, order)
  postorder(node.right, order)
  order.push(node.value)
  return order
}`,

    jsModern: `function postorder(node, order = []) {
  if (!node) return order
  postorder(node.left, order)
  postorder(node.right, order)
  order.push(node.value)
  return order
}`,

    typescript: `interface BinNode {
  value: number
  left?: BinNode
  right?: BinNode
}

function postorder(node: BinNode | undefined, order: number[] = []): number[] {
  if (!node) return order
  postorder(node.left, order)
  postorder(node.right, order)
  order.push(node.value)
  return order
}`,
  },

  fibonacci: {
    jsBasic: `function fibonacci(n) {
  if (n <= 1) return n
  var dp = []
  dp[0] = 0
  dp[1] = 1
  for (var i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}`,

    jsModern: `function fibonacci(n) {
  if (n <= 1) return n
  const dp = [0, 1]
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}`,

    typescript: `function fibonacci(n: number): number {
  if (n <= 1) return n
  const dp: number[] = [0, 1]
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!
  }
  return dp[n]!
}`,
  },

  "climbing-stairs": {
    jsBasic: `function climbingStairs(n) {
  if (n <= 2) return n
  var dp = []
  dp[1] = 1
  dp[2] = 2
  for (var i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}`,

    jsModern: `function climbingStairs(n) {
  if (n <= 2) return n
  const dp = [0, 1, 2]
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}`,

    typescript: `function climbingStairs(n: number): number {
  if (n <= 2) return n
  const dp: number[] = [0, 1, 2]
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!
  }
  return dp[n]!
}`,
  },

  "naive-string-search": {
    jsBasic: `function naiveSearch(text, pattern) {
  var found = []
  for (var i = 0; i <= text.length - pattern.length; i++) {
    var j = 0
    while (j < pattern.length && text[i + j] === pattern[j]) j++
    if (j === pattern.length) found.push(i)
  }
  return found
}`,

    jsModern: `function naiveSearch(text, pattern) {
  const found = []
  for (let i = 0; i <= text.length - pattern.length; i++) {
    let j = 0
    while (j < pattern.length && text[i + j] === pattern[j]) j++
    if (j === pattern.length) found.push(i)
  }
  return found
}`,

    typescript: `function naiveSearch(text: string, pattern: string): number[] {
  const found: number[] = []
  for (let i = 0; i <= text.length - pattern.length; i++) {
    let j = 0
    while (j < pattern.length && text[i + j] === pattern[j]) j++
    if (j === pattern.length) found.push(i)
  }
  return found
}`,
  },

  "kmp-search": {
    jsBasic: `function buildLps(pattern) {
  var lps = []
  for (var k = 0; k < pattern.length; k++) lps[k] = 0
  var len = 0
  var i = 1
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++
      lps[i] = len
      i++
    } else if (len > 0) {
      len = lps[len - 1]
    } else {
      lps[i] = 0
      i++
    }
  }
  return lps
}

function kmpSearch(text, pattern) {
  var found = []
  var lps = buildLps(pattern)
  var i = 0
  var j = 0
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++
      j++
      if (j === pattern.length) {
        found.push(i - j)
        j = lps[j - 1]
      }
    } else if (j > 0) {
      j = lps[j - 1]
    } else {
      i++
    }
  }
  return found
}`,

    jsModern: `function buildLps(pattern) {
  const lps = Array(pattern.length).fill(0)
  let len = 0
  let i = 1
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len
    } else if (len > 0) {
      len = lps[len - 1]
    } else {
      lps[i++] = 0
    }
  }
  return lps
}

function kmpSearch(text, pattern) {
  const found = []
  const lps = buildLps(pattern)
  let i = 0
  let j = 0
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++
      j++
      if (j === pattern.length) {
        found.push(i - j)
        j = lps[j - 1]
      }
    } else if (j > 0) {
      j = lps[j - 1]
    } else {
      i++
    }
  }
  return found
}`,

    typescript: `function buildLps(pattern: string): number[] {
  const lps = Array.from({ length: pattern.length }, () => 0)
  let len = 0
  let i = 1
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len
    } else if (len > 0) {
      len = lps[len - 1]!
    } else {
      lps[i++] = 0
    }
  }
  return lps
}

function kmpSearch(text: string, pattern: string): number[] {
  const found: number[] = []
  if (!pattern) return found
  const lps = buildLps(pattern)
  let i = 0
  let j = 0
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++
      j++
      if (j === pattern.length) {
        found.push(i - j)
        j = lps[j - 1]!
      }
    } else if (j > 0) {
      j = lps[j - 1]!
    } else {
      i++
    }
  }
  return found
}`,
  },
};
