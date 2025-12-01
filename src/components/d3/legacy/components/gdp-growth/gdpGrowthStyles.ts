import { css } from '@emotion/react'

export const gdpGrowthStyles = css({
  '#gdp-container': {
    height: '75vh',
    width: '125vh',
    background: 'white',
  },

  '.hidden': {
    display: 'none',
  },

  '.axis': {
    strokeWidth: 1.5,
    pointerEvents: 'none',
  },

  '.axis text': {
    font: '16px arial',
  },

  '.textselected': {
    font: '16px arial',
    pointerEvents: 'none',
    textAnchor: 'start',
  },

  '#indivBars:hover': {
    stroke: 'black',
    strokeWidth: 3,
  },

  'div.tooltip': {
    position: 'absolute',
    textAlign: 'center',
    width: 'auto',
    height: 'auto',
    padding: '2px',
    font: '16px sans-serif',
    background: 'white',
    border: '0px',
    borderRadius: '8px',
    pointerEvents: 'none',
    color: 'black',
  },

  '#backButton': {
    cursor: 'pointer',

    rect: {
      fill: 'rgb(175, 240, 91)',
    },

    text: {
      fontFamily: 'Helvetica, sans-serif',
      fontWeight: 'bold',
      fontSize: '14px',
      fill: 'black',
    },

    '&:hover rect': {
      fill: 'rgb(26, 199, 194)',
    },

    '&:hover text': {
      fill: 'white',
    },
  },

  '.unclickable': {
    pointerEvents: 'none',
  },
})
