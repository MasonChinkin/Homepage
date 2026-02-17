import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeaturedProjects from './FeaturedProjects'

it('renders featured project items', () => {
  render(
    <MemoryRouter>
      <FeaturedProjects />
    </MemoryRouter>
  )
  expect(screen.getByText(/reddit visualization/i)).toBeInTheDocument()
})
