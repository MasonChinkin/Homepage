// This is early career code. Plz don't judge :)
// eslint-disable-next-line
// @ts-nocheck
import * as d3 from 'd3'
import { newData } from './utils/utils'
import { drawBars } from './utils/bars'
import { drawSlider } from './utils/slider'
import { drawLines } from './utils/lines'
import { drawSankey, drawDeficit } from './utils/sankey'

const initializeViz = () => {
  const drawDashboard = () => {
    d3.select('#visualization-container').selectAll('svg').remove()

    // Load CSV files from public directory
    d3.csv('data/budgetSankey/us-budget-sankey-main.csv').then((csv) => {
      d3.csv('data/budgetSankey/us-budget-sankey-deficit.csv').then(
        (deficit) => {
          d3.csv('data/budgetSankey/us-budget-sankey-bars.csv').then(
            (barData) => {
              newData(csv, deficit, window.thisYear)
              drawBars(barData)
              drawSankey()
              drawDeficit()
              drawSlider()
              drawLines()
            }
          )
        }
      )
    })
  }

  drawDashboard()
}

export default initializeViz
