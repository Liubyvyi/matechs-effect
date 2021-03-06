import { pipe } from "../../Function"

import { chain } from "./chain"
import { Exit } from "./exit"
import { succeed } from "./succeed"

/**
 * Maps over the value type.
 */
export const map = <A, A1>(f: (a: A) => A1) => <E>(exit: Exit<E, A>): Exit<E, A1> =>
  pipe(
    exit,
    chain((a) => succeed(f(a)))
  )
