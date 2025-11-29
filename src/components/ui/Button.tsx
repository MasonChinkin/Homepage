import { css } from '@emotion/react'
import { colors } from 'src/styles/theme'

type ButtonVariant = 'primary' | 'secondary' | 'info' | 'outline-primary'

type ButtonProps = {
  variant?: ButtonVariant
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const buttonBaseStyles = css({
  padding: '0.375rem 0.75rem',
  fontSize: '1rem',
  lineHeight: 1.5,
  borderRadius: '0.25rem',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.15s ease-in-out',
  fontWeight: 400,
  textAlign: 'center',
  verticalAlign: 'middle',
  userSelect: 'none',
  display: 'inline-block',

  '&:focus': {
    outline: '0',
    boxShadow: '0 0 0 0.2rem rgba(130, 138, 145, 0.5)',
  },

  '&:disabled': {
    opacity: 0.65,
    cursor: 'not-allowed',
  },
})

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css({
    color: colors.white,
    backgroundColor: '#007bff',
    borderColor: '#007bff',

    '&:hover:not(:disabled)': {
      backgroundColor: '#0056b3',
      borderColor: '#004085',
    },

    '&:active:not(:disabled)': {
      backgroundColor: '#004085',
      borderColor: '#003766',
    },

    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(38, 143, 255, 0.5)',
    },
  }),

  secondary: css({
    color: colors.white,
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',

    '&:hover:not(:disabled)': {
      backgroundColor: '#5a6268',
      borderColor: '#545b62',
    },

    '&:active:not(:disabled)': {
      backgroundColor: '#545b62',
      borderColor: '#4e555b',
    },

    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(130, 138, 145, 0.5)',
    },
  }),

  info: css({
    color: colors.white,
    backgroundColor: '#17a2b8',
    borderColor: '#17a2b8',

    '&:hover:not(:disabled)': {
      backgroundColor: '#138496',
      borderColor: '#117a8b',
    },

    '&:active:not(:disabled)': {
      backgroundColor: '#117a8b',
      borderColor: '#10707f',
    },

    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(58, 176, 195, 0.5)',
    },
  }),

  'outline-primary': css({
    color: '#5dade2',
    backgroundColor: 'transparent',
    borderColor: '#5dade2',

    '&:hover:not(:disabled)': {
      color: colors.white,
      backgroundColor: '#5dade2',
      borderColor: '#5dade2',
    },

    '&:active:not(:disabled)': {
      color: colors.white,
      backgroundColor: '#3498db',
      borderColor: '#3498db',
    },

    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(93, 173, 226, 0.5)',
    },
  }),
}

const Button = ({
  variant = 'primary',
  onClick,
  children,
  className,
}: ButtonProps) => (
  <button
    css={[buttonBaseStyles, variantStyles[variant]]}
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
)

export default Button
