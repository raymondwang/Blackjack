angular.module('Blackjack')
  .service('gameModel', GameModel);

GameModel.$inject = ['deckService'];
function GameModel(deckService) {
  this.deckService = deckService;

  this.deck = [];
  this.bankroll = 100;
  this.betAmount = 25;
  this.betPresets = [5, 10, 25];
  this.score = { wins: 0, losses: 0, ties: 0 };

  this.isGameStarted = false;
  this.isGameOngoing = false;
  this.isDealing = false;
  this.isStanding = false;
  this.isDoubledDown = false;

  this.displayMessage = '';
}

GameModel.prototype = {
  startGame: function() {
    this.isGameStarted = true;

    // initialize with 2 decks
    for (var i = 0; i < 2; i++) {
      this.deckService.createDeck(this.deck);
    }

    this.deckService.shuffle(this.deck);
  },
  endGame: function(result, endMessage, payoutRatio) {
    if (result === 'win') {
      this.score.wins++;
    } else if (result === 'loss') {
      this.score.losses++;
    } else if (result === 'tie') {
      this.score.ties++;
    }

    this.setMessage(endMessage);

    if (payoutRatio) {
      this.payout(payoutRatio);
    }

    this.isStanding = false;
    this.isGameOngoing = false;
  },
  resetBoard: function() {
    this.player.emptyHand();
    this.dealer.emptyHand();

    // Replenish deck
    if (this.deck.length < 52) {
      this.deck = this.deckService.createDeck(this.deck);
      this.deckService.shuffle(this.deck);
    }
  },
  isGameValid: function() {
    return this.bankroll && this.betAmount && this.betAmount >= 5 &&
        this.bankroll >= this.betAmount;
  },
  isPlayerBroke: function() {
    return this.bankroll < 5;
  },
  changeBet: function(betAmount) {
    this.betAmount = betAmount;
  },
  placeBet: function() {
    this.bankroll -= this.betAmount;
  },
  doubleDown: function() {
    this.isDoubledDown = true;
    this.placeBet();
    this.changeBet(this.betAmount * 2);
  },
  payout: function(ratio) {
    this.bankroll += this.betAmount * ratio;

    // Rounds down
    if (this.bankroll % 1 !== 0) {
      this.bankroll = Math.floor(this.bankroll);
    }
  },
  setMessage: function(message) {
    this.displayMessage = message;
  },
  hideMessage: function() {
    if (this.isDoubledDown && !this.isGameOngoing) {
      this.betAmount /= 2;
      this.isDoubledDown = false;
    }
    this.displayMessage = '';
  }
}
