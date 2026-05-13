// This is early career code. Plz don't judge :)
// eslint-disable-next-line
// @ts-nocheck
import { select } from 'd3-selection'
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

  select('#subreddit-input')
    .on('change', () => sessionStorage.clear())
    .on('blur', () => sessionStorage.clear()) // change isn't triggering consistently for some reason

  select('#sort-input').on('change', dateRangeNeeded)

  select('.submit').on('click', () => visualize(drawBars))

  select('#bar-button').on('click', () => visualize(drawBars))

  select('#bubble-button').on('click', () => visualize(drawBubbles))

  select('#scatter-button').on('click', () => visualize(drawScatter))
}

export default initializeViz
