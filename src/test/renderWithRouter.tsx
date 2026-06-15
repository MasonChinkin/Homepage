import { render, RenderOptions } from '@testing-library/react'
import { Router } from 'wouter'
import { memoryLocation } from 'wouter/memory-location'

const renderWithRouter = (
  ui: React.ReactElement,
  options?: RenderOptions & { initialEntries?: string[] }
) => {
  const { initialEntries, ...rest } = options ?? {}
  const { hook } = memoryLocation({ path: initialEntries?.[0] ?? '/' })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Router hook={hook}>{children}</Router>
  )
  return render(ui, { wrapper, ...rest })
}

export default renderWithRouter
