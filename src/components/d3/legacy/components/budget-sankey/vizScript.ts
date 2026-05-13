import { extent, group, max } from 'd3-array'
import { axisBottom } from 'd3-axis'
import { csv } from 'd3-fetch'
import { format as d3Format } from 'd3-format'
import {
  type ScaleBand,
  type ScaleLinear,
  scaleBand,
  scaleLinear,
} from 'd3-scale'
import { type Selection, select, selectAll } from 'd3-selection'
import {
  type Series,
  type SeriesPoint,
  line as d3Line,
  stack as d3Stack,
  stackOffsetDiverging,
} from 'd3-shape'
import { sliderHorizontal } from 'd3-simple-slider'
import 'd3-transition'
import { d3sankey } from './d3sankey'
import type {
  BudgetDataRow,
  DeficitDataRow,
  BarDataRow,
  SankeyNode,
  SankeyLink,
  VizState,
} from './types'
import {
  newData,
  fontScale,
  format,
  newYearTransition,
  highlightTransition,
  highlight,
  stackMin,
  stackMax,
  formatNumber,
} from './utils'

// Global state
const vizState: VizState = {
  thisYear: 2017,
  nodes: [],
  links: [],
  lineData: [],
  thisYearDeficit: [],
}

// Scale references for highlight function
let revLineX: ScaleBand<number>
let spendLineX: ScaleBand<number>
let lineY: ScaleLinear<number, number>

// D3 selections
let sankeySvg: Selection<SVGGElement, unknown, HTMLElement, any>
let sankey: ReturnType<typeof d3sankey>
let node: Selection<SVGGElement, SankeyNode, SVGGElement, unknown>
let rects: Selection<
  SVGRectElement,
  SeriesPoint<BarDataRow>,
  SVGGElement,
  Series<BarDataRow, string>
>

// Container dimensions
let sankeyContainer: HTMLElement
let barsContainer: HTMLElement
let linesContainer: HTMLElement

const initializeViz = () => {
  sankeyContainer = document.getElementById('sankeyContainer')!
  barsContainer = document.getElementById('barsContainer')!
  linesContainer = document.getElementById('linesContainer')!

  // Load data
  Promise.all([
    csv('/data/budget-sankey/us-budget-sankey-main.csv'),
    csv('/data/budget-sankey/us-budget-sankey-deficit.csv'),
    csv('/data/budget-sankey/us-budget-sankey-bars.csv'),
  ]).then(([mainCsv, deficitCsv, barsCsv]) => {
    const mainData = mainCsv as unknown as BudgetDataRow[]
    const deficitData = deficitCsv as unknown as DeficitDataRow[]
    const barsData = barsCsv as unknown as BarDataRow[]

    // Process initial data
    const processed = newData(mainData, deficitData, vizState.thisYear)
    vizState.nodes = processed.nodes
    vizState.links = processed.links
    vizState.lineData = processed.lineData
    vizState.thisYearDeficit = processed.thisYearDeficit

    drawBars(barsData)
    drawSankey()
    drawDeficit()
    drawSlider(mainData, deficitData)
    drawLines()
  })
}

// BARS
const drawBars = (barData: BarDataRow[]) => {
  const barsMargin = { top: 10, right: 5, bottom: 5, left: 5 }
  const barsWidth =
    barsContainer.offsetWidth - barsMargin.left - barsMargin.right
  const barsHeight = 80 - barsMargin.top - barsMargin.bottom

  const barsSvg = select('#barsContainer')
    .append('svg')
    .attr('width', barsWidth + barsMargin.left + barsMargin.right)
    .attr('height', barsHeight + barsMargin.top + barsMargin.bottom)
    .attr('class', 'barsCanvas')
    .append('g')
    .attr('transform', `translate(${barsMargin.left},${barsMargin.top})`)

  barData.forEach((d) => {
    d.year = +d.year
  })

  const stack = d3Stack<BarDataRow>()
  const keys = Object.keys(barData[0]).slice(2)
  stack.keys(keys).offset(stackOffsetDiverging)

  const series = stack(barData)

  const barsXScale = scaleBand<number>()
    .domain(barData.map((d) => d.year))
    .range([barsMargin.left, barsWidth - barsMargin.right])
    .paddingInner(0.1)
    .paddingOuter(0.75)

  const barsYScale = scaleLinear()
    .domain([
      stackMin(series as Iterable<[number, number]>)!,
      stackMax(series as Iterable<[number, number]>)!,
    ])
    .range([barsHeight - barsMargin.bottom, barsMargin.top])
    .nice()

  const bars = barsSvg
    .selectAll('.bars')
    .data(series)
    .enter()
    .append('g')
    .attr('class', (d) => d.key)

  rects = bars
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => barsXScale(d.data.year)!)
    .attr('y', (d) => barsYScale(d[1]))
    .attr('height', (d) => barsYScale(d[0]) - barsYScale(d[1]))
    .attr('class', 'bar')
    .attr('year', (d) => d.data.year)
    .attr('width', barsXScale.bandwidth())
    .style('fill', function (d) {
      return select(this.parentNode as SVGGElement).attr('class') === 'Revenue'
        ? 'green'
        : 'red'
    })
    .style('opacity', (d) => (d.data.year === vizState.thisYear ? 0.8 : 0.6))
    .style('stroke', (d) =>
      d.data.year === vizState.thisYear ? 'black' : 'none'
    )
    .style('stroke-width', (d) =>
      d.data.year === vizState.thisYear ? '2px' : 'none'
    )

  const line = d3Line<BarDataRow>()
    .x((d) => barsXScale(d.year)! + barsXScale.bandwidth() / 2)
    .y((d) => barsYScale(d.Balance))

  barsSvg.append('path').datum(barData).attr('id', 'line').attr('d', line)

  barsSvg
    .append('text')
    .attr('x', barsWidth / 2)
    .attr('y', barsMargin.top * 0.5)
    .attr('dy', '0em')
    .text('Revenue/Surplus')
    .attr('class', 'bar-labels')

  barsSvg
    .append('text')
    .attr('x', barsWidth / 2)
    .attr('y', barsHeight + barsMargin.bottom * 0.5)
    .attr('dy', '0em')
    .attr('class', 'bar-labels')
    .text('Spending/Deficit')
}

const updateBars = (thisYear: number) => {
  const transition = 50

  rects
    .transition()
    .duration(transition)
    .style('opacity', (d) => (d.data.year === thisYear ? 0.8 : 0.6))
    .style('stroke', (d) => (d.data.year === thisYear ? 'black' : 'none'))
    .style('stroke-width', (d) => (d.data.year === thisYear ? '2px' : 'none'))
}

// SANKEY
const drawSankey = () => {
  const sankeyMargin = { top: 30, right: 10, bottom: 10, left: 10 }
  const sankeyWidth =
    sankeyContainer.offsetWidth - sankeyMargin.left - sankeyMargin.right
  const sankeyHeight = 375 - sankeyMargin.top - sankeyMargin.bottom

  sankeySvg = select('#sankeyContainer')
    .append('svg')
    .attr('width', sankeyWidth + sankeyMargin.left + sankeyMargin.right)
    .attr('height', sankeyHeight + sankeyMargin.top + sankeyMargin.bottom)
    .attr('class', 'sankeyCanvas')
    .append('g')
    .attr('transform', `translate(${sankeyMargin.left},${sankeyMargin.top})`)

  sankey = d3sankey()
  sankey.nodeWidth(60)
  sankey.nodePadding(20)
  sankey.size([sankeyWidth, sankeyHeight])

  const path = sankey.link()

  sankey.nodes(vizState.nodes)
  sankey.links(vizState.links)
  sankey.layout(1000)

  fontScale.domain(extent(vizState.nodes, (d) => d.value!) as [number, number])

  sankeySvg
    .append('g')
    .selectAll('.link')
    .data(vizState.links, (d: any) => d.id)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', path)
    .style('stroke', (d) => {
      if (d.type === 'Revenue') {
        return 'green'
      } else if (d.type === 'Spending') {
        return 'red'
      } else {
        return 'grey'
      }
    })
    .style('stroke-width', (d) => Math.max(1, d.dy!))
    .attr('key', (d) => {
      const source = d.source as SankeyNode
      const target = d.target as SankeyNode
      return d.type === 'Revenue'
        ? source.name.split(' ').join('_')
        : target.name.split(' ').join('_')
    })
    .on('mouseover', function () {
      highlight(this as SVGElement, {
        key: '',
        lineData: vizState.lineData,
        thisYear: vizState.thisYear,
        revLineX,
        spendLineX,
        lineY,
      })
    })

  node = sankeySvg
    .append('g')
    .selectAll('.node')
    .data(vizState.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  node
    .append('rect')
    .attr('height', (d) => (d.dy! < 0 ? 0.1 : d.dy!))
    .attr('width', sankey.nodeWidth() as number)
    .attr('key', (d) => d.name.split(' ').join('_'))
    .attr('value', (d) => d.value!)
    .attr('class', 'nodeRect')
    .on('mouseover', function () {
      highlight(this as SVGElement, {
        key: '',
        lineData: vizState.lineData,
        thisYear: vizState.thisYear,
        revLineX,
        spendLineX,
        lineY,
      })
    })

  node
    .append('text')
    .attr('x', -6)
    .attr('y', (d) => d.dy! / 2)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .style('font-size', (d) => `${Math.floor(fontScale(d.value!))}px`)
    .text((d) => d.name)
    .attr('class', 'nodeLabel')
    .filter((d) => d.x! < sankeyWidth / 2)
    .attr('x', 6 + (sankey.nodeWidth() as number))
    .attr('text-anchor', 'start')

  node
    .append('text')
    .attr('x', 30)
    .attr('y', (d) => d.dy! / 2)
    .attr('dy', '.35em')
    .attr('class', 'nodePercent')
    .text((d) => `${format(d.value!)}%`)
    .filter((d) => d.value! <= 1 || d.node === 20)
    .style('opacity', 0)

  sankeySvg
    .append('text')
    .attr('x', 0)
    .attr('y', -5)
    .attr('dy', '0em')
    .text('Percent of GDP')
    .attr('class', 'percent')

  node
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', 30)
    .attr('y', (d) => d.dy! / 2)
    .style('font-size', 18)
    .attr('dy', '.35em')
    .filter((d) => d.node === 20)
    .text(() => `${format(vizState.thisYearDeficit[0].spending)}%`)
    .attr('class', 'spendingNodePercent')
}

const updateSankey = () => {
  const path = sankey.link()

  sankey.nodes(vizState.nodes)
  sankey.links(vizState.links)
  sankey.layout(1000)
  sankey.relayout()
  fontScale.domain(extent(vizState.nodes, (d) => d.value!) as [number, number])

  sankeySvg
    .selectAll('.link')
    .data(vizState.links)
    .transition('newSankey')
    .duration(newYearTransition)
    .attr('d', path)
    .style('stroke-width', (d) => Math.max(1, d.dy!))

  sankeySvg
    .selectAll('.node')
    .data(vizState.nodes)
    .transition('newSankey')
    .duration(newYearTransition)
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  sankeySvg
    .selectAll('.node rect')
    .data(vizState.nodes)
    .transition('newSankey')
    .duration(newYearTransition)
    .attr('height', (d) => (d.dy! < 0 ? 0.1 : d.dy!))
    .attr('value', (d) => d.value!)

  sankeySvg
    .selectAll('.nodeLabel')
    .data(vizState.nodes)
    .transition('newSankey')
    .duration(newYearTransition)
    .style('font-size', (d) => `${Math.floor(fontScale(d.value!))}px`)
    .attr('y', (d) => d.dy! / 2)

  sankeySvg
    .selectAll('.nodePercent')
    .data(vizState.nodes)
    .transition('newSankey')
    .duration(newYearTransition)
    .text((d) => `${format(d.value!)}%`)
    .attr('y', (d) => d.dy! / 2)
    .style('opacity', 1)
    .filter((d) => d.value! < 1 || d.node === 20)
    .style('opacity', 0)

  sankeySvg.selectAll('.spendingNodePercent').remove()

  node
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', 30)
    .attr('y', (d) => d.dy! / 2)
    .style('font-size', 18)
    .attr('dy', '.35em')
    .filter((d) => d.node === 20)
    .text(() => `${format(vizState.thisYearDeficit[0].spending)}%`)
    .attr('class', 'spendingNodePercent')
}

const drawDeficit = () => {
  selectAll('.deficit').remove()
  selectAll('.deficitLabel').remove()

  const barHeight = +select('rect[key=Spending]').attr('height')
  const barVal = +select('rect[key=Spending]').attr('value')
  const deficitVal = vizState.thisYearDeficit[0].deficit

  const deficitBarRatio = Math.floor((barHeight * deficitVal) / barVal)

  select('rect[key=Spending]')
    .select(function () {
      return (this as SVGRectElement).parentNode as SVGGElement
    })
    .append('rect')
    .attr('height', () =>
      deficitBarRatio < 0 ? -deficitBarRatio : deficitBarRatio
    )
    .attr('width', sankey.nodeWidth() as number)
    .attr('y', (d: any) =>
      deficitBarRatio < 0 ? d.dy + deficitBarRatio : d.dy - deficitBarRatio
    )
    .style('fill', () => (deficitBarRatio < 0 ? 'red' : 'blue'))
    .attr('class', 'deficit')
    .style('opacity', 0)
    .transition()
    .duration(newYearTransition)
    .style('opacity', 0.8)

  const sankeyWidth = sankeyContainer.offsetWidth - 20
  const sankeyHeight = 375 - 40

  sankeySvg
    .append('text')
    .attr('x', sankeyWidth / 2)
    .attr('y', sankeyHeight * 0.92)
    .attr('class', 'deficitLabel')
    .text(() =>
      vizState.thisYearDeficit[0].deficit < 0
        ? `${format(-vizState.thisYearDeficit[0].deficit)}% Deficit`
        : `${format(vizState.thisYearDeficit[0].deficit)}% Surplus`
    )
    .style('fill', () => (deficitBarRatio < 0 ? 'red' : 'blue'))
    .style('opacity', 0)
    .transition()
    .duration(newYearTransition)
    .style('opacity', 0.8)
}

// LINES
const drawLines = () => {
  const revLineData = vizState.lineData.filter((d) => d.type === 'Revenue')
  const spendLineData = vizState.lineData.filter((d) => d.type === 'Spending')

  // D3 v7 migration: replace nest() with group()
  const revDataNested = Array.from(
    group(revLineData, (d) => d.source),
    ([key, values]) => ({ key, values })
  )

  const spendDataNested = Array.from(
    group(spendLineData, (d) => d.target),
    ([key, values]) => ({ key, values })
  )

  const lineMargin = { top: 20, right: 20, bottom: 10, left: 20, middle: 20 }
  const lineWidth =
    linesContainer.offsetWidth - lineMargin.left - lineMargin.right
  const lineHeight = 140 - lineMargin.top - lineMargin.bottom

  const lineSvg = select('#linesContainer')
    .append('svg')
    .attr('width', lineWidth + lineMargin.left + lineMargin.right)
    .attr('height', lineHeight + lineMargin.top + lineMargin.bottom)
    .append('g')
    .attr('transform', `translate(${lineMargin.left},${lineMargin.top})`)

  revLineX = scaleBand<number>()
    .domain(revLineData.map((d) => +d.year))
    .range([lineMargin.left, lineWidth / 2 - lineMargin.middle])

  spendLineX = scaleBand<number>()
    .domain(spendLineData.map((d) => +d.year))
    .range([lineWidth / 2 + lineMargin.middle, lineWidth - lineMargin.right])

  lineY = scaleLinear()
    .domain([0, max(revLineData, (d) => +d.value)!])
    .range([lineHeight - lineMargin.bottom, lineMargin.top])

  const revLine = d3Line<BudgetDataRow>()
    .x((d) => revLineX(+d.year)!)
    .y((d) => lineY(+d.value))

  const spendLine = d3Line<BudgetDataRow>()
    .x((d) => spendLineX(+d.year)!)
    .y((d) => lineY(+d.value))

  const revLines = lineSvg
    .selectAll('.revLineNode')
    .data(revDataNested)
    .enter()
    .append('g')
    .attr('class', 'lineNode')
    .attr('key', (d) => d.key.split(' ').join('_'))

  revLines
    .append('path')
    .attr('class', (d) => `line ${d.key}`)
    .attr('d', (d) => revLine(d.values))
    .attr('key', (d) => d.key.split(' ').join('_'))
    .style('stroke', 'green')
    .on('mouseover', function () {
      highlight(this as SVGElement, {
        key: '',
        lineData: vizState.lineData,
        thisYear: vizState.thisYear,
        revLineX,
        spendLineX,
        lineY,
      })
    })

  const spendLines = lineSvg
    .selectAll('.spendLineNode')
    .data(spendDataNested)
    .enter()
    .append('g')
    .attr('class', 'lineNode')
    .attr('key', (d) => d.key.split(' ').join('_'))

  spendLines
    .append('path')
    .attr('class', (d) => `line ${d.key}`)
    .attr('d', (d) => spendLine(d.values))
    .attr('key', (d) => d.key.split(' ').join('_'))
    .style('stroke', 'red')
    .on('mouseover', function () {
      highlight(this as SVGElement, {
        key: '',
        lineData: vizState.lineData,
        thisYear: vizState.thisYear,
        revLineX,
        spendLineX,
        lineY,
      })
    })

  lineSvg
    .append('text')
    .attr('x', lineWidth * 0.25)
    .attr('y', lineMargin.top / 4)
    .attr('class', 'lineTitle')
    .text('Revenue')

  lineSvg
    .append('text')
    .attr('x', lineWidth * 0.75)
    .attr('y', lineMargin.top / 4)
    .attr('class', 'lineTitle')
    .text('Spending')

  const revXAxis = axisBottom(revLineX)
    .tickValues(
      revLineX.domain().filter((d, i) => i === 0 || i === 49) as number[]
    )
    .tickSize(0)

  const spendXAxis = axisBottom(spendLineX)
    .tickValues(
      spendLineX.domain().filter((d, i) => i === 0 || i === 49) as number[]
    )
    .tickSize(0)

  lineSvg
    .append('g')
    .attr('class', 'revAxis x')
    .attr('transform', `translate(-7,${lineHeight - lineMargin.bottom})`)
    .call(revXAxis)

  lineSvg
    .append('g')
    .attr('class', 'spendAxis x')
    .attr('transform', `translate(-7,${lineHeight - lineMargin.bottom})`)
    .call(spendXAxis)

  lineSvg
    .append('g')
    .attr('class', 'thisYearLine rev')
    .append('line')
    .attr('x1', revLineX(vizState.thisYear)!)
    .attr('x2', revLineX(vizState.thisYear)!)
    .attr('y1', lineMargin.top)
    .attr('y2', lineHeight - lineMargin.bottom)

  select('.thisYearLine.rev')
    .append('text')
    .text(vizState.thisYear)
    .attr('x', revLineX(vizState.thisYear)!)
    .attr('y', lineHeight + lineMargin.bottom * 0.2)

  lineSvg
    .append('g')
    .attr('class', 'thisYearLine spend')
    .append('line')
    .attr('x1', spendLineX(vizState.thisYear)!)
    .attr('x2', spendLineX(vizState.thisYear)!)
    .attr('y1', lineMargin.top)
    .attr('y2', lineHeight - lineMargin.bottom)

  select('.thisYearLine.spend')
    .append('text')
    .text(vizState.thisYear)
    .attr('x', spendLineX(vizState.thisYear)!)
    .attr('y', lineHeight + lineMargin.bottom * 0.2)
}

const updateThisYearLine = (thisYear: number) => {
  select('.thisYearLine.rev line')
    .attr('x1', revLineX(thisYear)!)
    .attr('x2', revLineX(thisYear)!)

  select('.thisYearLine.rev text')
    .text(thisYear)
    .attr('x', revLineX(thisYear)!)
    .style('opacity', thisYear === 1968 || thisYear === 2017 ? 0 : 1)

  select('.thisYearLine.spend line')
    .attr('x1', spendLineX(thisYear)!)
    .attr('x2', spendLineX(thisYear)!)

  select('.thisYearLine.spend text')
    .text(thisYear)
    .attr('x', spendLineX(thisYear)!)
    .style('opacity', thisYear === 1968 || thisYear === 2017 ? 0 : 1)
}

// SLIDER
const drawSlider = (
  mainData: BudgetDataRow[],
  deficitData: DeficitDataRow[]
) => {
  const slider = sliderHorizontal()
    .min(1968)
    .max(2017)
    .step(1)
    .width(barsContainer.offsetWidth - 62)
    .tickFormat(d3Format('.4'))
    .default(2017)
    .on('onchange', (val: number) => {
      vizState.thisYear = val
      updateBars(val)
      updateThisYearLine(val)
    })
    .on('end', (val: number) => {
      vizState.thisYear = val
      select('.deficit').remove()
      select('.deficitLabel').remove()
      const processed = newData(mainData, deficitData, val)
      vizState.nodes = processed.nodes
      vizState.links = processed.links
      vizState.thisYearDeficit = processed.thisYearDeficit
      updateSankey()
      setTimeout(() => drawDeficit(), newYearTransition)
    })

  const g = select('div#slider')
    .append('svg')
    .attr('width', barsContainer.offsetWidth)
    .attr('height', 90)
    .append('g')
    .attr('transform', 'translate(30,30)')

  g.call(slider as any)
  selectAll('#slider').style('font-size', 20)
}

export default initializeViz
