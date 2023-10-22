import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const MobileContact = () => {
  const [open, setOpen] = useState<boolean>(false)

  const email = 'mason.chinkin@gmail.com'
  const subject = 'Hi Mason'
  const body = "I would like to hire you and payscoy you lots o' money!"

  const mailTo = `mailto:${email}?subject=${subject}&body=${body}`

  return (
    <>
      <Button
        variant="info"
        className="mobile-contact-button"
        onClick={(): void => setOpen(true)}
      >
        Contact
      </Button>

      <Modal
        show={open}
        onHide={(): void => setOpen(false)}
        size="sm"
        className="mobile-contact-modal"
        centered
      >
        <Modal.Title>Contact Me</Modal.Title>
        <Modal.Body className="mobile-social-links">
          <Button variant="outline-primary">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/mason-chinkin/"
            >
              <i className="fab fa-linkedin" /> <span>LinkedIn</span>
            </a>
          </Button>
          <Button variant="outline-primary">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/MasonChinkin"
            >
              <i className="fab fa-github" /> <span>Github</span>
            </a>
          </Button>
          <Button variant="outline-primary">
            <a target="_blank" rel="noopener noreferrer" href={mailTo}>
              <i className="fas fa-envelope" /> <span>Email</span>
            </a>
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={(): void => setOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MobileContact
