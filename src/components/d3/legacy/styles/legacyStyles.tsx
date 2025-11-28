import { Global, css } from '@emotion/react'
import { mediaQueries } from 'src/styles/theme'

const legacyStyles = css`
  .legacy {
    background: rgb(210, 220, 230);

    * {
      color: black;
    }

    /* Non-viz styles */
    header {
      align-items: center;
      background: white;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      margin-bottom: 5px;
      position: relative;
      padding: 10px;

      > h1 {
        font-size: 28px;
        margin-bottom: 0;
      }

      > button {
        left: 10px;
        padding: 10px;
        position: absolute;
      }

      ${mediaQueries.tablet} {
        > h1 {
          font-size: 20px;
        }

        > a {
          left: 5px;
          padding: 5px;
          position: absolute;
        }
      }
    }

    .links {
      align-items: center;
      background: white;
      bottom: 0;
      display: flex;
      height: 5vh;
      justify-content: space-around;
      position: fixed;
      width: 100%;

      ${mediaQueries.tablet} {
        font-size: 14px;
        height: 4vh;
      }
    }

    main {
      align-items: center;
      display: flex;
      flex-direction: column;
    }

    .instructions {
      background: white;
      border-radius: 5px;
      padding: 8px;

      h1 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
      }

      ul {
        display: flex;
        flex-direction: column;
        font-weight: 300;
        margin-right: 16px;
        margin-bottom: 0;

        li {
          font-size: 16px;
          list-style-type: square;
          margin-bottom: 3px;
        }
      }

      ${mediaQueries.tablet} {
        h1 {
          font-size: 14px;
          font-weight: 400;
        }

        li {
          font-size: 12px;
          list-style-type: square;
          margin-bottom: 3px;
        }
      }
    }

    /* Inputs */
    .inputs {
      display: flex;
      font-size: 13px;
      font-weight: 400;
      justify-content: center;
      margin: 5px 0;
      width: 100%;

      > * {
        margin-right: 5px;

        &:last-child {
          margin-right: 0;
        }

        &:disabled {
          color: #cdcdcd;
        }
      }

      ${mediaQueries.tablet} {
        flex-wrap: wrap;

        > * {
          margin-bottom: 5px;
        }
      }
    }

    #subreddit-input {
      border-radius: 5px;
      font-size: 13px;
      font-weight: 300;
      height: 30px;
      margin-right: 5px;
      padding: 0 8px;
      width: 200px;

      &::placeholder {
        font-size: 13px;
      }

      ${mediaQueries.tablet} {
        width: auto;
      }
    }

    #sort-input,
    #suggestions {
      background-color: white;
      border-radius: 5px;
      height: 30px;
    }

    #date-range {
      height: 30px;
    }

    .submit {
      border-radius: 5px;
      box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      height: 30px;

      &:hover {
        filter: brightness(80%);
      }

      &:active {
        box-shadow: none;
        left: 3px;
        position: relative;
        top: 3px;
      }
    }

    /* Visualization container */
    #visualization {
      background: white;
      height: 70vh;
      width: 90vw;

      ${mediaQueries.tablet} {
        width: 100vw;
      }
    }

    .visualization-container {
      position: relative;
    }

    .visualization-options {
      display: flex;
      height: 42px;
      justify-content: flex-end;
      position: absolute;
      right: 3px;
      top: 3px;

      > * {
        border-radius: 3px;
        cursor: pointer;
        margin-left: 10px;
        width: 42px;
      }
    }

    .bubble-button-icon {
      height: 75%;
    }

    .fa-chart-bar {
      font-size: 28px;
    }

    .interaction-tips {
      font-size: 18px;
      font-weight: bold;
      text-anchor: middle;
    }

    /* Bars */
    .bar {
      cursor: pointer;
      fill: rgb(78, 146, 201);
      transition: fill 0.3s;

      &:hover {
        fill: rgb(50, 106, 151);
      }
    }

    .hover-rect {
      cursor: pointer;
      opacity: 0;
    }

    .bar-label {
      font-size: 12px;
      font-family: sans-serif;
      pointer-events: none;
      text-anchor: middle;
    }

    .x-axis text {
      font-size: 12px;
      pointer-events: none;
      text-anchor: start;
      transform: rotate(45deg);
    }

    .y-axis text {
      font-size: 20px;
      font-weight: bold;
      pointer-events: none;
      text-anchor: middle;
    }

    /* Bubbles */
    .bubble {
      cursor: pointer;

      &:hover {
        stroke: black;
        stroke-width: 2px;
      }
    }

    .legend-circle {
      fill: rgb(199, 230, 255);
      stroke: steelblue;
    }

    .legend-label {
      fill: black;
      font-size: 12px;
      text-anchor: middle;
    }

    .legend-header {
      font-size: 1.3rem;
      pointer-events: none;
      text-anchor: middle;
    }

    /* Scatter */
    .axis {
      pointer-events: none;
    }

    /* Tooltip */
    #tooltip {
      background-color: white;
      border-radius: 5px;
      box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
      max-height: 600px;
      overflow: hidden;
      padding: 10px;
      pointer-events: none;
      position: absolute;
      width: 300px;
      z-index: 2;
      text-align: center;

      > h2 {
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: 500;

        > span {
          font-weight: 300;
        }
      }

      h1 {
        color: black;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .hidden {
      display: none;
    }

    #pic {
      max-width: 100%;
      max-height: 300px;
    }

    .no-image {
      height: 100px !important;
    }
  }
`

const LegacyStyles = () => <Global styles={legacyStyles} />

export default LegacyStyles
