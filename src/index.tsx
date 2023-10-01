import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import Root from './Root'

const domNode = document.getElementById('root')!
const root = createRoot(domNode)

root.render(<Root />)
