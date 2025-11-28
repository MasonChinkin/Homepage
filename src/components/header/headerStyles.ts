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

    a: {
      margin: '0 0.5rem',
      padding: '1rem 1.5rem',
      color: colors.gray,
      fontSize: 'large',

      '&:hover': {
        color: colors.lightGray,
        textDecoration: 'none',
      },

      '&.selected': {
        color: colors.white,
        borderBottom: `solid ${colors.white} 3px`,
      },

      [mediaQueries.phone]: {
        margin: 0,
        padding: '0.5rem',
        textAlign: 'center',
        width: 'min-content',
      },
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

  '.mobile-social-links': {
    display: 'flex',
    flexDirection: 'column',

    '.btn': {
      margin: '0 2rem 1rem',

      '&:active, &:hover *': {
        color: colors.white,
      },
    },

    '.btn:last-child': {
      margin: '0 1rem 0',
    },
  },

  '.modal-title': {
    color: '#6c757d',
    margin: '1rem auto',
  },

  '.modal-body': {
    padding: '0 1rem',
  },

  '.modal-footer': {
    borderTop: 'none',
    padding: 0,
    margin: '0 0.5rem 0.5rem 0',
  },
})

export const mobileContactModal = css({
  '& > *': {
    maxWidth: '300px',
    margin: 'auto',
  },
})
