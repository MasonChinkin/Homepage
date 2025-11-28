import { css } from '@emotion/react'
import { colors, mediaQueries, animations } from './theme'

export const heightTransitionWrapper = css({
  minHeight: '91vh',

  [mediaQueries.mobile]: {
    minHeight: 0,
  },
})

export const loadingImg = css({
  animationDuration: animations.shimmerDuration,
  animationFillMode: 'forwards',
  animationIterationCount: 'infinite',
  animationName: 'placeHolderShimmer',
  animationTimingFunction: 'linear',
  backgroundColor: colors.loadingGray,
  backgroundImage: `linear-gradient(
    to right,
    ${colors.loadingGray} 0%,
    ${colors.loadingGrayDark} 20%,
    ${colors.loadingGray} 40%,
    ${colors.loadingGray} 100%
  )`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '2000px 1000px',
  position: 'relative',
  objectPosition: '-99999px 99999px',
})

export const frostedStyle = css({
  boxShadow: 'inset 0 0 2000px rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(2px)',
  borderRadius: '10px',
  padding: '1.5rem',

  [mediaQueries.mobile]: {
    padding: '1rem',
  },
})
