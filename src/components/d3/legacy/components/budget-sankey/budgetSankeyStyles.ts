import { css } from '@emotion/react'

export const budgetSankeyStyles = css({
  // Sankey styles
  '.node rect': {
    fillOpacity: 0.9,
    shapeRendering: 'crispEdges',
  },

  '.node text': {
    pointerEvents: 'none',
    textShadow: '0px 0px 2px #fff',
    fontWeight: 1000,
  },

  '.link': {
    fill: 'none',
    stroke: '#000',
    strokeOpacity: 0.4,
  },

  '.nodeRect': {
    fill: 'lightgray',
    opacity: 0.5,
    stroke: 'black',
  },

  '.nodePercent': {
    textAnchor: 'middle',
    fontSize: 16,
  },

  '.percent': {
    fontSize: 20,
    fontWeight: 'bold',
  },

  '.deficitLabel': {
    textAnchor: 'middle',
    fontSize: 28,
    fontWeight: 'bold',
  },

  // Bar summary styles
  '#line': {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 3,
  },

  '.bar-labels': {
    fontSize: 16,
    fontWeight: 'bold',
    textAnchor: 'middle',
  },

  // Line charts styles
  '.line': {
    fill: 'none',
    strokeWidth: '3px',
    opacity: 0.3,
  },

  '.thisYearLine line': {
    fill: 'none',
    stroke: 'steelblue',
    strokeWidth: 1,
    opacity: 0.5,
  },

  '.revAxis, .spendAxis': {
    fontSize: '12px',
    fontWeight: 'bold',

    '& .domain': {
      opacity: 0,
    },
  },

  '.thisYearLine text': {
    fontSize: '14px',
    textAnchor: 'middle',
    fontWeight: 'bold',
    opacity: 0,
  },

  '.lineNode path': {
    opacity: 0.2,
  },

  '.lineTitle': {
    fontSize: '20px',
    fontWeight: 'bold',
    textAnchor: 'middle',
  },

  '.lineLabel': {
    textAnchor: 'middle',
    fontSize: '14px',
    fill: 'black',
    fontWeight: 'bold',
  },

  // Visualization container
  '#visualization-container': {
    background: 'white',
    width: '90vw',
    height: 'auto',
    margin: '10px 0 50px 0',
  },
})
