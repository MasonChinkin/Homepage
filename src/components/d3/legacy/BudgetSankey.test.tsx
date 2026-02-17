import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./components/budget-sankey/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./BudgetSankey')
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  )
})
