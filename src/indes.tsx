import { useEffect, useState } from 'react'

type MutationObserverCallback = (mutationRecords: MutationRecord[], observer?: MutationObserver) => void
type MutationObserverOptions = {
  attributes?: boolean
  attributeOldValue?: boolean
  attributeFilter?: string[]
  characterData?: boolean
  characterDataOldValue?: boolean
  childList?: boolean
  subtree?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const defaultMutationObserverOptions: MutationObserverOptions = {
  attributes: true,
}

export type MutationValueCallback<T = unknown> = (
  // eslint-disable-next-line unicorn/prevent-abbreviations
  ...args: Parameters<MutationCallback>
) => T

/**
 * useMutationObserver is a React Hook that integrates a MutationObserver
 * with a React useEffect update lifecycle. This is typically used with
 * a ReactiveElement or HTML Element. MutationObservers can be used to detect
 * arbitrary changes to DOM, including nodes being added and remove and
 * attributes changing.
 *
 * The hook can specify a `target` element to observe and the
 * configuration options to pass to the MutationObserver. The `observe`
 * method can be called to observe additional elements.
 *
 * When a change is detected, the hook's given `callback` function is
 * used to process the result into a value which is stored on the hook.
 * The hook's `value` is returned to the user.
 *
 * @param target - The react or HTML element to observe
 * @param callback - The callback function to use to process the mutation or a callback to use on your own
 * @param options - The MutationObserver options to use
 * @returns A tuple containing the value and the observer
 *
 * @example
 * const [target, setTarget] = useRef()
 * const [changes, setChanges] = useState()
 * useMutationObserver(target.current, (mutations, observer) => {
 *   const changes = mutations.map(mutation => {
 *     return {
 *       type: mutation.type,
 *       target: mutation.target,
 *       attributeName: mutation.attributeName,
 *       oldValue: mutation.oldValue,
 *     }
 *   })
 *   return setChanges(changes)
 * })
 * @example
 * const [target, setTarget] = useRef()
 * const [value, observer] = useMutationObserver(target.current, (mutation) => {
 *   const { type, target, attributeName, oldValue } = mutation
 *   return target.getAttribute(attributeName)
 * })
 */
function useMutationObserver<T extends Element = HTMLDivElement>(
  target: Element | null,
  callback?: MutationValueCallback<T> | MutationObserverCallback,
  options = defaultMutationObserverOptions
) {
  const [observer, setObserver] = useState<MutationObserver | null>(null)
  const [value, setValue] = useState<T | undefined>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChanges = (mutations: MutationRecord[]) => {
    if (observer) {
      if (callback && typeof callback === 'function') {
        const result = callback(mutations, observer)
        if (result !== undefined) {
          setValue(result)
        }
      } else {
        console.warn('useMutationObserver: callback is not a function')
      }
    }
  }

  useEffect(() => {
    const obs = new MutationObserver(handleChanges)
    setObserver(obs)
  }, [handleChanges, options])

  useEffect(() => {
    if (!observer || !target) return

    try {
      observer.observe(target, options)
    } catch (error) {
      console.error(error)
    }
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [observer, target, options])

  return [value, observer]
}

export default useMutationObserver
