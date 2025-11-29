import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div css={mobileContactButton}>
          <Button variant="info" onClick={(): void => setOpen(true)}>
            Contact
          </Button>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay css={dialogOverlay} />
        <Dialog.Content css={[dialogContent, mobileContactModal]}>
          <div css={modalContent}>
            <Dialog.Title css={modalTitle}>Contact Me</Dialog.Title>
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
              <Button variant="secondary" onClick={(): void => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default MobileContact
