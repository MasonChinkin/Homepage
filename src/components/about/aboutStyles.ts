import { css } from '@emotion/react'
import { mediaQueries } from 'src/styles/theme'

export const aboutContainer = css({
  width: '80vw',
  maxWidth: '1050px',
  marginBottom: '5rem',
  paddingTop: '1rem',
  marginTop: '3rem',

  '.about-me': {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  '.about-img': {
    alignSelf: 'center',
    maxWidth: '100%',
    maxHeight: '350px',
    marginBottom: '1.5rem',
    borderRadius: '10px',

    '&.loading-img': {
      height: '25.5vw',

      [mediaQueries.phone]: {
        height: '58vw',
      },
    },
  },

  [mediaQueries.mobile]: {
    marginTop: '4rem',
    width: '95% !important',
  },

  ul: {
    margin: '1rem 0',

    '& > *:first-child': {
      marginBottom: '0.5rem',
    },
  },
})
