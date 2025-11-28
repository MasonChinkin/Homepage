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

  [mediaQueries.tablet]: {
    flexDirection: 'column',
  },
})

export const featuredProjectItemWrapper = css({
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

  [mediaQueries.tablet]: {
    width: '80%',
    height: '33vh',
    margin: '1rem auto',
  },
})

export const featuredProjectItem = css({
  height: '100%',

  '&:hover': {
    div: {
      bottom: '-1%',
    },
  },
})

export const featuredProjectCaption = css({
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
})

export const featuredProjectItemImg = css({
  position: 'absolute',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 1,
  transition: `opacity ${hoverTransitionTime}`,
})

export const featuredProjectItemImgHover = css({
  '&:hover': {
    opacity: 0,

    [mediaQueries.phone]: {
      opacity: 1,
    },
  },
})

export const featuredProjectItemWebp = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})
