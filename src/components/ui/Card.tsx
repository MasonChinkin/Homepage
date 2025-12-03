import { css } from '@emotion/react'

type CardProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

type CardBodyProps = {
  children: React.ReactNode
  className?: string
}

type CardImgProps = {
  src: string
  onLoad?: () => void
  className?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
}

type CardTitleProps = {
  children: React.ReactNode
  className?: string
}

type CardTextProps = {
  children: React.ReactNode
  className?: string
}

const cardStyles = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  wordWrap: 'break-word',
  backgroundColor: '#fff',
  backgroundClip: 'border-box',
  border: '1px solid rgba(0, 0, 0, 0.125)',
  borderRadius: '0.25rem',
})

const cardBodyStyles = css({
  flex: '1 1 auto',
  padding: '1.25rem',
})

const cardTitleStyles = css({
  marginBottom: '0.75rem',
})

const cardTextStyles = css({
  marginTop: 0,
  marginBottom: '1rem',

  '&:last-child': {
    marginBottom: 0,
  },
})

const cardImgStyles = css({
  width: '100%',
  borderTopLeftRadius: 'calc(0.25rem - 1px)',
  borderTopRightRadius: 'calc(0.25rem - 1px)',
})

const Card = ({ children, className, onClick }: CardProps) => (
  <div css={cardStyles} className={className} onClick={onClick}>
    {children}
  </div>
)

const CardImg = ({
  src,
  onLoad,
  className,
  loading,
  decoding,
}: CardImgProps) => (
  <img
    css={cardImgStyles}
    src={src}
    onLoad={onLoad}
    className={className}
    loading={loading}
    decoding={decoding}
  />
)

const CardBody = ({ children, className }: CardBodyProps) => (
  <div css={cardBodyStyles} className={className}>
    {children}
  </div>
)

const CardTitle = ({ children, className }: CardTitleProps) => (
  <h5 css={cardTitleStyles} className={className}>
    {children}
  </h5>
)

const CardText = ({ children, className }: CardTextProps) => (
  <p css={cardTextStyles} className={className}>
    {children}
  </p>
)

Card.Img = CardImg
Card.Body = CardBody
Card.Title = CardTitle
Card.Text = CardText

export default Card
