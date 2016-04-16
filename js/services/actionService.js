angular.module('Blackjack')
  .service('actionService', ActionService);

ActionService.$inject = ['$interval', '$timeout', 'deckService', 'gameModel'];
function ActionService($interval, $timeout, deckService, gameModel) {
  this.$interval = $interval;
  this.$timeout = $timeout;
  this.deckService = deckService;
  this.model = gameModel;
}

ActionService.prototype = {
  deal: function() {
    var that = this, delay = 0, dealCards;

    if (this.model.isDealing) {
      return;
    }
    if (!this.model.isGameValid()) {
      if (this.model.isPlayerBroke()) {
        this.model.setMessage('You don\'t have enough money!');
      } else {
        this.model.setMessage('Invalid bet amount.');
      }
      return;
    }

    if (!this.model.isGameStarted) {
      this.model.startGame();
    } else {
      delay += 1000;
      this.model.resetBoard();
    }

    this.model.placeBet();
    this.model.isDealing = true;

    dealCards = this.$interval(function() {
      that.model.player.hand.length === that.model.dealer.hand.length ?
          that.model.player.draw() : that.model.dealer.draw();
    }, 500, 4);

    dealCards.then(function() {
      that.model.isGameOngoing = true;
      that.model.isDealing = false;

      that._evaluateGame();
    });
  },
  hit: function() {
    this.model.player.draw();
    this._evaluateGame();
  },
  stand: function() {
    this.model.isStanding = true;
    this._evaluateGame();
  },
  down: function() {
    // Checks whether the player is able to double down
    if (this.model.bankroll - this.model.betAmount < 0) {
      this.model.setMessage('Can\'t afford to double down!');
      return;
    }

    this.model.doubleDown();
    this.model.player.draw();
    this.model.isStanding = true;
    this._evaluateGame();
  },
  fold: function() {
    // Checks whether the player is able to surrender
    if (this.model.player.hand.length > 2) {
      this.model.setMessage('Can\'t surrender!');
      return;
    }

    this.model.endGame('loss', 'You have surrendered.', 0.5);
  },
  _drawToEnd: function() {
    var that = this,
        delay = 500,
        drawInterval;

    if (this.model.dealer.hasHole) {
      this.model.dealer.revealHole();
    }

    if (this.model.dealer.points > 17) {
      this._evaluateGame();
    // Only continue drawing if player didn't draw a natural 21
    } else if (this.model.player.points === 21 &&
          this.model.player.hand.length === 2) {
      this.model.endGame('win', 'Natural 21! You win!', 3);
    } else {
      drawInterval = this.$interval(function() {
        that.model.dealer.draw();
        delay += 500;

        if (that.model.dealer.points > 17) {
          that.$interval.cancel(drawInterval);
          that._evaluateGame();
        }
      }, delay);
    }
  },
  _evaluateGame: function() {
    var playerPoints = this.model.player.points,
        dealerPoints = this.model.dealer.points;

    if (playerPoints === 21 || dealerPoints === 21) {
      this._evaluateBlackjack();
    } else if (playerPoints > 21 || dealerPoints > 21) {
      this._evaluateBust();
    } else if (this.model.isStanding) {
      this._evaluateStand();
    }
  },
  _evaluateBlackjack: function() {
    var playerPoints = this.model.player.points,
        dealerPoints = this.model.dealer.points;

    if (playerPoints === 21 && dealerPoints === 21) {
      // Checks for natural blackjacks
      if (this.model.player.hand.length === 2 &&
          this.model.dealer.hand.length === 2) {
        this.model.endGame('tie', 'Blackjack push!', 1);
      } else if (this.model.player.hand.length === 2) {
        this.model.endGame('win', 'Natural 21! You win!', 3);
      } else if (this.model.dealer.hand.length === 2) {
        this.model.endGame('loss', 'Dealer blackjack! You lose!');
      } else {
        this.model.endGame('tie', 'Blackjack push!', 1);
      }
    } else if (playerPoints === 21) {
      if (dealerPoints < 17) {
        this._drawToEnd();
      } else {
        this.model.endGame('win', 'Blackjack! You win!', 2);
      }
    } else if (dealerPoints === 21) {
      this.model.endGame('loss', 'Dealer blackjack! You lose!');
    }
  },
  _evaluateBust: function() {
    var playerPoints = this.model.player.points,
        dealerPoints = this.model.dealer.points;

    if (playerPoints > 21) {
      if (this.model.player.aces) {
        this.model.player.reduceAce();
        this._evaluateGame();
      } else {
        this.model.endGame('loss', 'Bust! You lose!');
      }
    } else if (dealerPoints > 21) {
      if (this.model.dealer.aces) {
        this.model.dealer.reduceAce();
        this._evaluateGame();
      } else {
        this.model.endGame('win', 'Dealer bust! You win!', 2);
      }
    }
  },
  _evaluateStand() {
    var playerPoints = this.model.player.points,
        dealerPoints = this.model.dealer.points;

    if (dealerPoints < 17) {
      this._drawToEnd();
      return;
    }

    if (playerPoints === dealerPoints) {
      this.model.endGame('tie', 'Push!', 1);
    } else if (playerPoints > dealerPoints) {
      this.model.endGame('win', 'You win!', 2);
    } else if (playerPoints < dealerPoints) {
      this.model.endGame('loss', 'You lose!');
    }
  }
}
