import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('d3')

it('renders D3 Template Project title', async () => {
  const { Component } = await import('./D3Template')
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  )
  expect(screen.getByText(/d3 template project/i)).toBeInTheDocument()
})
