// document ready containing function to ensure proper event handling / no exposed global variables
$(document).ready(() => {


let selectedMovie = {}

// event handling for search form submission
$('#search-form').on('submit', (evt) => {
  // prevent page reload
  evt.preventDefault()
  let searchTerm = $('#search-form input[type="text"]').val()
  console.log(searchTerm)
  // send JSON request to OMDB API with query interpolated into URL
  $.getJSON(`http://www.omdbapi.com/?s=${searchTerm}`, (results) => {
    let movies = results.Search
    console.log(movies)
    $('#results-gallery').html('')
    // loop through results and create movie icons for each result
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

    // attach event listeners to appended movie icons to link to movie details
    $('.poster').on('click', (evt) => {
      evt.preventDefault()
      let imdbID = evt.target.name
      console.log(imdbID)
      // retrieve full movie details from OMDB API when movie is selected by interpolating the imdbID into query
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
        // save selected movie to external variable for use in favoriting
        selectedMovie = result
        $('#results-page').hide()
        $('#movie-details-page').show()
      })
    })
  })
})

// add event listener to favorite button to trigger saving movie to back-end
$('#add-favorite').on('click', () => {
  // send http POST request to back-end with data from external variable
  $.ajax({
    url: '/favorites',
    type: 'post',
    dataType: 'json',
    data: selectedMovie
  }).done((favorites) => {
    // when finished, update and re-render favorites view
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
    $('#movie-details-page').hide()
    $('#favorites-page').show()
  }).fail((error) => {
    console.log(error)
  })
})

// handle link navigation to favorites page
$('#favorites-link').on('click', (evt) => {
  evt.preventDefault()
  // send http GET request to back-end for current favorites
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

// handle link navigation to search page
$('.search-link').on('click', (evt) => {
  evt.preventDefault()
  $('.page-view').hide()
  $('#search-page').show()
})

// handle link navigation to results page
$('.results-link').on('click', (evt) => {
  evt.preventDefault()
  $('.page-view').hide()
  $('#results-page').show()
})







})
