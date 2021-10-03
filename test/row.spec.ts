import { row, makeMatrix } from "../src"

export const tests = [["row: 1, [[2, 1], [2, 1]]", () => row(1, makeMatrix(2, 2, [2, 1, 2, 1]))]]
