import { Matrix } from "./types"
const js = JSON.stringify

/**
 * Creates and return a new Matrix
 * If not data is given the property "data" contains an empty array of size rows*cols
 * If data is given must be an array of numbers of size equal to the product of rows
 * and cols _on row basis_
 *
 * @param  {number} rows Number of rows of the matrix
 * @param  {number} cols Number of columns of the matrix
 * @param  {number[]} data _(Optional)_ An array of numbers of size=rows*cols
 * @returns {Matrix} The generated Matrix
 *
 * @throws {Error} if data.length != rows*column
 */
export const makeMatrix = (rows: number, cols: number, data?: number[]): Matrix => {
  if (data && data.length !== rows * cols) {
    throw new Error(`The matrix must have ${rows * cols} data elements (${rows} times ${cols})`)
  }
  return {
    rows,
    cols,
    data: data ? data : new Array<number>(rows * cols),
  }
}
/**
 * @param  {number} size
 * @param  {number[]} data?
 * @returns A {rows:1,cols:size} Matrix
 */
export const makeRowVector = (size: number, data?: number[]): Matrix => makeMatrix(1, size, data)

/**
 * @param  {number} size
 * @param  {number[]} data?
 * @returns A {rows:size,cols:1} Matrix
 */
export const makeColumnVector = (size: number, data?: number[]): Matrix => makeMatrix(size, 1, data)

export const makeVector = makeColumnVector

export const makeEmptyMatrix = (): Matrix => ({ rows: 0, cols: 0, data: [] })

export const clone = (A: Matrix): Matrix => ({ ...A, data: [...A.data] })

export const row = (i: number, { rows, cols, data }: Matrix): Matrix => {
  if (i < 0 || i >= rows) {
    throw new RangeError(`Paramenter "i" must fall between 0 and ${rows - 1} (its value is ${i})`)
  }
  return { rows: 1, cols, data: data.slice(i * cols, (i + 1) * cols) }
}

export const appendRow = (A: Matrix, row: Matrix): Matrix => {
  // TODO: Validate input
  return { rows: A.rows + 1, cols: A.cols || row.data.length, data: A.data.concat(row.data) }
}

export const sum = (A: Matrix, B: Matrix): Matrix => {
  // Validate matrices
  if (A.rows !== B.rows || A.cols !== B.cols || A.data.length !== B.data.length) {
    throw new Error(`Cannot sum ${js(A)} with ${js(B)}`)
  }

  // Initialize calc
  const m = A.rows
  const n = A.cols
  const sum = makeMatrix(m, n)

  // Calculate sum
  for (let i = 0; i < m; ++i) {
    for (let j = 0; j < n; ++j) {
      sum.data[i * n + j] = A.data[i * n + j] + B.data[i * n + j]
    }
  }

  // Return sum
  return sum
}

export const sub = (A: Matrix, B: Matrix): Matrix => sum(A, smul(-1, B))

export const product = (A: Matrix, B: Matrix): Matrix => {
  // Validate input matrices A and B
  if (A.cols !== B.rows) {
    throw new Error(`Cannot multiply ${js(A)} with ${js(B)}`)
  }

  // Initialize product matrix C
  const C = makeMatrix(A.rows, B.cols)

  // Calculate product matrix P
  for (let i = 0; i < C.rows; ++i) {
    for (let j = 0; j < C.cols; ++j) {
      C.data[i * C.cols + j] = 0
      for (let k = 0; k < A.cols /* or B.rows, it is the same */; ++k) {
        C.data[i * C.cols + j] += A.data[i * A.cols + k] * B.data[k * B.cols + j]
      }
    }
  }

  // Return product C
  return C
}

export const transpose = (A: Matrix): Matrix => {
  const T = makeMatrix(A.cols, A.rows)
  for (let i = 0; i < A.rows; ++i) {
    for (let j = 0; j < A.cols; ++j) {
      T.data[j * A.rows + i] = A.data[i * A.cols + j]
    }
  }
  return T
}

export const norm = (A: Matrix): number => {
  let sum = 0
  for (let i = 0; i < A.rows; ++i) {
    for (let j = 0; j < A.cols; ++j) {
      sum += A.data[i * A.cols + j] * A.data[i * A.cols + j]
    }
  }
  return Math.sqrt(sum)
}

export const innerProduct = (a: number[], b: number[]): number => {
  // TODO: Validate input vectors
  let dot = 0
  for (let i = 0; i < a.length; ++i) {
    dot += a[i] * b[i]
  }
  return dot
}

export const dot = (x: Matrix, y: Matrix): number => {
  if ((x.cols !== 1 && x.rows !== 1) || (y.cols !== 1 && y.rows !== 1)) {
    throw new Error(`Only vectors can be used in scalar product`)
  }
  if (x.data.length !== y.data.length) {
    throw new Error(`The vectors differ in length`)
  }
  let innerProduct = 0
  for (let i = 0; i < x.data.length; ++i) {
    innerProduct += x.data[i] * y.data[i]
  }
  return innerProduct
}

export const toArray = (A: Matrix): Array<Array<number>> => {
  const rows: number[][] = []
  for (let i = 0; i < A.rows; ++i) {
    const elements: number[] = []
    for (let j = 0; j < A.cols; ++j) {
      elements.push(A.data[i * A.cols + j])
    }
    rows.push(elements)
  }
  return rows
}
/**
 * Creates a matrix from an array of arrays of numbers
 * Each elemente of the input array will be treated as a row
 * @param  {Array<Array<number>>} theArray
 * @returns The Matrix created from the input array
 * @example  
 */
export const fromArray = (theArray: Array<Array<number>>): Matrix => {
  const rows = theArray.length
  const cols = theArray[0].length
  const A: Matrix = makeMatrix(rows, cols)
  for (let i = 0; i < rows; ++i) {
    if (theArray[i].length !== cols) {
      throw new Error(`Element ${i} is of size ${theArray[i].length}. It must be ${cols}`)
    }
    for (let j = 0; j < cols; ++j) {
      A.data[i * cols + j] = theArray[i][j]
    }
  }
  return A
}
/**
 * smul - scalar multiplication of a Matrix by a number (scalar)
 *
 * @param  {number} scalar The factor
 * @param  {Matrix} The Matrix argument. That last argument (the Matrix) is destructured in this
 * implementation as its ```rows, columns and data``` properties
 * @returns a Matrix with each element multiplied by the scalar factor
 * @throws an Error if the ```data``` property of the matrix contains a non-numeric value
 * @example
 * import { makeMatrix, smul} from "../src/matrix"
 * const before = makeMatrix(1,3,[1,2,3])
 * const after = smul(100,before)
 * console.log({before,after})
 * // renders: {
 * //  before: { rows: 1, cols: 3, data: [ 1, 2, 3 ] },
 * //  after: { rows: 1, cols: 3, data: [ 100, 200, 300 ] }
 * // }
 *
 */
export const smul = (scalar: number, { rows, cols, data }: Matrix): Matrix => ({
  rows,
  cols,
  data: data.map(a => a * scalar),
})

/**
 * Generates a orthonormal basis of the subspace spanned for the input vector list.
 * As a bonus detect a linear dependence if exist in the vectors given :)
 *
 * @param {Matrix} A The vector list _in its rows_
 * @returns {Matrix} The vector list (let's name it Q) _in its rows_ of the orthonormal basis generated.
 * But if Q has fewer rows than A then there is a linear dependency in the vector set of the A rows.
 * Note then: You must compare the "rows" property between the input matrix and the result to detect that linear
 * dependency. They must be equal in the linear independency case.
 *
 * @example
 * // From vlms book...
 *
 * import { makeMatrix, print, gramSchmidt} from "../src/matrix"
 * const A = makeMatrix(3, 4, [-1, 1, -1, 1, -1, 3, -1, 3, 1, 3, 5, 7])
 * console.log(print(gramSchmidt(A)))
 *
 * // renders
 * // [[ -0.5, 0.5, -0.5, 0.5 ]
 * //  [ 0.5, 0.5, 0.5, 0.5 ]
 * //  [ -0.5, -0.5, 0.5, 0.5 ]]
 */
export const gramSchmidt = (A: Matrix): Matrix => {
  // Create the empty list
  let Q = makeEmptyMatrix()

  for (let i = 0; i < A.rows; ++i) {
    const ai = row(i, A)
    let q = clone(ai)

    for (let j = 0; j < Q.rows; ++j) {
      // Subtract from q the projections on the others to orthogonalize
      const qj = row(j, Q)
      q = sub(q, smul(dot(qj, ai), qj))
      // Verify that q is not a linear combination of the others
      if (norm(q) <= 1e-10) {
        return Q // Premature end because linear dependency
      }
    }
    // Append the (normalized) orthogonal vector to list Q
    q = smul(1 / norm(q), q)
    Q = appendRow(Q, q)
  }
  // Q is now the orthonormal basis of our subspace
  return Q
}

export const print = (A: Matrix): string => {
  let str = ``
  for (let i = 0; i < A.rows; ++i) {
    str += "[ "
    for (let j = 0; j < A.cols; ++j) {
      str += `${A.data[i * A.cols + j]}${j < A.cols - 1 ? ", " : ""}`
    }
    str += ` ]${i < A.rows - 1 ? "\n " : ""}`
  }
  return A.rows > 1 ? `[${str}]` : str
}
