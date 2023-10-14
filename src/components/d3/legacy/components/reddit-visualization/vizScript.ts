import * as d3 from 'd3'
import { drawBars } from './utils/bars'
import { drawBubbles } from './utils/bubbles'
import { drawScatter } from './utils/scatter'
import { dateRangeNeeded } from './utils/utils'
import { visualize } from './utils/visualize'

const initializeViz = () => {
  sessionStorage.clear()

  document.querySelectorAll('.clear-local').forEach((el) => {
    el.addEventListener('change', () => sessionStorage.clear())
  })

  d3.select('#subreddit-input')
    .on('change', () => sessionStorage.clear())
    .on('blur', () => sessionStorage.clear()) // change isn't triggering consistently for some reason

  d3.select('#sort-input').on('change', dateRangeNeeded)

  d3.select('.submit').on('click', () => visualize(drawBars))

  d3.select('#bar-button').on('click', () => visualize(drawBars))

  d3.select('#bubble-button').on('click', () => visualize(drawBubbles))

  d3.select('#scatter-button').on('click', () => visualize(drawScatter))
}

export default initializeViz
