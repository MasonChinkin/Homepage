// This is early career code. Plz don't judge :)
// eslint-disable-next-line
// @ts-nocheck
import * as d3 from 'd3'
import { createHighlightHandler, formatNumber } from './utils'

export function drawLines(lineData, thisYear) {
  // separate datasets filtered by type
  const revLineData = lineData.filter((d) => d.type == 'Revenue')
  const spendLineData = lineData.filter((d) => d.type == 'Spending')

  const revDataNested = Array.from(d3.group(revLineData, (d) => d.source).entries()).map(
    ([key, values]) => ({ key, values })
  )

  const spendDataNested = Array.from(
    d3.group(spendLineData, (d) => d.target).entries()
  ).map(([key, values]) => ({ key, values }))

  // Dimensions
  const lineMargin = {
    top: 20,
    right: 20,
    bottom: 10,
    left: 20,
    middle: 20,
  }

  const lineWidth =
    linesContainer.offsetWidth - lineMargin.left - lineMargin.right
  const lineHeight = 140 - lineMargin.top - lineMargin.bottom

  const lineSvg = d3
    .select('#linesContainer')
    .append('svg')
    .attr('width', lineWidth + lineMargin.left + lineMargin.right)
    .attr('height', lineHeight + lineMargin.top + lineMargin.bottom)
    .append('g')
    .attr('transform', `translate(${lineMargin.left},${lineMargin.top})`)

  // set the domain and range
  const revLineX = d3
    .scaleBand()
    .domain(revLineData.map((d) => d.year))
    .range([lineMargin.left, lineWidth / 2 - lineMargin.middle])

  const spendLineX = d3
    .scaleBand()
    .domain(spendLineData.map((d) => d.year))
    .range([lineWidth / 2 + lineMargin.middle, lineWidth - lineMargin.right])

  const lineY = d3
    .scaleLinear()
    .domain([0, d3.max(revLineData, (d) => d.value)])
    .range([lineHeight - lineMargin.bottom, lineMargin.top])

  // define the line
  const revLine = d3
    .line()
    .x((d) => revLineX(d.year))
    .y((d) => lineY(d.value))

  const spendLine = d3
    .line()
    .x((d) => spendLineX(d.year))
    .y((d) => lineY(d.value))

  const highlight = createHighlightHandler(lineData, thisYear, revLineX, spendLineX, lineY)

  // revenue lines
  const revLines = lineSvg
    .selectAll('lineNode')
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
    .on('mouseover', highlight)

  // spending lines
  const spendLines = lineSvg
    .selectAll('lineNode')
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
    .on('mouseover', highlight)

  // headers
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

  // Define axes
  const revXAxis = d3
    .axisBottom()
    .scale(revLineX)
    .tickValues(revLineX.domain().filter((d, i) => i === 0 || i === 49)) // first and last year
    .tickSize(0)

  const spendXAxis = d3
    .axisBottom()
    .scale(spendLineX)
    .tickValues(revLineX.domain().filter((d, i) => i === 0 || i === 49))
    .tickSize(0)

  // create axes
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

  // lines and labels indicating current year
  lineSvg
    .append('g')
    .attr('class', 'thisYearLine rev')
    .append('line')
    .attr('x1', revLineX(thisYear))
    .attr('x2', revLineX(thisYear))
    .attr('y1', lineMargin.top)
    .attr('y2', lineHeight - lineMargin.bottom)

  d3.select('.thisYearLine.rev')
    .append('text')
    .text((d) => thisYear)
    .attr('x', revLineX(thisYear))
    .attr('y', lineHeight + lineMargin.bottom * 0.2)

  lineSvg
    .append('g')
    .attr('class', 'thisYearLine spend')
    .append('line')
    .attr('x1', spendLineX(thisYear))
    .attr('x2', spendLineX(thisYear))
    .attr('y1', lineMargin.top)
    .attr('y2', lineHeight - lineMargin.bottom)

  d3.select('.thisYearLine.spend')
    .append('text')
    .text((d) => thisYear)
    .attr('x', spendLineX(thisYear))
    .attr('y', lineHeight + lineMargin.bottom * 0.2)

  return { revLineX, spendLineX, lineY }
}

export function updateThisYearLine(revLineX, spendLineX, lineY, lineData, thisYear) {
  // line indicating current year
  d3.select('.thisYearLine.rev line')
    .attr('x1', revLineX(thisYear))
    .attr('x2', revLineX(thisYear))

  d3.select('.thisYearLine.rev text')
    .text((d) => thisYear)
    .attr('x', revLineX(thisYear))
    .style('opacity', (d) => (thisYear == 1968 || thisYear == 2017 ? 0 : 1))

  d3.select('.thisYearLine.spend line')
    .attr('x1', spendLineX(thisYear))
    .attr('x2', spendLineX(thisYear))

  d3.select('.thisYearLine.spend text')
    .text((d) => thisYear)
    .attr('x', spendLineX(thisYear))
    .style('opacity', (d) => (thisYear == 1968 || thisYear == 2017 ? 0 : 1))

  // Update line labels if a key is currently active
  const activeKey = d3.select('.link').attr('key')
  if (activeKey) {
    const lineLabelData = lineData.filter(
      (d) =>
        d.source.split(' ').join('_') == activeKey ||
        d.target.split(' ').join('_') == activeKey
    )

    if (lineLabelData.length > 0) {
      d3.selectAll('.lineLabel').remove()

      d3.selectAll('.lineNode')
        .filter(function (d, i) {
          return d3.select(this).attr('key') == activeKey
        })
        .append('g')
        .selectAll('text')
        .data(lineLabelData)
        .enter()
        .append('text')
        .filter(function (d, i) {
          return (
            i === 0 ||
            i === lineLabelData.length - 1 ||
            d.year === thisYear
          )
        })
        .attr('x', (d, i) =>
          d.type == 'Revenue' ? revLineX(d.year) : spendLineX(d.year)
        )
        .attr('y', (d) => lineY(d.value) - 14)
        .text((d, i) => formatNumber(d.value))
        .attr('class', 'lineLabel')
    }
  }
}
