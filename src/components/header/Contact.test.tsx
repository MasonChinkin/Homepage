import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DesktopContact from './DesktopContact'
import MobileContact from './MobileContact'

describe('DesktopContact', () => {
  it('renders social links', () => {
    render(<DesktopContact />)
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument()
  })
})

describe('MobileContact', () => {
  it('opens modal when Contact button is clicked', async () => {
    const user = userEvent.setup()
    render(<MobileContact />)
    // The contact button is hidden on desktop via CSS; use hidden:true to find it
    await user.click(
      screen.getByRole('button', { name: /contact/i, hidden: true })
    )
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<MobileContact />)
    await user.click(
      screen.getByRole('button', { name: /contact/i, hidden: true })
    )
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(
      screen.queryByRole('link', { name: /linkedin/i })
    ).not.toBeInTheDocument()
  })
})
