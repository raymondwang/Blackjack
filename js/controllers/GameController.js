angular.module('Blackjack')
  .controller('GameController', GameController);

GameController.$inject = [
  'actionService',
  'gameModel',
  'Player'
];
function GameController(
  actionService,
  gameModel,
  Player
) {
  this.actions = actionService;
  this._model = gameModel;
  this._model.dealer = new Player({name: 'Dealer', isDealer: true});
  this._model.player = new Player({name: 'Player', isDealer: false});
}

GameController.prototype = {
  // Actions
  deal: function() {
    this.actions.deal();
  },
  hit: function() {
    this.actions.hit();
  },
  stand: function() {
    this.actions.stand();
  },
  down: function() {
    this.actions.down();
  },
  fold: function() {
    this.actions.fold();
  },
  changeBet: function(betAmount) {
    this._model.changeBet(betAmount);
  },
  hideMessage: function() {
    this._model.hideMessage();
  },
  // Defines getters/setters for the view
  get bankroll() {
    return this._model.bankroll;
  },
  get betAmount() {
    return this._model.betAmount;
  },
  get betPresets() {
    return this._model.betPresets;
  },
  get dealer() {
    return this._model.dealer;
  },
  get displayMessage() {
    return this._model.displayMessage;
  },
  get isDealing() {
    return this._model.isDealing;
  },
  get isGameOngoing() {
    return this._model.isGameOngoing;
  },
  get isGameStarted() {
    return this._model.isGameStarted;
  },
  get player() {
    return this._model.player;
  },
  get score() {
    return this._model.score;
  },
  set bankroll(bankroll) {
    this._model.bankroll = value;
  },
  set betAmount(betAmount) {
    this._model.changeBet(betAmount);
  }
}
