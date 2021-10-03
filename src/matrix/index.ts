import { Matrix, MatrixPair } from "./types"
export { Matrix, MatrixPair }

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
 * Create a Matrix with its cols property fixed in 1
 * @param  {number} size
 * @param  {number[]} data?
 * @returns A {rows:size,cols:1} Matrix
 */
export const makeColumnVector = (size: number, data?: number[]): Matrix => makeMatrix(size, 1, data)

/**
 * Alias of makeColumnVector
 * The default vector in this library is a _column_ vector
 */
export const makeVector = makeColumnVector

/**
 * Make an empty matrix (zero rows, zero cols, empty data)
 * @returns Matrix
 */
export const makeEmptyMatrix = (): Matrix => makeMatrix(0, 0)
/**
 * Deep copy of a Matrix. The data property is not a reference, is
 * a fresh new array. Further modification of the new Matrix does not
 * affect the original one.
 * @param  {Matrix} A
 * @returns Matrix
 */
export const clone = (A: Matrix): Matrix => ({ ...A, data: [...A.data] })

/**
 * Extract a copy of one row of the original Matrix in a row vector (also
 * a Matrix of course, of 1 row by the original matrix columns). Make use of the
 * slice method of the array in the data property. So further modification of the new Matrix does not
 * affect the original one.
 * @param {number} i
 * @param {Matrix} source
 * @returns Matrix
 */
export const row = (i: number, { rows, cols, data }: Matrix): Matrix => {
  if (i < 0 || i >= rows) {
    throw new RangeError(`Paramenter "i" must fall between 0 and ${rows - 1} (its value is ${i})`)
  }
  return { rows: 1, cols, data: data.slice(i * cols, (i + 1) * cols) }
}
/**
 * Extract a copy of one column of the original Matrix in a column vector (also
 * a Matrix of course, of 1 column by the original matrix rows).
 * @param {number} j
 * @param {Matrix} source
 * @returns Matrix
 */
export const column = (j: number, { rows, cols, data }: Matrix): Matrix => {
  if (j < 0 || j >= cols) {
    throw new RangeError(`Paramenter "i" must fall between 0 and ${cols - 1} (its value is ${j})`)
  }
  const newData = []
  for (let i = 0; i < rows; ++i) {
    newData.push(data[i * cols + j])
  }

  return { cols: 1, rows, data: newData }
}
/**
 * Returns a Matrix equal to the original but with the given row
 * appended
 * @param  {Matrix} A
 * @param  {Matrix} row
 * @returns Matrix
 */
export const appendRow = (A: Matrix, row: Matrix): Matrix => {
  // TODO: Validate input
  return { rows: A.rows + 1, cols: A.cols || row.data.length, data: A.data.concat(row.data) }
}
/**
 * Returns a Matrix whose elements are the sum of the correspondent elements
 * of the two given Matrices (So they must be of the same size)
 * @param  {Matrix} A
 * @param  {Matrix} B
 * @returns Matrix
 */
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

export const mul = (A: Matrix, B: Matrix): Matrix => {
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

export const tr = (A: Matrix): Matrix => {
  const T = makeMatrix(A.cols, A.rows)
  for (let i = 0; i < A.rows; ++i) {
    for (let j = 0; j < A.cols; ++j) {
      T.data[j * A.rows + i] = A.data[i * A.cols + j]
    }
  }
  return T
}
/**
 * Gives the norm of the Matrix. Mainly used when it is a vector. The norm of a matrix
 * is the square root of the sum of the squares of its elements.
 *
 * @param  {Matrix} A
 * @returns number
 * @example
 * import { makeMatrix, norm } from "../src/matrix"
 * const A = makeMatrix(2, 2, [3,0,0,4])
 * const b = makeMatrix(2, 1, [3,4])
 * console.log(norm(A), norm(b)) // --> 5 5
 */
export const norm = (A: Matrix): number => {
  let sum = 0
  for (let i = 0; i < A.rows; ++i) {
    for (let j = 0; j < A.cols; ++j) {
      sum += A.data[i * A.cols + j] * A.data[i * A.cols + j]
    }
  }
  return Math.sqrt(sum)
}
/**
 * Returns a transformed Matrix whose element are numbers result
 * of the application of a given function (number to number) to
 * the corespondent elements of the original
 * @param  {(value:number,index:number,array:number[])=>number} f
 * @param  {Matrix} A}
 * @returns Matrix
 * @example
 * import { makeMatrix, map } from "../src/matrix"
 * const A = makeMatrix(3, 2, [2, 0.9999999999999998, 2, 0.9999999999999998, 1, 5.000000000000001])
 * const B = map(Math.round, A)
 * console.log({ A, B })
 * // renders:
 * // {
 * //   A: {
 * //     rows: 3,
 * //     cols: 2,
 * //     data: [
 * //       2,
 * //       0.9999999999999998,
 * //       2,
 * //       0.9999999999999998,
 * //       1,
 * //       5.000000000000001
 * //     ]
 * //   },
 * //   B: { rows: 3, cols: 2, data: [ 2, 1, 2, 1, 1, 5 ] }
 * // }
 */
export const map = (
  f: (value: number, index: number, array: number[]) => number,
  { rows, cols, data }: Matrix
): Matrix => ({
  rows,
  cols,
  data: data.map(f),
})

/**
 * Calculate the dot product, also named inner product or scalar product of
 * the given vectors.
 * @param  {Matrix} x
 * @param  {Matrix} y
 * @returns number
 */
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
/**
 * @param  {Matrix} A Input Matrix
 * @returns The array created (of _number[][]_ type), row-wise
 * @example
 * import { makeMatrix, toArray } from "../src/matrix"
 * const A = makeMatrix(2,5,[0,1,2,3,4,5,6,7,8,9])
 * console.log(toArray(A))
 * // renders
 * // [ [ 0, 1, 2, 3, 4 ], [ 5, 6, 7, 8, 9 ] ]
 */
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
 * Creates a matrix from an array of arrays of numbers.
 * Each element of the input array will be treated as a row
 * @param  {Array<Array<number>>} theArray
 * @returns The Matrix created from the input array
 * @example
 * import { fromArray } from "../src/matrix"
 * console.log(fromArray([[0,1,2,3,4],[1,2,4,8,16]]))
 * // renders
 * // {
 * //   rows: 2,
 * //   cols: 5,
 * //   data: [
 * //     0, 1, 2, 3,  4,
 * //     1, 2, 4, 8, 16
 * //   ]
 * // }
 *
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
 * Given a Matrix A returns the value of the element indicated by the subindice(s) given
 * If you call it with only one index then returns the value of the absolute position
 * (row-wise) of the element indicated.
 * @param  {Matrix} A
 * @param  {number} i
 * @param  {number} j?
 * @returns number
 * @example
 * import { makeMatrix, get, makeVector, toArray } from "../src/matrix"
 * const A=makeMatrix(6,2,[2,1,5,1,7,1,11,1,14,1,18,1])
 * const b=makeVector(6,[5,5,8,7,9,7])
 * console.log({
 *   A: toArray(A),
 *   b: toArray(b),
 *   'get(A,0,0)': get(A,0,0),
 *   'get(A,5,1)': get(A,5,1),
 *   'get(A,2)': get(A,2),
 *   'get(A,5,0)': get(A,5,0),
 *   'get(A,10)': get(A,10),
 *   'get(A,11)': get(A,11),
 *   'get(b,0)': get(b,0),
 *   'get(b,2)': get(b,2),
 *   'get(b,5)': get(b,5),
 * })
 * // renders
 * // {
 * //   A: [ [ 2, 1 ], [ 5, 1 ], [ 7, 1 ], [ 11, 1 ], [ 14, 1 ], [ 18, 1 ] ],
 * //   b: [ [ 5 ], [ 5 ], [ 8 ], [ 7 ], [ 9 ], [ 7 ] ],
 * //   'get(A,0,0)': 2,
 * //   'get(A,5,1)': 1,
 * //   'get(A,2)': 5,
 * //   'get(A,5,0)': 18,
 * //   'get(A,10)': 18,
 * //   'get(A,11)': 1,
 * //   'get(b,0)': 5,
 * //   'get(b,2)': 8,
 * //   'get(b,5)': 7
 * // }
 */
export const get = (A: Matrix, i: number, j?: number | undefined): number => {
  if (typeof j === "undefined") {
    if (i < 0 || i >= A.rows * A.cols) {
      throw new RangeError(`Index i is out of bounds 0 and ${A.rows * A.cols - 1}, it is ${i}`)
    }
    return A.data[i]
  } else {
    if (i < 0 || i >= A.rows) {
      throw new RangeError(`Index i is out of bounds 0 and ${A.rows - 1}, it is ${i}`)
    }
    if (j < 0 || j >= A.cols) {
      throw new RangeError(`Index j is out of bounds 0 and ${A.cols - 1}, it is ${j}`)
    }
    return A.data[i * A.cols + j]
  }
}

/**
 * smul - scalar multiplication of a Matrix by a number (scalar)
 *
 * @param  {number} scalar The factor
 * @param  {Matrix} desctructured You give a Matrix argument. That last argument (the Matrix) is destructured in this
 * implementation as its ```rows, columns and data``` properties
 * @returns a Matrix with each element multiplied by the scalar factor
 * @throws an Error if the ```data``` property of the matrix contains a non-numeric value
 * @example
 * import { makeMatrix, smul} from "../src/matrix"
 * const before = makeMatrix(1,3,[1,2,3])
 * const after = smul(100,before)
 * console.log({before,after})
 * // renders:
 * // {
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
 * // renders:
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
/**
 * Returns an array of two Matrices (a MatrixPair) with the result
 * of the QR decompose of the given Matrix A
 * QR=A
 * @param  {Matrix} A
 * @returns MatrixPair
 * @example
 * import { qr, makeMatrix } from '../src/matrix'
 * const A = makeMatrix(3, 2, [2, 1, 2, 1, 1, 5])
 * const [Q, R] = qr(A)
 * console.log ({A,Q,R})
 * // renders:
 * // {
 * //   A: { rows: 3, cols: 2, data: [ 2, 1, 2, 1, 1, 5 ] },
 * //   Q: {
 * //     rows: 3,
 * //     cols: 2,
 * //     data: [
 * //       0.6666666666666666,
 * //       -0.23570226039551587,
 * //       0.6666666666666666,
 * //       -0.23570226039551587,
 * //       0.3333333333333333,
 * //       0.9428090415820635
 * //     ]
 * //   },
 * //   R: { rows: 2, cols: 2, data: [ 3, 3, 0, 4.242640687119286 ] }
 * // }
 */
export const qr = (A: Matrix): MatrixPair => {
  const Q = tr(gramSchmidt(tr(A)))
  const R = mul(tr(Q), A)
  return [Q, R]
}
/**
 * Return a column vector Matrix. That vector is the solution _x_
 * of the system of linear equations Rx=b where R is an upper
 * triangular matrix whose diagonal elements are positive. 
 * The R Matrix is necessarily square.
 * The solution is achieved by the back substitution method where
 * "the variables are found one at a time, starting from xn , and
we substitute the ones that are known into the remaining equations." 
 * @param  {Matrix} R
 * @param  {Matrix} b
 * @returns Matrix
 * @example
 * import { makeMatrix, backSubstitution, makeColumnVector } from "../src/matrix";
 * const R = makeMatrix(3,3,[
 *   4,2,5,
 *   0,1,1,
 *   0,0,10
 * ])
 * const b = makeColumnVector(3,[53,12,70])
 * const x = backSubstitution(R,b)
 * console.log({R,b,x})
 * // renders:
 * // {
 * //   R: {
 * //     rows: 3,
 * //     cols: 3,
 * //     data: [
 * //       4, 2, 5,  0, 1,
 * //       1, 0, 0, 10
 * //     ]
 * //   },
 * //   b: { rows: 3, cols: 1, data: [ 53, 12, 70 ] },
 * //   x: { rows: 3, cols: 1, data: [ 2, 5, 7 ] }
 * // }
 */
export const backSubstitution = (R: Matrix, b: Matrix): Matrix => {
  const x = []
  for (let eq = 0; eq < R.rows; ++eq) {
    const i = R.rows - eq - 1
    x[i] = get(b, i)
    for (let j = i + 1; j < R.cols; ++j) {
      x[i] -= get(R, i, j) * x[j]
    }
    x[i] /= get(R, i, i)
  }
  return makeColumnVector(R.rows, x)
}
/**
 * Solve the system of linear equations _Ax = b_ finding the vector _x_
 * such that:
 *
 *  - If _A_ is square _x_ is the exact solution. In other words:
 * _x_ equals the product of the inverse of _A_ with _b_ and the squared
 * norm of the difference between the product of _A_ and _b_ and _x_ is 0.
 * ```norm(sub(mul(A,x),b))**2 === 0```
 *
 *  - Otherwise _A_ must be tall (its rows number greater than its columns number).
 * And then, as there is not an exact solution _x_, _x_ is the vector such the
 * squared norm of the difference between the product of _A_ and _b_ and _x_
 * is minimal. In other words: x is the best approximation in the **least squares** sense.
 *
 * @param  {Matrix} A
 * @param  {Matrix} b
 * @returns Matrix
 * @example
 * import { makeMatrix, solve, print, makeColumnVector } from "../src/matrix"
 * const A=makeMatrix(6,2,[2,1,5,1,7,1,11,1,14,1,18,1])
 * const b=makeColumnVector(6,[5,5,8,7,9,7])
 * const x=solve(A,b)
 * console.log(print(x)) // --> [[ 0.17183098591549267 ][ 5.200938967136154 ]]
 */
export const solve = (A: Matrix, b: Matrix): Matrix => {
  const [Q, R] = qr(A)
  return backSubstitution(R, mul(tr(Q), b))
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
