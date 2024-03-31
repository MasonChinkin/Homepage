export const onRequest: PagesFunction = async () => {
  console.log('log')
  return new Response('Hello, world!')
}
