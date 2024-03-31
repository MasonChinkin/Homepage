export const onRequest: PagesFunction = async (context) => {
  const { user } = context.params

  return new Response(`current user: ${user}`)
}
