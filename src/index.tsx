import { createRoot } from 'react-dom/client'
import Root from './Root'
import './styles/index.scss'

const domNode = document.getElementById('root')!
const root = createRoot(domNode)

root.render(<Root />)
