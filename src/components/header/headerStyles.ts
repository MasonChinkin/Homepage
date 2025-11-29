import { css, keyframes } from '@emotion/react'
import { colors, mediaQueries, animations } from 'src/styles/theme'

const slideInFromAbove = keyframes`
  from {
    top: -6rem;
  }
  to {
    top: 0;
  }
`

const slideInFromLeft = keyframes`
  from {
    left: -6rem;
  }
  to {
    left: 0;
  }
`

export const navLinks = {
  base: css({
    display: 'flex',
    position: 'relative',
    animation: `${slideInFromAbove} ${animations.slideInDuration}`,
    justifyContent: 'center',
    alignItems: 'center',
    height: '6rem',
    width: 'fit-content',
    margin: 'auto',
    paddingBottom: '2rem',
    transition: `all ${animations.transitionDuration}, background-color ${animations.longTransitionDuration}`,

    '&:hover': {
      paddingBottom: 0,
    },

    [mediaQueries.phone]: {
      justifyContent: 'space-around',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      width: '100%',
      animation: 'none',
      height: '4rem',
      paddingBottom: 0,
      zIndex: 1,
    },
  }),

  withBackground: css({
    backgroundColor: colors.background,
  }),
}

export const navLink = css({
  margin: '0 0.5rem',
  padding: '1rem 1.5rem',
  color: colors.gray,
  fontSize: 'large',

  '&:hover': {
    color: colors.lightGray,
    textDecoration: 'none',
  },

  [mediaQueries.phone]: {
    margin: 0,
    padding: '0.5rem',
    textAlign: 'center',
    width: 'min-content',
  },
})

export const navLinkSelected = css({
  color: colors.white,
  borderBottom: `solid ${colors.white} 3px`,
})

export const desktopSocialLinks = css({
  animation: `${slideInFromLeft} ${animations.slideInDuration}`,
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '3rem',
  zIndex: 10,

  [mediaQueries.mobile]: {
    display: 'none',
  },

  a: {
    color: colors.lightskyblue,
    padding: '1rem',
    fontSize: 'larger',

    i: {
      marginRight: '0.5rem',
    },

    span: {
      opacity: 0,
      position: 'relative',
      left: '-2rem',
      transition: `all 0.2s`,
    },

    '&:hover': {
      textDecoration: 'none',

      span: {
        opacity: 1,
        left: 0,
      },
    },
  },
})

export const mobileContactButton = css({
  display: 'none',
  position: 'fixed',
  right: 0,
  bottom: 0,
  margin: '0 1rem 1rem 0',
  zIndex: 1,

  [mediaQueries.mobile]: {
    display: 'block',
  },
})

export const modalContent = css({
  margin: '0 2rem',
})

export const mobileSocialLinks = css({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 1rem',
  gap: '1rem',

  button: {
    width: '100%',
    backgroundColor: '#3498db',
    borderColor: '#3498db',
    color: colors.white,

    '&:hover:not(:disabled)': {
      backgroundColor: '#5dade2',
      borderColor: '#5dade2',
    },

    '&:active:not(:disabled)': {
      backgroundColor: '#2980b9',
      borderColor: '#2980b9',
    },

    '&:active, &:hover *': {
      color: colors.white,
    },

    a: {
      color: colors.white,
      textDecoration: 'none',

      '&:hover': {
        color: colors.white,
      },
    },
  },
})

export const modalTitle = css({
  color: colors.lightGray,
  margin: '1rem auto 2rem auto',
})

export const modalFooter = css({
  borderTop: 'none',
  padding: 0,
  marginTop: '2rem',
  marginBottom: '1.5rem',
  display: 'flex',
  justifyContent: 'flex-end',

  button: {
    width: 'auto',
    backgroundColor: '#95a5a6',
    borderColor: '#95a5a6',

    '&:hover:not(:disabled)': {
      backgroundColor: '#b0bec5',
      borderColor: '#b0bec5',
    },

    '&:active:not(:disabled)': {
      backgroundColor: '#7f8c8d',
      borderColor: '#7f8c8d',
    },
  },
})

export const mobileContactModal = css({
  '& > *': {
    maxWidth: '300px',
    margin: 'auto',
  },
})

export const dialogOverlay = css({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  position: 'fixed',
  inset: 0,
  zIndex: 1040,
  animation: 'fadeIn 150ms ease-out',

  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
})

export const dialogContent = css({
  backgroundColor: '#2c3e50',
  borderRadius: '0.3rem',
  boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.5)',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '300px',
  maxHeight: '85vh',
  padding: 0,
  zIndex: 1050,
  animation: 'fadeIn 150ms ease-out',

  '&:focus': {
    outline: 'none',
  },
})
