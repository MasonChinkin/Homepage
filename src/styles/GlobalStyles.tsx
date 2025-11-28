import { Global, css } from '@emotion/react'
import { colors, mediaQueries } from './theme'

const globalStyles = css`
  /* Reset styles */
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  select,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: inherit;
    font: inherit;
    vertical-align: baseline;
    text-decoration: none;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  select,
  input,
  section {
    display: block;
  }

  body {
    line-height: 1;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  html {
    box-sizing: border-box;
    background-color: ${colors.background};
    font-family: sans-serif, roboto;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  input,
  textarea,
  select,
  a {
    border-width: inherit;
    outline: none;
  }

  body::-webkit-scrollbar {
    width: 0 !important;
  }

  body {
    margin: 0;
    padding: 0;
    overflow-y: hidden;
    overscroll-behavior: none;

    &:hover {
      overflow-y: scroll;
    }

    h1,
    h2,
    h3,
    p,
    ul {
      color: ${colors.white};
      line-height: initial;
    }

    h1 {
      font-weight: 800;
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    h2 {
      font-weight: 600;
      font-size: 2rem;
      margin-bottom: 1.5rem;
      text-align: center;

      ${mediaQueries.mobile} {
        margin-bottom: 1rem;
      }
    }

    h3 {
      font-weight: 600;
      font-size: 2rem;
      margin: 1.5rem 0;
    }

    h4 {
      font-weight: 600;
      font-size: 2rem;
      margin: 1.5rem 0;
    }

    p {
      font-size: 1.1rem;
    }
  }

  /* Scoped anchor styles - only for content areas, not header or legacy */
  main a {
    color: ${colors.cornflowerblue};
  }

  main {
    position: relative;
    margin: auto;
    padding-bottom: 5rem;

    ${mediaQueries.phone} {
      width: 100vw !important;
    }
  }

  /* Keyframe animations */
  @keyframes placeHolderShimmer {
    from {
      background-position: -800px 0;
    }
    to {
      background-position: 800px 0;
    }
  }

  @keyframes slideInFromAbove {
    from {
      top: -6rem;
    }
    to {
      top: 0;
    }
  }

  @keyframes slideInFromLeft {
    from {
      left: -6rem;
    }
    to {
      left: 0;
    }
  }

  /* Root background */
  #root {
    min-height: 100vh;
    background: radial-gradient(
      ellipse at bottom,
      #1b2735 0%,
      ${colors.background} 100%
    );
    overflow: hidden;
  }
`

const GlobalStyles = () => <Global styles={globalStyles} />

export default GlobalStyles
