import { screen } from '@testing-library/react'
import renderWithRouter from 'src/test/renderWithRouter'
import Header from './Header'

it('renders navigation links', () => {
  renderWithRouter(<Header />)
  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /d3 projects/i })).toBeInTheDocument()
})
