import { render, screen } from '@testing-library/react'
import { Router } from 'wouter'
import FeaturedProjects from './FeaturedProjects'

it('renders featured project items', () => {
  render(
    <Router>
      <FeaturedProjects />
    </Router>
  )
  expect(screen.getByText(/reddit visualization/i)).toBeInTheDocument()
})
