import { column, makeMatrix } from "../src"

export const tests = [
  ["column: 1, [[2, 1], [2, 1]]", () => column(1, makeMatrix(2, 2, [2, 1, 2, 1]))],
  ["column: 0, [[2, 1], [2, 1]]", () => column(0, makeMatrix(2, 2, [2, 1, 2, 1]))],
]
