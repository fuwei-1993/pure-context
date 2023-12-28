import type { PropsWithChildren } from 'react'

interface ObservableValue<T = any> {
  state: T
  observers: Set<(keys: string[]) => void>
}
const defaultValue = {
  state: {},
  observers: new Set(),
} as ObservableValue

export const FreezedContext = createContext(defaultValue)

export const Provider = <T extends Record<string, any> = any>(
  props: PropsWithChildren<{ useHook: () => T }>,
) => {
  const value = props.useHook()
  const { current: observableValue } = useRef<ObservableValue<T>>({
    state: value,
    observers: new Set(),
  })

  useEffect(() => {
    const changedKeys = Object.keys(value).reduce((result, curr) => {
      if (!Object.is(observableValue.state[curr], value[curr])) {
        result.push(curr)
      }
      return result
    }, [] as string[])

    if (changedKeys.length) {
      observableValue.state = value
      observableValue.observers.forEach(ob => ob(changedKeys))
    }
  }, [value])

  return (
    <FreezedContext.Provider value={observableValue}>
      {props.children}
    </FreezedContext.Provider>
  )
}
