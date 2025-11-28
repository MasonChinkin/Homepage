import { css } from '@emotion/react'
import { mediaQueries } from 'src/styles/theme'

export const homeContainer = css({
  width: '80vw',
})

export const introContainer = css({
  display: 'flex',
  width: 'fit-content',
  maxWidth: '800px',
  height: '320px',
  margin: '0 auto 2rem',
  justifyContent: 'space-between',

  [mediaQueries.tablet]: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    margin: '4em auto 1rem auto',
    width: '95%',
    height: 'initial',

    h1: {
      marginBottom: '0.5rem',
    },
  },
})

export const avatarImg = css({
  marginLeft: '10px',
  borderRadius: '50%',
  width: '45%',

  [mediaQueries.tablet]: {
    marginLeft: 0,
    marginBottom: '0.5rem',
  },
})

export const introText = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  maxWidth: '420px',
  paddingRight: '5px',
})
