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
  searchButton.click(search);
  searchInput.keyup(sendKeyup);
}

function sendKeyup(event) {
  var input = $(this);
  var query = input.val();
  var keyWhich = event.which;
  var keyCode = event.keyCode;
  if (keyWhich == 13 || keyCode == 13) {
    console.log('keyup');
    search();
  }
}

function search () {
  console.log('click');
}

function init() {
  addListeners();
}

$(document).ready(init);
