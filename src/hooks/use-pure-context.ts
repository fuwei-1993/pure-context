import { FreezedContext, ObservableValue } from '@components/provider'
import { depsCollection } from '@utils/index'
import { useLayoutEffect } from 'react'

export const usePureContext = <T extends Record<string, any>>() => {
  const freezedContext = useContext<ObservableValue<T>>(FreezedContext)
  const { proxyState, depKeys } = depsCollection(freezedContext.state)
  const depKeysRef = useRef(depKeys)
  const [state, setState] = useState(proxyState)

  useLayoutEffect(() => {
    const observer = (changeKeys: string[]) => {
      const depKeys = depKeysRef.current

      const isStateChange =
        difference([...depKeys.values()], changeKeys).length < depKeys.size

      if (isStateChange) {
        const { proxyState, depKeys } = depsCollection(freezedContext.state)
        depKeysRef.current = depKeys

        setState(proxyState)
      }
    }
    freezedContext.observers.add(observer)

    return () => {
      freezedContext.observers.delete(observer)
    }
  }, [])

  return state
}
