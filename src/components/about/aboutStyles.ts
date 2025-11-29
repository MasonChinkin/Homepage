import { css } from '@emotion/react'
import { mediaQueries } from 'src/styles/theme'

export const aboutContainer = css({
  width: '80vw',
  maxWidth: '1050px',
  marginBottom: '5rem',
  paddingTop: '1rem',
  marginTop: '3rem',

  [mediaQueries.mobile]: {
    marginTop: '4rem',
    width: '95% !important',
  },

  ul: {
    margin: '1rem 0',

    '& > *:first-of-type': {
      marginBottom: '0.5rem',
    },
  },
})

export const aboutSection = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

export const aboutImg = css({
  alignSelf: 'center',
  maxWidth: '100%',
  maxHeight: '350px',
  marginBottom: '1.5rem',
  borderRadius: '10px',
})

export const aboutImgLoading = css({
  height: '25.5vw',

  [mediaQueries.phone]: {
    height: '58vw',
  },
})
