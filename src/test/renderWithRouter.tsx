import { render, RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const renderWithRouter = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: MemoryRouter, ...options })

export default renderWithRouter
