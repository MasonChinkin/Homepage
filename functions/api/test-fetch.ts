export const onRequest: PagesFunction = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')

  const data = await res.json()

  return new Response(JSON.stringify(data))
}
