// This is early career code. Plz don't judge :)
// eslint-disable-next-line
// @ts-nocheck
import { format } from 'd3-format'
import { select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'

// number/date formats
const upsFormat = format('.2s')
const postTimeFormat = timeFormat('%B %d %I:%M%p')

// properties of mousemove
export const barMouseMove = (event, d) => {
  select('#Title').text(d.title)

  select('#Posted').text(postTimeFormat(new Date(d.createdString)))

  select('#Upvotes').text(d.ups > 9 ? upsFormat(d.ups) : d.ups)

  if (d.url) {
    select('#pic').attr('src', d.url).attr('class', '')
  } else {
    select('#pic')
      .attr(
        'src',
        'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
      )
      .attr('class', 'no-image')
  }

  const tooltipHeight = document
    .getElementById('tooltip')
    .getBoundingClientRect().height

  const tooltipWidth = document
    .getElementById('tooltip')
    .getBoundingClientRect().width

  // turnery flips tooltip to not dissapear off of screen
  const xpos =
    event.clientX > event.view.innerWidth / 2
      ? event.offsetX - tooltipWidth
      : event.offsetX
  const ypos =
    event.clientY > event.view.innerHeight / 2
      ? event.offsetY - tooltipHeight
      : event.offsetY

  // Show the tooltip and update position
  select('#tooltip')
    .classed('hidden', false)
    .style('left', `${xpos}px`)
    .style('top', `${ypos}px`)

  if (tooltipHeight === 0) {
    select('#tooltip').style('visibility', 'hidden')
  } else {
    select('#tooltip').style('visibility', 'visible')
  }
}

// properties of mouseout
export const barMouseOut = (d) => {
  select('#pic').attr('src', '')

  // Hide the tooltip
  select('#tooltip').classed('hidden', true)
}
