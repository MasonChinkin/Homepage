import { socialLinks } from './contactConstants'
import { desktopSocialLinks } from './headerStyles'

const DesktopContact = () => (
  <section css={desktopSocialLinks}>
    {socialLinks.map(({ href, icon, label }) => (
      <a key={label} target="_blank" rel="noopener noreferrer" href={href}>
        <i className={icon} /> <span>{label}</span>
      </a>
    ))}
  </section>
)

export default DesktopContact
