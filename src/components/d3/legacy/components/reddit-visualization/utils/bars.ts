// This is early career code. Plz don't judge :)
// eslint-disable-next-line
// @ts-nocheck
import * as d3 from 'd3'
import { barMouseMove, barMouseOut } from './tooltip'
import { interactionTips } from './utils'

export const drawBars = (dataset) => {
  // create svg container
  const w = visualization.offsetWidth - 70
  const h = visualization.offsetHeight - 120
  const margin = {
    right: 40,
    left: 30,
    top: 20,
    bottom: 100,
  }

  const svg = d3
    .select('#visualization')
    .append('svg')
    .attr('id', 'canvas')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // ease
  const barEase = d3.easeQuadIn
  const barTransition = 500

  // number/date formats
  const upsFormat = d3.format('.2s')
  const maxUps = d3.max(dataset, (d) => d.ups)

  // ranges
  const x = d3.scaleBand().rangeRound([0, w]).paddingInner(0.05)

  const y = d3
    .scaleLinear()
    .range([0, h - margin.top])
    .clamp(true)

  // scales
  x.domain(d3.range(0, dataset.length))
  y.domain([0, d3.max(dataset, (d) => d.ups)])

  // BARS
  const bars = svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d, i) => x(i))
    .attr('y', h) // for animation
    .attr('width', x.bandwidth())
    .attr('height', (d) => y(0))
    .attr('class', 'bar')
    .on('click', (e, d) => window.open(d.permalink))
    .on('mousemove', barMouseMove)
    .on('mouseout', barMouseOut)
    .transition('start')
    .duration(barTransition)
    .ease(barEase)
    .attr('y', (d) => h - y(d.ups))
    .attr('height', (d) => y(d.ups))

  // TEXT
  const barLabel = svg
    .selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text((d) => (d.ups > 9 ? upsFormat(d.ups) : d.ups))
    .attr('x', (d, i) => x(i) + x.bandwidth() / 2)
    .attr('y', h)
    .attr('class', 'bar-label')
    .transition('start')
    .duration(barTransition)
    .ease(barEase)
    .attr('y', (d) => {
      if (d.ups >= maxUps / 20) {
        return h - y(d.ups) + 18
      }
      return h - y(d.ups) - 5
    })
    .attr('fill', (d) => {
      if (d.ups >= maxUps / 20) {
        return 'white'
      }
      return 'black'
    })

  // transparent rect for hovering over numbers
  const hoverRect = svg
    .selectAll('.hover-rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'hover-rect')
    .attr('x', (d, i) => x(i))
    .attr('y', (d) => h - y(d.ups) - 20)
    .attr('width', x.bandwidth())
    .attr('height', (d) => (d.ups >= maxUps / 20 ? 0 : 20))
    .on('click', (e, d) => window.open(d.permalink))
    .on('mousemove', barMouseMove)
    .on('mouseout', barMouseOut)

  // x axis
  const xAxis = d3
    .axisBottom()
    .scale(x)
    .tickSize(0)
    .tickFormat((d) =>
      dataset[d].title.length > 20
        ? `${dataset[d].title.slice(0, 20)}...`
        : dataset[d].title
    )

  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${h + 15})`)
    .call(xAxis)
    .selectAll('text')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')

  d3.select('.x-axis').select('.domain').style('opacity', 0)

  // y axis
  svg
    .append('text')
    .text('Upvotes')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${-margin.left / 4},${h * 0.6}) rotate(-90)`)

  highlightBarButton()
  interactionTips('Hover and click!')
}

function highlightBarButton() {
  d3.select('#bar-button').style('filter', 'brightness(85%)')

  d3.select('#bubble-button').style('filter', 'none')

  d3.select('#scatter-button').style('filter', 'none')
}

// useful APIs following json.data.children[j].data
// author: 'Sir_Wheat_Thins'
// created: 1538956907
// created_utc: 1538928107
// downs: 0
// gilded: 1
// num_comments: 336
// num_crossposts: 8
// permalink: '/r/woahdude/comments/9m64zl/all_the_planets_aligned_on_their_curve/'
// preview.enabled: true
// preview.images[0].resolutions[0].url (resolutions 0/1/2 are width 100/200/300 and height 200/400/600)
// score: 10227
// subreddit_name_prefixed: "r/funny"
// subreddit_subscribers: 14407328
// title: 'What's the number 1 rule when you go shooting?'
// ups: 10227
// url: 'https://i.imgur.com/vgLIth5.jpg'
