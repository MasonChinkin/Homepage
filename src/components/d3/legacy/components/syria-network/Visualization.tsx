const Visualization = () => {
  return (
    <>
      <p style={{ textAlign: 'left', margin: '0 auto', maxWidth: '780px' }}>
        A simplified, easier to understand version of{' '}
        <a href="http://i.imgur.com/h8j3Frv.jpg">
          <b>this infographic</b>
        </a>
        . Hovering the mouse will highlight the selected country's
        relationships. I used arcs instead of lines to allow showing Assad both
        supporting and fighting ISIS.
      </p>

      <div id="container" />
    </>
  )
}

export default Visualization
