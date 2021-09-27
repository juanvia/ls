// import { pipe } from "fp-ts/lib/function"
// import {
//   //row,
//   makeMatrix,
//   smul,
//   // make,
//   print,
//   // sum,
//   // norm,
//   // dot,
//   // fromVector,
//   // toVector,
//   // scalarProduct,
//   gramSchmidt,
// } from "../src/matrix"
// import * as Matrix from "../src/matrix"
// pipe(makeMatrix(1, 5, [1, 2, 3, 5, 8]), print, console.log)
// const a = makeMatrix(1, 5, [1, 2, 3, 5, 8])
// const b = makeMatrix(1, 5, [1, 3, 5, 7, 11])
// pipe(a, print, console.log)
// pipe(b, print, console.log)
// pipe(sum(a, b), print, console.log)
// const d = makeMatrix(2, 2, [1, 3, 5, 8])
// const e = makeMatrix(2, 2, [100, 100, 100, 100])
// pipe(d, print, console.log)
// pipe(e, print, console.log)
// pipe(sum(d, e), print, console.log)
// const B = Matrix.make(2, 2, [5, 6, 7, 8])
// pipe(Matrix.product(Matrix.make(2, 2, [1, 2, 3, 4]), B), Matrix.print, console.log)
// const x = Matrix.make(3, 1, [2, 4, 8])
// pipe(x, Matrix.print, console.log)
// pipe(Matrix.transpose(x), Matrix.print, console.log)
// pipe(Matrix.product(Matrix.transpose(x), x), Matrix.print, console.log)
// pipe(Matrix.make(1, 1, [1]), A => Matrix.sum(A, Matrix.make(1, 1, [1])), Matrix.print, console.log) // So 1+1=2
// pipe(make(2, 1, [3, 4]), norm, console.log) // So Pythagoras was right
// pipe(d, Matrix.toArray, JSON.stringify, console.log)
// pipe(d, Matrix.toArray, Matrix.fromArray, Matrix.toArray, JSON.stringify, console.log)
// pipe([3, 4], Matrix.fromVector, Matrix.toVector, JSON.stringify, console.log)
// pipe([3, 4], v => dot(v, [3, 4]), console.log)
// pipe([3, 4], fromVector, A => scalarProduct(10, A), toVector, JSON.stringify, console.log)
// const A = makeMatrix(3, 4, [-1, 1, -1, 1, -1, 3, -1, 3, 1, 3, 5, 7])
// pipe(A, Matrix.gramSchmidt, print, console.log)
// console.log(print(gramSchmidt(A)))
// console.log(print(smul(100, makeMatrix(3, 1, [1, 2, 3]))))
// const before = makeMatrix(1, 3, [1, 2, 3])
// const after = smul(100, before)
// console.log({ before, after })
// renders: {
//  before: { rows: 1, cols: 3, data: [ 1, 2, 3 ] },
//  after: { rows: 1, cols: 3, data: [ 100, 200, 300 ] }
// }


// import { fromArray } from "../src/matrix"
// console.log(fromArray([[0,1,2,3,4],[1,2,4,8,16]]))

// import { gramSchmidt, makeMatrix, toArray } from "../src/matrix"
// import { pipe } from "fp-ts/lib/function"
// const A = makeMatrix(2, 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// console.log(toArray(A))

// import { gramSchmidt, makeMatrix, tr, mul, map } from "../src/matrix"
// import { pipe } from "fp-ts/lib/function"
// const M = makeMatrix(3, 2, [2, 1, 2, 1, 1, 5])
// const Q = pipe(M, tr, gramSchmidt, tr)
// const R = mul(tr(Q), M)
// const A = mul(Q, R)
// console.log({ M, Q, R })
// console.log({ M, A })
// console.log({ M, A: map(Math.round, A) })

// import { qr, makeMatrix } from '../src/matrix'
// const A = makeMatrix(3, 2, [2, 1, 2, 1, 1, 5])
// const [Q, R] = qr(A)
// console.log ({A,Q,R})


// import { makeMatrix,backSubstitution, makeColumnVector } from "../src/matrix";
// const R = makeMatrix(3,3,[
//   4,2,5,
//   0,1,1,
//   0,0,10
// ])
// const b = makeColumnVector(3,[53,12,70])
// const x = backSubstitution(R,b)
// console.log({R,b,x})

import { makeMatrix, solve, print, makeColumnVector } from "../src/matrix"
const A=makeMatrix(6,2,[2,1,5,1,7,1,11,1,14,1,18,1])
const b=makeColumnVector(6,[5,5,8,7,9,7])
const x=solve(A,b)
console.log(print(x)) // --> [[ 0.17183098591549267 ][ 5.200938967136154 ]]
