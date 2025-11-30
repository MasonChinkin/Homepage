import { useEffect, useState } from 'react'
import Button from 'src/components/ui/Button'
import {
  mobileContactButton,
  modalContent,
  mobileContactModal,
  mobileSocialLinks,
  modalTitle,
  modalFooter,
  dialogOverlay,
  dialogContent,
} from './headerStyles'

const MobileContact = () => {
  const [open, setOpen] = useState<boolean>(false)

  const email = 'mason.chinkin@gmail.com'
  const subject = 'Hi Mason'
  const body = "I would like to hire you and payscoy you lots o' money!"

  const mailTo = `mailto:${email}?subject=${subject}&body=${body}`

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div css={mobileContactButton}>
        <Button variant="info" onClick={(): void => setOpen(true)}>
          Contact
        </Button>
      </div>

      {open && (
        <>
          <div
            css={dialogOverlay}
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <div
            css={[dialogContent, mobileContactModal]}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div css={modalContent}>
              <h2 id="modal-title" css={modalTitle}>
                Contact Me
              </h2>
              <div css={mobileSocialLinks}>
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
              </div>
              <div css={modalFooter}>
                <Button
                  variant="secondary"
                  onClick={(): void => setOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default MobileContact
