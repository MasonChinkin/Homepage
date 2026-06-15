import { useEffect, useState } from 'react'
import Button from 'src/components/ui/Button'
import { socialLinks } from './contactConstants'
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
                {socialLinks.map(({ href, Icon, label }) => (
                  <Button key={label} variant="outline-primary">
                    <a target="_blank" rel="noopener noreferrer" href={href}>
                      <Icon aria-label={label} /> <span>{label}</span>
                    </a>
                  </Button>
                ))}
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
