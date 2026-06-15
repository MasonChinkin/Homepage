// This is early career code. Plz don't judge :)
// eslint-disable-next-line
// @ts-nocheck
import { max, min } from 'd3-array'
import { drag } from 'd3-drag'
import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force'
import { format } from 'd3-format'
import { scaleOrdinal, scaleSqrt } from 'd3-scale'
import { select } from 'd3-selection'
import { barMouseMove, barMouseOut } from './tooltip'
import { interactionTips } from './utils'

export function drawBubbles(dataset) {
  const w = visualization.offsetWidth - 10
  const h = visualization.offsetHeight - 10
  const margin = {
    right: 5,
    left: 5,
    top: 5,
    bottom: 5,
  }
  const nodePadding = 1.5

  const upsFormat = format('.2s')

  // force
  const force = 0.1

  const svg = select('#visualization')
    .append('svg')
    .attr('id', 'canvas')
    .attr('width', w)
    .attr('height', h)

  const color = scaleOrdinal([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd',
    '#ccebc5',
    '#ffed6f',
  ])

  // range/scale
  const radiusScale = scaleSqrt()
    .domain([0, max(dataset, (d) => d.ups)])
    .range([6, h / 9]) // 6 for minimum size

  const simulation = forceSimulation()
    .force(
      'forceX',
      forceX()
        .strength(force)
        .x(w * 0.5)
    )
    .force(
      'forceY',
      forceY()
        .strength(force)
        .y(h * 0.5)
    )
    .force(
      'center',
      forceCenter()
        .x(w * 0.4)
        .y(h * 0.5)
    )
    .force('charge', forceManyBody().strength(-30))

  // sort the nodes so that the bigger ones are at the back
  dataset = dataset.sort((a, b) => b.ups - a.ups)

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('r', (d) => radiusScale(d.ups))
    .attr('fill', (d) => color(d.id))
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)
    .on('click', (e, d) => window.open(d.permalink))
    .on('mousemove', barMouseMove)
    .on('mouseout', barMouseOut)
    .call(
      drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
    )

  // update the simulation based on the data
  simulation
    .nodes(dataset)
    .force(
      'collide',
      forceCollide()
        .strength(0.5)
        .radius((d) => radiusScale(d.ups) + nodePadding)
        .iterations(1)
    )
    .on('tick', (d) => {
      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
    })

  // radius
  const maxUps = max(dataset, (d) => d.ups)
  const minUps = min(dataset, (d) => d.ups)
  const legendData = [maxUps, (maxUps + minUps) / 2, minUps]

  const legendCircle = svg
    .selectAll('.legend-circle')
    .data(legendData)
    .enter()
    .append('circle')
    .attr('class', 'legend-circle')
    .attr('cy', (d, i) => {
      let offset
      if (i === 0) offset = maxUps
      if (i === 1) offset = (legendData[1] + legendData[0]) / 2
      if (i === 2) offset = (legendData[2] + legendData[0]) / 2
      return h * 0.85 - radiusScale(offset) * 2 * i
    })
    .attr('cx', () => w - radiusScale(legendData[0]) - 10)
    .attr('r', (d) => radiusScale(d))

  // legend header
  svg
    .append('text')
    .attr('class', 'legend-header')
    .attr(
      'transform',
      `translate(
      ${w - radiusScale(legendData[0]) - 10},
      ${
        h * 0.85 -
        (radiusScale(legendData[0]) +
          radiusScale(legendData[1]) +
          radiusScale(legendData[2])) *
          2 +
        20
      }
      )`
    ) // Im not proud of myself for this one
    .text('Upvotes')

  // legend labels
  legendData.forEach((label, i) => {
    let offset
    if (i === 0) offset = maxUps
    if (i === 1) offset = (legendData[1] + legendData[0]) / 2
    if (i === 2) offset = (legendData[2] + legendData[0]) / 2

    const labelY = h * 0.85 - radiusScale(offset) * 2 * i + 3
    const labelX = w - radiusScale(legendData[0]) - 10
    svg
      .append('text')
      .attr('class', 'legend-label')
      .attr('transform', `translate(${labelX},${labelY})`)
      .text(label < 10 ? label : upsFormat(label))
  })

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.03).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event, d) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0.03)
    d.fx = null
    d.fy = null
  }

  highlightBubbleButton()
  interactionTips('Drag, hover, and click!')
}

function highlightBubbleButton() {
  select('#bar-button').style('filter', 'none')

  select('#bubble-button').style('filter', 'brightness(85%)')

  select('#scatter-button').style('filter', 'none')
}
