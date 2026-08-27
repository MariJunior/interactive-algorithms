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
    jsBasic: "// Скоро будет",
    jsModern: "// Скоро будет",
    typescript: "// Скоро будет",
  },

  "heap-sort": {
    jsBasic: "// Скоро будет",
    jsModern: "// Скоро будет",
    typescript: "// Скоро будет",
  },

  "radix-sort": {
    jsBasic: "// Скоро будет",
    jsModern: "// Скоро будет",
    typescript: "// Скоро будет",
  },

  "counting-sort": {
    jsBasic: "// Скоро будет",
    jsModern: "// Скоро будет",
    typescript: "// Скоро будет",
  },

  "linear-search": {
    jsBasic: "// Скоро будет",
    jsModern: "// Скоро будет",
    typescript: "// Скоро будет",
  },

  "binary-search": {
    jsBasic: "// Скоро будет",
    jsModern: "// Скоро будет",
    typescript: "// Скоро будет",
  },
};
