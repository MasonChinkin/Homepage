import { render } from '@testing-library/react'
import { Router } from 'wouter'

vi.mock('./components/budget-sankey/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./BudgetSankey')
  render(
    <Router>
      <Component />
    </Router>
  )
})
