// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=s
// crubs

// API: c089b873cc8df04b58b3abbdc34899b0

function addListeners() {
  var searchButton = $('#search-button');
  var searchInput = $('#search-input');
  searchButton.click(sendClick);
  searchInput.keyup(sendKeyup);
}

function sendClick() {
  var input = $('#search-input');
  var query = input.val();
  if (query) {
    search(query);
  }
}

function sendKeyup(event) {
  var input = $(this);
  var query = input.val();

  var keyWhich = event.which;
  var keyCode = event.keyCode;
  if ((keyWhich == 13 || keyCode == 13) && query) {
    searchMovies(query);
  }
}

function searchMovies (query) {

  var searchInput = $('#search-input');
  searchInput.val('');

  $.ajax({
    url: 'https://api.themoviedb.org/3/search/movie',
    method: 'GET',
    data: {
      'api_key': 'c089b873cc8df04b58b3abbdc34899b0',
      'query': query,
      'language': 'it-IT'
    },
    success: function(data) {
      var results = data['results'];
      var totalResults = data['total_results'];
      if (totalResults > 0) {
        printResults(results);
      } else {
        printError();
      }
    },
    error: function(error) {
      printError();
    }
  });
}

function printResults (results) {

  var target = $('.results');
  target.html('');
  var template = $('#result-template').html();
  var compiled = Handlebars.compile(template);

  for (var i = 0; i < results.length; i++) {

    var result = results[i];
    var voteAverage = result.vote_average;

    result['stars'] = printStars(voteAverage);

    var compiledHTML = compiled(result);
    target.append(compiledHTML);

  }
}

function printStars (voteAverage) {

  var starsFilled = Math.ceil(voteAverage / 2);
  var starsEmpty = 5 - starsFilled;

  var stars = [];

  for (var i = 0; i < starsFilled; i++) {
    stars.push('fas');
  }
  for (var i = 0; i < starsEmpty; i++) {
    stars.push('far');
  }

  return stars;
}

function printError () {
  var target = $('.results');
  target.html('');
  var template = $('#error-template').html();
  var compiled = Handlebars.compile(template);
  var compiledHTML = compiled({
    error: "Non ci sono film che corrispondano alla tua ricerca."
  });
  target.append(compiledHTML);
}

function init() {
  addListeners();
}

$(document).ready(init);
