$(document).ready(function() {

  function Player(name) {
    this.name = name; // might throw this up in an initial setup menu, along with deck amount and bankroll
    this.hand = {cards: [], total: 0};
    // this.bankroll = options.bankroll || dealing with money later;
  };

  // Draws card
  Player.prototype.drawCard = function drawCard(num) {
    if (typeof num === 'undefined') {
      num = 1;
    }
    for (var i = 0; i < num; i++) {
      var draw = deck.pop();
      this.hand.cards.push(draw.name);
      this.hand.total += draw.value; // evaluate A value
      var image = 'images/' + draw.name.replace(/\s+/g, '') + '.png';
      var card = $('<img>').attr('src', image);
      card.addClass('card');
      var space = $('#' + this.name + 'Space');
      space.append(card);
    }
  };

  // Player.prototype.getBankroll = function getBankroll() {
  //   might make this a button in the menu actually
  // }

  // Player.prototype.placeBet = function placeBet() {
  //  throw this up as a + - interface next to bet buttons, above menu
  // }

  // Creates deck
  function createDeck() {
    var numberOfDecks = 3; // can do as input
    var deck = [];
    var ace = 'A';
    var face = ['J', 'Q', 'K'];
    var suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];

    for (var x = 0; x < numberOfDecks; x++) {
      for (var i = 0; i < suits.length; i++) {
        deck.push({
          name: ace + ' of ' + suits[i],
          value: 1
        });

        for (var j = face.length - 1; j >= 0; j--) {
          deck.push({
            name: face[j] + ' of ' + suits[i],
            value: 10
          });
        }

        for (var k = 10; k >= 2; k--) {
          deck.push({
            name: k + ' of ' + suits[i],
            value: k
          });
        }
      }
    }
    return shuffle(deck); // shuffles deck before returning
  };

  // shuffle function
  function shuffle(deck) {
    var m = deck.length;
    var t; //placeholder
    var i; //placeholder

    while (m) { // while there are still cards that need to be shuffled

      i = Math.floor(Math.random() * m--); // pick a random card
      t = deck[m]; // move current element to the end
      deck[m] = deck[i]; // set length of unshuffled deck to card
      deck[i] = t; // shuffle card
    }

    return deck;
  };

  var deck = createDeck();
  var player = new Player('player');
  var dealer = new Player('dealer');
  player.drawCard(2);
  dealer.drawCard(2);

  function hit() {
    var hitAction = $('#hit');
    hitAction.on('click', function() {
      player.drawCard();
      // if (dealerLogic = true) {
        dealer.drawCard();
      // }
    });
  };
  hit();
});
