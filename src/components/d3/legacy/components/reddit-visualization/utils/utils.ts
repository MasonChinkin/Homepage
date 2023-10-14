import * as d3 from 'd3'

// function to only include urls that can be previewed (jpgs)
export function usableUrl(url, preview, thumbnail) {
  let unencoded
  if (preview) {
    unencoded = preview.split('&amp;').join('&')
  }

  if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif')) {
    return url
  }
  if (preview) {
    return unencoded
  }
  if (thumbnail) {
    return thumbnail
  }
  return null
}

export function redraw(dataset, vizType) {
  d3.select('#visualization').select('svg').remove()

  // remove any previous viz
  vizType(dataset)
}

export function catchErrors(json) {
  const sort = document.getElementById('sort-input')

  // error catching
  if (json.error) {
    if (sort.value === 'Sort') {
      sort.style.border = '1px solid red'
      setTimeout(() => alert('Select a sorting type!'), 0) // setTimeout so red border renders before alert
    } else {
      setTimeout(() => alert('Subreddit not found!'), 0) // setTimeout so red border renders before alert
    }
  }

  if (json.error) return

  sort.style.border = '0'
}

export function subredditNotFound() {
  const subreddit = document.getElementById('subreddit-input')
  subreddit.style.border = '1px solid red'

  setTimeout(() => alert('Subreddit not found!'), 0) // setTimeout so red border renders before alert
}

export function dateRangeNeeded() {
  const dateRangeInput = document.getElementById('date-range')
  const sortVal = document.getElementById('sort-input').value

  dateRangeInput.disabled = sortVal !== 'top'
}

export function interactionTips(tipText) {
  const xMultiplier = window.innerWidth <= 768 ? 0.3 : 0.5
  d3.select('#canvas')
    .append('text')
    .attr('x', visualization.offsetWidth * xMultiplier)
    .attr('y', visualization.offsetHeight * 0.04)
    .text(tipText)
    .attr('class', 'interaction-tips')
}
