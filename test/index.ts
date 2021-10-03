import { resolve } from "path"
import { runFiles } from "@xaviervia/micro-snapshots"

const shouldOverwrite = process.argv.includes("-u")

runFiles(
  [
    resolve(__dirname, "appendColumn.spec.ts"),
    resolve(__dirname, "column.spec.ts"),
    resolve(__dirname, "row.spec.ts"),
  ],
  {
    shouldOverwrite,
  }
)
