type ExternalizedLibs = Record<
  string,
  {
    id: string
    name: string
    templateName: string
    getUrl: (isProduction: boolean) => string
  }
>

export const externalizedLibs: ExternalizedLibs = {
  react: {
    id: 'react',
    name: 'react',
    templateName: 'react',
    getUrl: (isProduction) =>
      `https://esm.sh/react@19.2.0${isProduction ? '' : '?dev'}`,
  },
  reactDom: {
    id: 'react-dom',
    name: 'react-dom',
    templateName: 'reactDom',
    getUrl: (isProduction) =>
      `https://esm.sh/react-dom@19.2.0${isProduction ? '' : '?dev'}`,
  },
  reactDomClient: {
    id: 'react-dom/client',
    name: 'react-dom/client',
    templateName: 'reactDomClient',
    getUrl: (isProduction) =>
      `https://esm.sh/react-dom@19.2.0/client${isProduction ? '' : '?dev'}`,
  },
  d3: {
    id: 'd3',
    name: 'd3',
    templateName: 'd3',
    getUrl: (isProduction) =>
      `https://esm.sh/d3@7.9.0${isProduction ? '' : '?dev'}`,
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
      acc[`${lib.templateName}Url`] = lib.getUrl(isProduction)
      return acc
    },
    {} as Record<string, string>
  )
