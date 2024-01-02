import { logger, shallowCompareFn } from '@utils/index'
import type { PropsWithChildren } from 'react'

export interface ObservableValue<T = any> {
  state: T
  observers: Set<(keys: string[]) => void>
}

interface ProviderProps<T> {
  useHook: () => T
  logger?: boolean
}

const defaultValue = {
  state: {},
  observers: new Set(),
} as ObservableValue

export const FreezedContext = createContext(defaultValue)

export const Provider = <T extends Record<string, any> = any>(
  props: PropsWithChildren<ProviderProps<T>>,
) => {
  const nextState = props.useHook()
  const { current: observableValue } = useRef<ObservableValue<T>>({
    state: nextState,
    observers: new Set(),
  })

  useEffect(() => {
    const changedKeys = Object.keys(nextState).reduce((result, key) => {
      const prevState = observableValue.state
      const isSameFunction = shallowCompareFn(prevState[key], nextState[key])
      const isSameValue = isEqual(prevState[key], nextState[key])

      if (isSameFunction) return result
      if (isSameValue) return result

      if (props.logger) {
        logger(key, prevState[key], nextState[key])
      }

      return [...result, key]
    }, [] as string[])

    if (changedKeys.length) {
      observableValue.state = nextState
      observableValue.observers.forEach(ob => ob(changedKeys))
    }
  }, [nextState])

  return (
    <FreezedContext.Provider value={observableValue}>
      {props.children}
    </FreezedContext.Provider>
  )
}
