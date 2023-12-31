import { Provider } from '@components/provider'
import { usePureContext } from '@hooks/use-pure-context'
import { Dispatch, SetStateAction } from 'react'
import { createRoot } from 'react-dom/client'

const A = () => {
  const { num1, setNum1 } = usePureContext()
  console.log('A render')

  return <button onClick={() => setNum1(num1 + 1)}>{num1}</button>
}
const B = () => {
  const { num2, setNum2 } = usePureContext()
  console.log('B render')

  return <button onClick={() => setNum2(num2 + 1)}>{num2}</button>
}
const C = () => {
  const { num3, setNum3 } = usePureContext()
  console.log('C render')

  return (
    <button
      onClick={() => {
        setNum3(num3 + 1)
      }}
    >
      {num3}
    </button>
  )
}

const App = () => {
  return (
    <div>
      <A />
      <B />
      <C />
    </div>
  )
}

const usePureState = <T,>(initialValue: T) => {
  const [state, setState] = useState(initialValue)

  return [state, setState] as [T, Dispatch<SetStateAction<T>> & { value: T }]
}

const useHook = () => {
  const [num1, innerSetNum1] = useState(0)
  const [num2, setNum2] = usePureState(0)
  const [num3, setNum3] = useState(0)

  const setNum1 = () => {
    console.log(num2)
    console.log(setNum2.value)

    innerSetNum1(num1 + 1)
  }

  return {
    num1,
    num2,
    num3,
    setNum1,
    setNum2,
    setNum3,
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const domNode = document.getElementById('app')!
const root = createRoot(domNode, {
  identifierPrefix: 'root',
})

root.render(
  <Provider useHook={useHook} logger>
    <App />
  </Provider>,
)
