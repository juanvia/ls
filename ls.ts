const msum = (a: number[], b: number[]): number[] => {
  const sum = new Array<number>(a.length)
  for (let i = 0; i < a.length; ++i) {
    sum[i] = a[i] + b[i]
  }
  return sum
}
export default msum
