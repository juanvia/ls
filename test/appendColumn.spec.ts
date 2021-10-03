import { appendColumn, makeColumnVector, makeMatrix } from "../src"

export const tests = [
  [
    "appendColumn: [[2, 1], [2, 1]], [3, 3]",
    () => appendColumn(makeMatrix(2, 2, [2, 1, 2, 1]), makeColumnVector(2, [3, 3])),
  ],
]
