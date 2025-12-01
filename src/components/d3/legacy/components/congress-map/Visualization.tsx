const Visualization = () => {
  return (
    <>
      <div id="container" />
      <p
        style={{ textAlign: 'left', margin: '2rem auto 0', maxWidth: '120vh' }}
      >
        Notes: 1) geographic anomalies are present in the original Census Bureau
        shapefile, 2) Districts numbered "00" are "at large" districts that
        represent an entire state.
      </p>
    </>
  )
}

export default Visualization
