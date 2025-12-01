import { css } from '@emotion/react'

export const congressMapStyles = css({
  '#container': {
    height: '75vh',
    width: '120vh',
    background: 'white',
    margin: '0 auto',
  },

  'div.tooltip': {
    position: 'absolute',
    textAlign: 'left',
    display: 'table',
    width: 'auto',
    height: 'auto',
    padding: '2px',
    font: '16px arial',
    background: 'white',
    border: '0px',
    borderRadius: '8px',
    pointerEvents: 'none',
    color: 'black',
  },

  '.tooltip p': {
    margin: 0,
    fontFamily: 'arial',
    fontSize: '16px',
    lineHeight: '20px',
    textAlign: 'left',
    color: 'black',
  },

  '.tooltip strong': {
    margin: 0,
    fontFamily: 'arial',
    fontSize: '20px',
    lineHeight: '20px',
    textAlign: 'left',
    color: 'black',
    fontWeight: 'bold',
  },

  '.legend': {
    margin: 0,
    fontFamily: 'arial',
    fontSize: '14px',
    textAlign: 'left',
    color: 'black',
    pointerEvents: 'none',
  },
})
