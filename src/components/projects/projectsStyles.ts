import { css } from '@emotion/react'
import { colors, mediaQueries } from 'src/styles/theme'

export const projectsWrapper = css({
  width: '80vw',
})

export const projects = {
  base: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
    justifyItems: 'center',
    alignContent: 'center',
    marginTop: '4rem',

    [mediaQueries.phone]: {
      display: 'block',
      marginTop: '6rem',
    },

    '.card': {
      backgroundColor: 'silver',
      width: '95%',
      maxWidth: '300px',
      marginBottom: '2rem',
      boxShadow: '0 0 8px rgba(255, 255, 255, 0.1)',
      bottom: 0,
      border: 'none',
      transition: 'box-shadow 0.3s, bottom 0.3s',

      '&:hover': {
        bottom: '10px',
        boxShadow: '0 10px 20px rgba(255, 255, 255, 0.4)',
      },

      [mediaQueries.phone]: {
        margin: '1rem auto',
        width: '85%',
      },

      '.card-body': {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: '0.6rem',
      },

      '.card-text': {
        fontSize: '0.9rem',
        lineHeight: '1.05rem',
        pointerEvents: 'none',
        color: 'black',
        margin: '0.5rem 0',
      },

      '.card-title': {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        margin: 0,
        marginBottom: '0.5rem',
        pointerEvents: 'none',
      },

      '.card-img': {
        height: '180px',
        objectFit: 'cover',
      },

      a: {
        color: colors.white,
        textDecoration: 'none',

        '&:hover': {
          textDecoration: 'none',
        },
      },

      '.card-links': {
        display: 'flex',

        button: {
          margin: '0.6rem 1rem 0 0',
        },

        [mediaQueries.mobile]: {
          flexDirection: 'row-reverse',

          button: {
            margin: '0.6rem 0 0 1rem',
          },
        },
      },
    },
  }),

  marginsOnly: css({
    display: 'flex',

    '.card': {
      marginRight: '1rem',

      [mediaQueries.phone]: {
        margin: '1rem auto',
      },
    },

    [mediaQueries.phone]: {
      display: 'block',
    },
  }),
}
