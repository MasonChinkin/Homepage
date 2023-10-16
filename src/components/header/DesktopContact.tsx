const DesktopContact = () => {
  const email = 'mason.chinkin@gmail.com'
  const subject = 'Hi Mason'
  const body = "I would like to hire you and pay you lots o' money!"

  const mailTo = `mailto:${email}?subject=${subject}&body=${body}`

  return (
    <section className="desktop-social-links">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.linkedin.com/in/mason-chinkin/"
      >
        <i className="fab fa-linkedin" /> <span>LinkedIn</span>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/MasonChinkin"
      >
        <i className="fab fa-github" /> <span>Github</span>
      </a>
      <a target="_blank" rel="noopener noreferrer" href={mailTo}>
        <i className="fas fa-envelope" /> <span>Email</span>
      </a>
    </section>
  )
}

export default DesktopContact
