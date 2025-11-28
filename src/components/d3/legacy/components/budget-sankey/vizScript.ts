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

    const defaultYear = 2017

    // Load CSV files from public directory
    d3.csv('data/budgetSankey/us-budget-sankey-main.csv').then((csv) => {
      d3.csv('data/budgetSankey/us-budget-sankey-deficit.csv').then(
        (deficit) => {
          d3.csv('data/budgetSankey/us-budget-sankey-bars.csv').then(
            (barData) => {
              const data = newData(csv, deficit, defaultYear)

              const { rects } = drawBars(barData, defaultYear)
              const { revLineX, spendLineX, lineY } = drawLines(data.lineData, defaultYear)
              const { sankey, sankeySvg, node, sankeyWidth, sankeyHeight } = drawSankey(
                data.nodes,
                data.links,
                data.thisYearDeficit,
                data.lineData,
                defaultYear,
                revLineX,
                spendLineX,
                lineY
              )
              drawDeficit(sankey, sankeySvg, data.thisYearDeficit, sankeyWidth, sankeyHeight)
              drawSlider(rects, sankey, sankeySvg, node, revLineX, spendLineX, lineY, data.lineData)
            }
          )
        }
      )
    })
  }

  drawDashboard()
}

export default initializeViz
