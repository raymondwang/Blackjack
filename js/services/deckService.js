angular.module('Blackjack')
  .service('deckService', DeckService);

function DeckService() {};
DeckService.prototype = {
  createDeck: function(deck) {
    var faceCards = ['Jack', 'Queen', 'King'];
    var suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];

    for (var suit = 0; suit < suits.length; suit++) {
      for (var cardNumber = 2; cardNumber < 11; cardNumber++) {
        deck.push({
          name: cardNumber + ' of ' + suits[suit],
          value: cardNumber
        });
      }

      for (var faceCard = 0; faceCard < faceCards.length; faceCard++) {
        deck.push({
          name: faceCards[faceCard] + ' of ' + suits[suit],
          value: 10
        });
      }

      deck.push({
        name: 'Ace of ' + suits[suit],
        value: 11
      });
    }

    return deck;
  },
  shuffle: function(deck) {
    var m = deck.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = deck[m];
      deck[m] = deck[i];
      deck[i] = t;
    }
  }
};
