import { socialLinks } from './contactConstants'
import { desktopSocialLinks } from './headerStyles'

const DesktopContact = () => (
  <section css={desktopSocialLinks}>
    {socialLinks.map(({ href, Icon, label }) => (
      <a key={label} target="_blank" rel="noopener noreferrer" href={href}>
        <Icon aria-label={label} /> <span>{label}</span>
      </a>
    ))}
  </section>
)

export default DesktopContact
