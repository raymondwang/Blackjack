angular.module('Blackjack')
  .factory('Player', PlayerFactory);

PlayerFactory.$inject = ['$interval', 'gameModel'];
function PlayerFactory($interval, gameModel) {
  function Player(options) {
    this.name = options.name;
    this.isDealer = options.isDealer;
    this.hand = [];
    this.points = 0;
    this.displayPoints = 0;
    this.aces = 0;
    this.hasHole = false;
  }

  Player.prototype = {
    draw: function() {
      var card = gameModel.deck.pop();

      // Obscures the first card that the dealer draws
      if (this.isDealer && this.hand.length === 0) {
        card.isHole = true;
        this.hasHole = true;
      } else {
        this._updatePoints(card.value);
        if (card.value === 11) {
          this.aces++;
        }
      }

      this.hand.push(card);
    },
    revealHole: function() {
      var hole = this.hand.find(function(card) {
        return card.isHole;
      });

      hole.isHole = false;
      this.hasHole = false;
      document.querySelector('.card--hole').classList.add('flipped');
      this._updatePoints(hole.value);
    },
    reduceAce: function() {
      var ace = this.hand.find(function(card) {
        return card.value === 11;
      });

      ace.value = 1;
      this._updatePoints(-10);
      this.aces--;
    },
    emptyHand: function() {
      this.hand.length = 0;
      this._updatePoints(0);
      this.aces = 0;
    },
    _updatePoints: function(value) {
      value = value ? value : this.points * -1;
      this.points += value;

      var that = this,
          absoluteValue = Math.abs(value),
          interval = absoluteValue <= 10 ? 30 : 500 / absoluteValue;

      $interval(function() {
        // Increment points
        that.displayPoints += value / absoluteValue;
      }, interval, absoluteValue);
    }
  }

  return Player;
}
