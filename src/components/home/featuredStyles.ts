import { css } from '@emotion/react'
import { colors, mediaQueries } from 'src/styles/theme'

const hoverTransitionTime = '0.6s'

export const featuredContainer = css({
  [mediaQueries.mobile]: {
    h2: {
      margin: '1.5rem 0 0 0',
    },
  },
})

export const featuredProjects = css({
  display: 'flex',
  justifyContent: 'space-between',

  '.featured-project-item-wrapper': {
    position: 'relative',
    width: '32%',
    borderRadius: '0.25rem',
    height: '35vh',
    minHeight: '400px',
    overflow: 'hidden',
    cursor: 'pointer',

    [mediaQueries.phone]: {
      minHeight: '280px',
    },
  },

  '.featured-project-item': {
    height: '100%',

    '&:hover': {
      '.featured-project-caption': {
        bottom: '-1%',
      },
    },

    '.featured-project-caption': {
      position: 'absolute',
      bottom: '-20%',
      left: 0,
      right: 0,
      minHeight: '30%',
      boxShadow: 'inset 0 0 2000px rgba(255, 255, 255, 0.1)',
      transition: `bottom ${hoverTransitionTime}`,
      background: 'rgba(0, 0, 0, 0.7)',
      pointerEvents: 'none',

      [mediaQueries.phone]: {
        height: '45%',
        bottom: '-1%',
      },

      h3: {
        margin: 0,
        color: colors.white,
        minHeight: '33%',
        padding: '0.5rem',
        fontSize: '1.5rem',
      },

      p: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 0,
        padding: '0.5rem',
        color: colors.white,
        height: '67%',
      },
    },
  },

  '.featured-project-item-img': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 1,
    transition: `opacity ${hoverTransitionTime}`,
  },

  '.featured-project-item-img-hover:hover': {
    opacity: 0,

    [mediaQueries.phone]: {
      opacity: 1,
    },
  },

  '.featured-project-item-webp': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  [mediaQueries.tablet]: {
    flexDirection: 'column',

    '.featured-project-item-wrapper': {
      width: '80%',
      height: '33vh',
      margin: '1rem auto',
    },
  },
})
