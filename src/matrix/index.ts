import { Matrix } from "./types"
const js = JSON.stringify

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

export const make = makeMatrix

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

export const dot = innerProduct

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

export const fromArray = (theArray: Array<Array<number>>): Matrix => {
  // TODO: Validate input array
  const rows = theArray.length
  const cols = theArray[0].length
  const A: Matrix = make(rows, cols)
  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      A.data[i * cols + j] = theArray[i][j]
    }
  }
  return A
}

export const toVector = (A: Matrix): Array<number> => A.data

export const fromVector = (theVector: Array<number>): Matrix => {
  // TODO: Validate input array
  const rows = theVector.length
  const cols = 1
  const A: Matrix = make(rows, cols)
  for (let i = 0; i < rows; ++i) {
    A.data[i] = theVector[i]
  }
  return A
}
export const scalarProduct = (scalar: number, { rows, cols, data }: Matrix): Matrix => ({
  rows,
  cols,
  data: data.map(a => a * scalar),
})
export const gramSchmidt = (A: Matrix): Matrix => {
  // import numpy as np
  // def gram_schmidt(a):

  //   q = []
  const Q: Array<Array<number>> = []
  const a = toArray(A)
  //   for i in range(len(a)):
  for (let i = 0; i < a.length; ++i) {
    //     #orthogonalization
    //     q_tilde = a[i]
    let qTilde = a[i]
    console.log({ qTilde })
    //     for j in range(len(q)):
    for (let j = 0; j < Q.length; ++i) {
      //       q_tilde = q_tilde - (q[j] @ a[i])*q[j]
      qTilde = toVector(scalarProduct(dot(Q[j], a[i]), fromVector(Q[j])))
      //       #Test for dependennce
      //       if np.sqrt(sum(q_tilde**2)) <= 1e-10:
      if (qTilde.map(qi => qi * qi).reduce((a, b) => a + b, 0) <= 1e-10) {
        //         print('Vectors are linearly dependent.')
        //         print('GS algorithm terminates at iteration ', i+1)
        return fromArray(Q)
      }
      //       #Normalization
      //       else:
      //         q_tilde = q_tilde / np.sqrt(sum(q_tilde**2))
      //         q.append(q_tilde)
    }
    Q.push(qTilde.map(qi => qi / qTilde.map(qi => qi * qi).reduce((a, b) => a + b, 0)))
    console.log({ Q })
  }
  //   print('Vectors are linearly independent.')
  return fromArray(Q)
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
