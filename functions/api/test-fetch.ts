export const onRequest: PagesFunction = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')

  return res.json()
}
