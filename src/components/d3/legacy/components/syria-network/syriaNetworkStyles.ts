import { css } from '@emotion/react'

export const syriaNetworkStyles = css({
  '.link': {
    fill: 'none',
    stroke: 'blue',
    strokeWidth: '1.5px',
  },

  '.link.Enemy': {
    stroke: 'red',
  },

  '.nodeLabel': {
    textAnchor: 'middle',
    fontWeight: 'bold',
    pointerEvents: 'none',
    fontSize: '15px',
  },

  '.labelText': {
    font: '16px arial',
    pointerEvents: 'none',
    textAnchor: 'start',
    color: 'black',
  },

  b: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },

  '#container': {
    width: '780px',
    height: '560px',
    background: 'white',
    marginBottom: '6vh',
    margin: '0 auto',
  },
})
