import { FreezedContext } from '@components/provider'
import { depsCollection } from '@utils/index'
import { difference } from 'lodash-es'

export const usePureContext = <T extends Record<string, any>>() => {
  const freezedContext = useContext(FreezedContext)
  const { proxyState, deps } = depsCollection(freezedContext.state as T)
  const [state, setState] = useState(proxyState)

  useEffect(() => {
    const observer = (changeKeys: string[]) => {
      const isStateChange =
        difference([...deps.values()], changeKeys).length < deps.size

      if (isStateChange) {
        const { proxyState } = depsCollection(freezedContext.state)
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
