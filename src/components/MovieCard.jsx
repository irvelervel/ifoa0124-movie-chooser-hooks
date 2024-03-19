import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'

const MovieCard = function ({ movieTitle }) {
  const [movieData, setMovieData] = useState(null)

  // scriviamo una funzione in grado di contattare le OMDB api e recuperare il titolo del film attualmente selezionato
  const fetchMovieInfo = () => {
    // fetchMovieInfo contatterà le API, recupererà il valore di ricerca più plausibile (il primo dei risultati) e
    // salverà questo oggetto nello state
    fetch('http://www.omdbapi.com/?apikey=24ad60e9&s=' + movieTitle)
      // es. "http://www.omdbapi.com/?apikey=24ad60e9&s=Iron man"
      // es. "http://www.omdbapi.com/?apikey=24ad60e9&s=Deadpool"
      .then((response) => {
        // se siamo finiti qui, la Promise della fetch si è risolta!
        if (response.ok) {
          // se finiamo qui, abbiamo probabilmente ottenuto quello che volevamo!
          // questa response contiene tante cose, per esempio lo status code, la proprietà ok etc.
          // una cosa che non contiene, però, è il JSON con i dati del server
          console.log('RESPONSE', response)
          // estraiamo il JSON dalla response
          return response.json()
        } else {
          // se finiamo qui, il server non ci ha tornato quello che volevamo...
          // es. 400, 404, 500
          throw new Error('Errore nel recupero dati del film')
        }
      })
      .then((data) => {
        console.log('JSON DALLE API', data)
        // ora lo salveremo nello stato del componente
        setMovieData(data.Search[0])
      })
      .catch((err) => {
        console.log('ERRORE', err)
      })
  }

  useEffect(() => {
    fetchMovieInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieTitle])

  // esegue fetchMovieInfo() una volta all'avvio, e poi lo ri-esegue ogni volta che cambia movieTitle

  return (
    <>
      {!movieData && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {movieData && (
        <Card>
          <Card.Img variant="top" src={movieData.Poster} alt="movie poster" />
          <Card.Body>
            <Card.Title>{movieData.Title}</Card.Title>
            <Card.Text>
              {movieData.Year} - {movieData.imdbID}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </>
  )
}

export default MovieCard
