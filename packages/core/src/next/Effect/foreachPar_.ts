import { chain_ } from "./chain_"
import { Effect, AsyncRE } from "./effect"
import { effectTotal } from "./effectTotal"
import { foreachParUnit_ } from "./foreachParUnit_"

/**
 * Applies the function `f` to each element of the `Iterable<A>` in parallel,
 * and returns the results in a new `readonly B[]`.
 *
 * For a sequential version of this method, see `foreach`.
 */
export const foreachPar_ = <S, R, E, A, B>(
  as: Iterable<A>,
  f: (a: A) => Effect<S, R, E, B>
): AsyncRE<R, E, readonly B[]> => {
  const arr = Array.from(as)

  return chain_(
    effectTotal<B[]>(() => []),
    (array) => {
      const fn = ([a, n]: [A, number]) =>
        chain_(f(a), (b) =>
          effectTotal(() => {
            array[n] = b
          })
        )
      return chain_(
        foreachParUnit_(
          arr.map((a, n) => [a, n] as [A, number]),
          fn
        ),
        () => effectTotal(() => array)
      )
    }
  )
}
