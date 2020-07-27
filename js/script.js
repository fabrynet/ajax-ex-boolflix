// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto
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
    search(query);
  }
}

function search (query) {

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
    var compiledHTML = compiled({
      title: result.title,
      original_title: result.original_title,
      original_language: result.original_language,
      vote_count: result.vote_count
    });
    target.append(compiledHTML);
  }
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
