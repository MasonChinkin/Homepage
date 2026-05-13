import { css, keyframes } from '@emotion/react'
import { shadowsSmall, shadowsMedium, shadowsBig } from './starsData.generated'

const areaSizeY = 3384

const animStar = keyframes`
  from { transform: translateY(0px); }
  to { transform: translateY(-${areaSizeY}px); }
`

export const starsSmall = css({
  width: '1px',
  height: '1px',
  background: 'transparent',
  boxShadow: shadowsSmall,
  animation: `${animStar} 150s linear infinite`,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: `${areaSizeY}px`,
    width: '1px',
    height: '1px',
    background: 'transparent',
    boxShadow: shadowsSmall,
  },
})

export const starsMedium = css({
  width: '2px',
  height: '2px',
  background: 'transparent',
  boxShadow: shadowsMedium,
  animation: `${animStar} 300s linear infinite`,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: `${areaSizeY}px`,
    width: '2px',
    height: '2px',
    background: 'transparent',
    boxShadow: shadowsMedium,
  },
})

export const starsBig = css({
  width: '3px',
  height: '3px',
  background: 'transparent',
  boxShadow: shadowsBig,
  animation: `${animStar} 450s linear infinite`,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: `${areaSizeY}px`,
    width: '3px',
    height: '3px',
    background: 'transparent',
    boxShadow: shadowsBig,
  },
})
