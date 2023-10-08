type ExternalizedLibs = Record<
  string,
  {
    id: string
    name: string
    getUrl: (isProduction: boolean) => string
  }
>

export const externalizedLibs: ExternalizedLibs = {
  react: {
    id: 'react',
    name: 'React',
    getUrl: (isProduction) =>
      isProduction
        ? 'https://unpkg.com/react@18.2.0/umd/react.production.min.js'
        : 'https://unpkg.com/react@18.2.0/umd/react.development.js',
  },
  reactDom: {
    id: 'react-dom',
    name: 'ReactDOM',
    getUrl: (isProduction) =>
      isProduction
        ? 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'
        : 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js',
  },
  bootstrap: {
    id: 'bootstrap',
    name: 'bootstrap',
    getUrl: (isProduction) =>
      isProduction
        ? 'https://unpkg.com/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
        : 'https://unpkg.com/bootstrap@5.3.2/dist/js/bootstrap.bundle.js',
  },
}

export const getExternals = (): Record<string, string> =>
  Object.values(externalizedLibs).reduce(
    (acc, lib) => {
      acc[lib.id] = lib.name
      return acc
    },
    {} as Record<string, string>
  )

export const getTemplateParameters = (
  isProduction: boolean
): Record<string, string> =>
  Object.values(externalizedLibs).reduce(
    (acc, lib) => {
      acc[`${lib.name}Url`] = lib.getUrl(isProduction)
      return acc
    },
    {} as Record<string, string>
  )
