// This is early career code. Plz don't judge :)
// eslint-disable-next-line
// @ts-nocheck
import * as d3 from 'd3'
import { updateBars } from './bars'
import { updateThisYearLine } from './lines'
import { newData, newYearTransition } from './utils'
import { updateSankey, drawDeficit } from './sankey'

export function drawSlider() {
  const minYear = 1968
  const maxYear = 2017
  const defaultYear = 2017
  const sliderWidth = barsContainer.offsetWidth - 62

  // Create scale for the slider
  const scale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([0, sliderWidth])
    .clamp(true)

  // Create SVG container
  const svg = d3
    .select('div#slider')
    .append('svg')
    .attr('width', barsContainer.offsetWidth)
    .attr('height', 90)

  const sliderGroup = svg
    .append('g')
    .attr('class', 'slider')
    .attr('transform', 'translate(30,30)')

  // Draw slider track
  sliderGroup
    .append('line')
    .attr('class', 'track')
    .attr('x1', 0)
    .attr('x2', sliderWidth)
    .attr('y1', 0)
    .attr('y2', 0)
    .attr('stroke', '#bbb')
    .attr('stroke-width', 6)
    .attr('stroke-linecap', 'round')

  sliderGroup
    .append('line')
    .attr('class', 'track-inset')
    .attr('x1', 0)
    .attr('x2', sliderWidth)
    .attr('y1', 0)
    .attr('y2', 0)
    .attr('stroke', '#eee')
    .attr('stroke-width', 4)
    .attr('stroke-linecap', 'round')

  // Create overlay for drag interaction
  sliderGroup
    .append('line')
    .attr('class', 'track-overlay')
    .attr('x1', 0)
    .attr('x2', sliderWidth)
    .attr('y1', 0)
    .attr('y2', 0)
    .attr('stroke', 'transparent')
    .attr('stroke-width', 40)
    .attr('stroke-linecap', 'round')
    .style('cursor', 'pointer')

  // Create handle group
  const handleGroup = sliderGroup
    .append('g')
    .attr('class', 'parameter-value')
    .attr('transform', `translate(${scale(defaultYear)},0)`)
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'middle')
    .style('cursor', 'ew-resize')

  // Draw handle shape
  handleGroup
    .append('path')
    .attr('d', 'M-5.5,-5.5v10l6,5.5l6,-5.5v-10z')
    .attr('fill', 'white')
    .attr('stroke', '#777')

  // Draw handle text
  handleGroup
    .append('text')
    .attr('class', 'handle-text')
    .attr('font-size', 30)
    .attr('y', 27)
    .attr('dy', '.71em')
    .text(d3.format('.4')(defaultYear))

  // Create axis
  const axis = d3
    .axisBottom(scale)
    .tickFormat(d3.format('.4'))
    .ticks((maxYear - minYear) / 5) // Approximately every 5 years

  const axisGroup = sliderGroup
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,7)')
    .call(axis)

  // Style axis
  axisGroup.select('.domain').remove()
  axisGroup
    .selectAll('text')
    .attr('fill', '#aaa')
    .attr('y', 20)
    .attr('dy', '.71em')
    .attr('text-anchor', 'middle')
  axisGroup.selectAll('line').attr('stroke', '#aaa')

  // Initialize current value
  let currentValue = defaultYear
  window.thisYear = currentValue

  // Fade tick text that's too close to handle
  function fadeTickText() {
    const distances = []
    axisGroup.selectAll('.tick').each(function (d) {
      distances.push(Math.abs(d - currentValue))
    })

    const closestIndex = d3.minIndex(distances)
    axisGroup.selectAll('.tick text').attr('opacity', function (d, i) {
      return i === closestIndex ? 0 : 1
    })
  }

  // Update handle position and value
  function updateHandle(year) {
    const roundedYear = Math.round(year)
    if (roundedYear !== currentValue) {
      currentValue = roundedYear
      window.thisYear = currentValue

      handleGroup.attr('transform', `translate(${scale(currentValue)},0)`)
      handleGroup
        .select('.handle-text')
        .text(d3.format('.4')(currentValue))

      fadeTickText()

      // Call onchange callback
      updateBars(currentValue)
      updateThisYearLine(currentValue)
    }
  }

  // Handle drag end
  function handleDragEnd() {
    const year = currentValue
    d3.csv('data/budgetSankey/us-budget-sankey-main.csv').then((csv) => {
      d3.csv('data/budgetSankey/us-budget-sankey-deficit.csv').then(
        (deficit) => {
          // update
          d3.select('.deficit').remove()
          d3.select('.deficitLabel').remove()
          newData(csv, deficit, year)
          updateSankey()
          setTimeout(() => drawDeficit(), newYearTransition)
        }
      )
    })
  }

  // Create drag behavior
  const drag = d3
    .drag()
    .on('start drag', function (event) {
      const x = Math.max(0, Math.min(sliderWidth, event.x))
      const year = scale.invert(x)
      updateHandle(year)
    })
    .on('end', handleDragEnd)

  // Apply drag to both handle and track overlay
  handleGroup.call(drag)
  sliderGroup.select('.track-overlay').call(drag)

  // Initial fade of tick text
  fadeTickText()

  // Style the slider container
  d3.selectAll('#slider').style('font-size', 20)
}
