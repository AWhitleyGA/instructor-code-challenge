$(document).ready(() => {

console.log('app.js connected')

let selectedMovie = {}

$('#search-form').on('submit', (evt) => {
  evt.preventDefault()
  let searchTerm = $('#search-form input[type="text"]').val()
  console.log(searchTerm)
  $.getJSON(`http://www.omdbapi.com/?s=${searchTerm}`, (results) => {
    let movies = results.Search
    console.log(movies)
    $('#results-gallery').html('')
    movies.forEach((movie) => {
      $('#results-gallery').append(
        `
        <div class="search-result" href="#">
          <a href="#" class="poster" name="${movie.imdbID}" style="background: url('${movie.Poster}'); background-size: contain; background-position: center bottom; background-repeat: no-repeat;"></a>
          <p>${movie.Title}</p>
        </div>
        `
      )
    })
    $('#search-page').hide()
    $('#results-page').show()


    $('.poster').on('click', (evt) => {
      evt.preventDefault()
      let imdbID = evt.target.name
      console.log(imdbID)
      $.getJSON(`http://www.omdbapi.com/?i=${imdbID}`, (result) => {
        $('#movie-details').html(
          `
          <div class="movie-details">
            <h2>${result.Title}</h2>
            <p>Released: ${result.Released}</p>
            <p>Directed by: ${result.Director}</p>
            <p>Written by: ${result.Writer}</p>
            <p>Actors: ${result.Actors}</p>
            <p>Plot Summary: ${result.Plot}</p>
          </div>
          <div class="movie-details-poster" style="background: url('${result.Poster}'); background-size: contain; background-position: center bottom; background-repeat: no-repeat;">
          </div>
          `
        )
        selectedMovie = result
        $('#results-page').hide()
        $('#movie-details-page').show()
      })
    })
  })
})

$('#add-favorite').on('click', () => {
  console.log(selectedMovie)
  $.ajax({
    url: '/favorites',
    type: 'post',
    dataType: 'json',
    data: selectedMovie
  }).done((favorites) => {
    console.log(favorites)
    favorites.forEach((movie) => {
      $('#favorites-gallery').append(
        `
        <div class="search-result" href="#">
          <div class="poster" name="${movie.imdbID}" style="background: url('${movie.Poster}'); background-size: contain; background-position: center bottom; background-repeat: no-repeat;"></div>
          <p>${movie.Title}</p>
        </div>
        `
      )
    })
    $('#movie-details-page').hide()
    $('#favorites-page').show()
  }).fail((error) => {
    console.log(error)
  })
})

$('#favorites-link').on('click', (evt) => {
  evt.preventDefault()
  $.getJSON('/favorites', (favorites) => {
    $('#favorites-gallery').html('')
    favorites.forEach((movie) => {
      $('#favorites-gallery').append(
        `
        <div class="search-result" href="#">
          <div class="poster" name="${movie.imdbID}" style="background: url('${movie.Poster}'); background-size: contain; background-position: center bottom; background-repeat: no-repeat;"></div>
          <p>${movie.Title}</p>
        </div>
        `
      )
    })
    $('.page-view').hide()
    $('#favorites-page').show()
  })
})

$('.search-link').on('click', (evt) => {
  evt.preventDefault()
  $('.page-view').hide()
  $('#search-page').show()
})

$('.results-link').on('click', (evt) => {
  evt.preventDefault()
  $('.page-view').hide()
  $('#results-page').show()
})






})
