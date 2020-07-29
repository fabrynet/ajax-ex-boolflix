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

// Milestone 3:
// In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse. Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/​ per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400​) per poi aggiungere la parte finale dell’URL passata dall’API.
// Esempio di URL che torna la copertina di BORIS:
// https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg

// Milestone 4:
// Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp, creando un layout completo simil-Netflix:
// ● Un header che contiene logo e search bar
// ● Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma
// di “card” in cui lo sfondo è rappresentato dall’immagine di copertina (​consiglio
// la poster_path con w342)​
// ● Andando con il mouse sopra una card (on hover), appaiono le informazioni
// aggiuntive già prese nei punti precedenti più la overview

// Milestone 5 (Opzionale):
// Partendo da un film o da una serie, richiedere all'API quali sono gli attori che fanno
// parte del cast aggiungendo alla nostra scheda Film / Serie SOLO i primi 5 restituiti
// dall’API con Nome e Cognome, e i generi associati al film con questo schema:
// “Genere 1, Genere 2, …”.

// Milestone 6 (Opzionale):
// Creare una lista di generi richiedendo quelli disponibili all'API e creare dei filtri con i
// generi tv e movie per mostrare/nascondere le schede ottenute con la ricerca.

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
    startSearch (query);
  }
}

function sendKeyup(event) {
  var input = $(this);
  var query = input.val();

  var keyWhich = event.which;
  var keyCode = event.keyCode;
  if ((keyWhich == 13 || keyCode == 13) && query) {
    startSearch (query);
  }
}

function startSearch (query) {
  $('.results h1').remove('');
  $('.results h5').remove('');
  $('.list-film').html('');
  $('.list-series').html('');
  getMovieDB(query, 'movie');
  getMovieDB(query, 'tv');
}

function getMovieDB (query, type) {

  $('#search-input').val('');

  $.ajax({
    url: `https://api.themoviedb.org/3/search/${type}`,
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
        printTitleResults(query, type);
        printResults(results, type);
      } else {
        printError(type);
      }
    },
    error: function(error) {
      printError(type);
    }
  });
}

function printTitleResults (query, type) {
  if (type == 'movie') {
    var typeTxt = 'Film';
    var target = $('.result-film');
  } else if (type == 'tv') {
    var typeTxt = 'Serie TV';
    var target = $('.result-series');
  }
  var template = $('#result-title-template').html();
  var compiled = Handlebars.compile(template);
  var obj = {
    type: typeTxt,
    query: query
  }
  var compiledHTML = compiled(obj);
  target.prepend(compiledHTML);
}

function printResults (results, type) {

  var targetFilm = $('.list-film');
  var targetSeries = $('.list-series');

  var template = $('#result-template').html();
  var compiled = Handlebars.compile(template);

  for (var i = 0; i < results.length; i++) {

    var result = results[i];

    if (type == 'tv') {
      result.type = "Serie TV";
      result.title = result.name;
      result.original_title = result.original_name;
    } else if (type == 'movie') {
      result.type = "Film";
    }

    var voteAverage = result.vote_average;
    result.stars = getStars(voteAverage);

    var originalLanguage = result.original_language;
    result.flag = getFlag(originalLanguage);

    var posterPath = result.poster_path;
    if (posterPath) {
      result.poster = getPoster(posterPath);
    } else {
      result.poster_default = 'img/ciak.png';
    }

    var compiledHTML = compiled(result);

    if (type == 'tv') {
      targetSeries.append(compiledHTML);
    } else if (type == 'movie') {
      targetFilm.append(compiledHTML);
    }

  }
}

function getPoster (posterPath) {
  var urlBase = 'https://image.tmdb.org/t/p/';
  var posterSize = 'w342';
  var poster = `${urlBase}${posterSize}${posterPath}`;
  console.log(poster);
  return poster;
}

function getFlag (originalLanguage) {
  var flags =['de','en','es','fr','it','ja','us'];
  if (flags.includes(originalLanguage)) {
    flag = `<img class="flag" src="flags/${originalLanguage}.png">`;
  }
  return flag;
}

function getStars (voteAverage) {

  var starsFilled = Math.ceil(voteAverage / 2);
  var starsEmpty = 5 - starsFilled;
  var stars = '';

  for (var i = 0; i < starsFilled; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  for (var i = 0; i < starsEmpty; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  return stars;
}

function printError (type) {

  var template = $('#error-template').html();
  var compiled = Handlebars.compile(template);

  if (type == 'movie') {
    var txt = "Film";
    var target = $('.list-film');
  } else if (type == 'tv') {
    var txt = "Serie TV";
    var target = $('.list-series');
  } else {
    var txt = "risultati";
    var target = $('.list-film');
  }
  var error = `Non ci sono ${txt} che corrispondano alla tua ricerca.`;

  var compiledHTML = compiled({
    error: error
  });
  target.append(compiledHTML);
}

function init() {
  addListeners();
}

$(document).ready(init);
