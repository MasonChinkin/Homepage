import { render, screen } from '@testing-library/react'
import AboutImg from './AboutImg'

it('renders an image', () => {
  render(<AboutImg />)
  expect(screen.getByRole('img')).toBeInTheDocument()
})
