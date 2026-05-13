import { render } from '@testing-library/react'
import {
  Github,
  LinkedIn,
  Mail,
  ArrowLeft,
  LongArrowLeft,
  Moon,
  Sun,
  ChartBar,
} from './index'

const icons = [
  { name: 'Github', Icon: Github, label: 'GitHub' },
  { name: 'LinkedIn', Icon: LinkedIn, label: 'LinkedIn' },
  { name: 'Mail', Icon: Mail, label: 'Email' },
  { name: 'ArrowLeft', Icon: ArrowLeft, label: 'Back' },
  { name: 'LongArrowLeft', Icon: LongArrowLeft, label: 'Back' },
  { name: 'Moon', Icon: Moon, label: 'Dark mode' },
  { name: 'Sun', Icon: Sun, label: 'Light mode' },
  { name: 'ChartBar', Icon: ChartBar, label: 'Bar chart' },
] as const

describe('icons', () => {
  icons.forEach(({ name, Icon, label }) => {
    it(`renders ${name} with accessible label`, () => {
      const { getByRole } = render(<Icon aria-label={label} />)
      const svg = getByRole('img', { name: label })
      expect(svg.tagName.toLowerCase()).toBe('svg')
    })
  })

  it('accepts className and inline styles', () => {
    const { getByRole } = render(
      <Github aria-label="gh" className="custom" style={{ color: 'red' }} />
    )
    const svg = getByRole('img', { name: 'gh' })
    expect(svg).toHaveClass('custom')
    expect(svg).toHaveStyle({ color: 'red' })
  })
})
