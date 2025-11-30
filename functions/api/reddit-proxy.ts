export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url)
  const redditUrl = url.searchParams.get('url')

  if (!redditUrl || !redditUrl.startsWith('https://www.reddit.com/')) {
    return new Response('Invalid Reddit URL', { status: 400 })
  }

  try {
    const response = await fetch(redditUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'User-Agent': 'Mozilla/5.0 (compatible; PersonalHomepage/1.0)',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from Reddit' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
