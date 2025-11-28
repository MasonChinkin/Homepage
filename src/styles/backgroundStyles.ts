import { css, keyframes } from '@emotion/react'

// Generate box shadows for stars
const generateStars = (count: number): string => {
  const areaSizeX = 6016
  const areaSizeY = 3384
  const stars: string[] = []

  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * areaSizeX)
    const y = Math.floor(Math.random() * areaSizeY)
    stars.push(`${x}px ${y}px #FFF`)
  }

  return stars.join(', ')
}

const shadowsSmall = generateStars(1000)
const shadowsMedium = generateStars(400)
const shadowsBig = generateStars(200)

const areaSizeY = 3384

const animStar = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-${areaSizeY}px);
  }
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
