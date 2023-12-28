import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
  return <div>hell world</div>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const domNode = document.getElementById('app')!
const root = createRoot(domNode, {
  identifierPrefix: 'root',
})

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
