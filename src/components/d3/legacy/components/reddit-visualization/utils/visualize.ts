// This is early career code. Plz don't judge :)
// eslint-disable-next-line
// @ts-nocheck
import { usableUrl, catchErrors, redraw, subredditNotFound } from './utils'

function getURL() {
  const subreddit = document.getElementById('subreddit-input').value
  const sort = document.getElementById('sort-input').value
  const dateRange = document.getElementById('date-range').value

  let url = `https://www.reddit.com/r/${subreddit}/${sort}.json`
  if (sort === 'top') {
    url += `?t=${dateRange}`
  }

  return url
}

export async function visualize(vizType) {
  let dataset
  if (!sessionStorage.getItem('dataset')) {
    const url = getURL()
    let json
    try {
      json = await fetch(url, {
        headers: {
          'cache-control':
            'private, s-maxage=0, max-age=0, must-revalidate, no-store',
        },
      }).then((res) => res.json())
      catchErrors(json)
    } catch (err) {
      console.log(err) // eslint-disable-line
      subredditNotFound()
      console.clear() // eslint-disable-line
      // eslint-disable-next-line
      console.log(
        'console cleared to protect your eyes from a cors error cause by fetching from non-existent subreddit'
      )
    }

    if (json === undefined) return

    dataset = []

    const dataCount = window.innerWidth <= 768 ? 10 : 20
    for (let i = 0; i < dataCount; i += 1) {
      dataset.push({
        id: json.data.children[i].data.id,
        ups: json.data.children[i].data.ups,
        author: json.data.children[i].data.author,
        createdString: new Date(
          json.data.children[i].data.created_utc * 1000
        ).toString(),
        numComments: json.data.children[i].data.num_comments,
        permalink: `https://www.reddit.com${json.data.children[i].data.permalink}`,
        subreddit: json.data.children[i].data.subreddit_name_prefixed,
        title: json.data.children[i].data.title,
        url: usableUrl(
          json.data.children[i].data.url,
          json.data.children[i].data.preview
            ? json.data.children[i].data.preview.images[0].source.url
            : null,
          json.data.children[i].data.thumbnail
        ),
      })
    }

    dataset.sort((a, b) => b.ups - a.ups)
    sessionStorage.setItem('dataset', JSON.stringify(dataset))
  } else {
    dataset = JSON.parse(sessionStorage.getItem('dataset'))
  }

  const subreddit = document.getElementById('subreddit-input')
  subreddit.style.border = '0'

  redraw(dataset, vizType)
  window.addEventListener('resize', () => redraw(dataset, vizType))
}
