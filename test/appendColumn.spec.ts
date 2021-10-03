import { appendColumn, makeColumnVector, makeMatrix } from "../src"

export const tests = [
  [
    "appendColumn: [[2, 1], [2, 1]], [3, 3]",
    () => appendColumn(makeMatrix(2, 2, [2, 1, 2, 1]), makeColumnVector(2, [3, 3])),
  ],
  [
    "appendColumn: [], [3, 3]",
    () => appendColumn(makeMatrix(0, 0, []), makeColumnVector(2, [3, 3])),
  ],
  [
    "appendColumn: [[2], [1], [2]], [3, 3]",
    () => {
      try {
        appendColumn(makeMatrix(3, 1, [2, 1, 2]), makeColumnVector(2, [3, 3]))
      } catch (e) {
        return (e as Error).message
      }
    },
  ],
]
