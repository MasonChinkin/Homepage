import { readFileSync } from 'fs'

describe('public/index.base.html', () => {
  const html = readFileSync('public/index.base.html', 'utf-8')

  it.each([
    'use.fontawesome.com',
    'fonts.googleapis.com',
    'cdnjs.cloudflare.com',
    'Material+Icons',
    'family=Roboto',
    'esm.sh',
  ])('does not reference %s', (needle) => {
    expect(html).not.toContain(needle)
  })
})
