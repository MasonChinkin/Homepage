import { render } from '@testing-library/react'
import { socialLinks } from './contactConstants'

describe('socialLinks', () => {
  it('exposes an Icon component for each link', () => {
    expect(socialLinks).toHaveLength(3)
    socialLinks.forEach((link) => {
      expect(typeof link.Icon).toBe('function')
      const { container } = render(<link.Icon aria-label={link.label} />)
      expect(container.querySelector('svg')).not.toBeNull()
    })
  })

  it('no longer exposes the legacy `icon` string field', () => {
    socialLinks.forEach((link) => {
      expect((link as unknown as { icon?: string }).icon).toBeUndefined()
    })
  })
})
