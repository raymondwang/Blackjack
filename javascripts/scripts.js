$(document).ready(function() {

  function Player(name, nickname) {
    this.name = name; // might throw this up in an initial setup menu, along with deck amount and bankroll
    this.nickname = nickname;
    this.hand = {cards: [], total: 0, stand: false};
    this.menu = $('#' + this.name + 'Stats');
    // this.bankroll = options.bankroll || dealing with money later;
  };

  Player.prototype.makeTable = function makeTable() {
    this.space = $('<div>').attr('id', this.name + 'Space');
    $('body').append(this.space);
    this.stats = $('<div>').attr('id', this.name + 'Stats');
    this.spade = $('<li>').addClass("spade").html('&spades;<span class="colon">:</span>');
    this.hpBar = $('<div>').attr('id', this.name + 'HP').addClass('hpBar');
    this.meter = $('<div>').attr('id', this.name + 'Meter');
    this.hpBar.append(this.meter);
    this.handVal = $('<li>').attr('id', this.name + 'Value').addClass('handValue');
    this.handTotal = $('<div>').attr('id', this.name + 'Total');
    this.stats.append(this.spade, this.hpBar, this.handTotal);
    this.handTotal.append(this.handVal);
    $('body').append(this.stats);
    var addName = ($('<p>').text(this.nickname.toUpperCase()).attr('id', this.name + 'Name').addClass('name'));
    $('body').append(addName);
  }

  Player.prototype.blackjackMeter = function blackjackMeter() {
    var color;
    this.handVal = $('#' + this.name + "Value");
    if (this.hand.total >= 0 && this.hand.total < 21) {
      value = ((0.88095238095) * this.hand.total) + 'vw';
      color = 'blue';
      this.handVal.text(this.hand.total + ' / 21');
      if (this.hand.total < 10) {
        this.spade.html('&diams;<span class="colon">:</span>').css({color: 'red'});
      } else {
        this.spade.html('&clubs;<span class="colon">:</span>').css({color: 'black'});
      }
    } else if (this.hand.total === 21) {
      value = '18.5vw';
      color = 'yellow';
      this.handVal.text('BLACKJACK!');
      this.spade.html('&spades;<span class="colon">:</span>').css({color: 'yellow'});
    } else {
      value = '18.5vw';
      color = 'red';
      this.handVal.text('BUST!');
      this.spade.html('&hearts;<span class="colon">:</span>').css({color: 'red'});
    }
    this.meter.css({backgroundColor: color, height: '0.5vh', 'width': value});
  }

  // Draws card
  Player.prototype.drawCard = function drawCard() {
    var draw = deck.pop();
    this.hand.cards.push(draw.name);
    this.hand.total += draw.value; // evaluate A value
    var image = 'images/' + draw.name.replace(/\s+/g, '') + '.png';
    var card = $('<img>').attr('src', image);
    card.addClass('card');
    this.space.append(card);
    this.blackjackMeter();
    checkWin();
  };

  // Player.prototype.getBankroll = function getBankroll() {
  //   might make this a button in the menu actually
  // }

  // Creates deck
  function createDeck() {
    var numberOfDecks = 3; // can do as input
    var deck = [];
    var ace = 'ace';
    var face = ['jack', 'queen', 'king'];
    var suits = ['diamonds', 'clubs', 'hearts', 'spades'];

    for (var x = 0; x < numberOfDecks; x++) {
      for (var i = 0; i < suits.length; i++) {
        deck.push({
          name: ace + '_of_' + suits[i],
          value: 11
        });

        for (var j = face.length - 1; j >= 0; j--) {
          deck.push({
            name: face[j] + '_of_' + suits[i],
            value: 10
          });
        }

        for (var k = 10; k >= 2; k--) {
          deck.push({
            name: k + '_of_' + suits[i],
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

  function makeHeader() {
    var navbar = $('#navbar');
    var title = $('<h1>').attr('id', 'title').addClass('nav').text('Blackjack');
    var displayBankroll = $('<h1>').attr('id', 'bankroll').addClass('nav').text('Bankroll: $' + bankroll);
    var displayBet = $('<h1>').attr('id', 'bet').addClass('nav').text('Bet: $' + bet);
    var kda = $('<h1>').attr('id', 'kda').addClass('nav').text('W' + wins + ' L' + losses + ' T' + ties);
    navbar.append(title, displayBankroll, displayBet, kda);

    var chooseBet = $('#betList');
    chooseBet.append($('<h3>').addClass('betText').text('BET '));
    chooseBet.append($('<li>').addClass('selectBet').text('$5'));
    chooseBet.append($('<li>').addClass('selectBet').text('$10'));
    chooseBet.append($('<li>').addClass('selectBet').text('$25'));
    var prompt = $('<p>').attr('id', 'prompt').html('What will<br>' + player.nickname + ' do?');
    $('#bottom').prepend(prompt);
    $('#bottom').prepend(chooseBet);
  }

  function updateHeader() {
    var displayBankroll = $('#bankroll');
    displayBankroll.text('Bankroll: $' + bankroll);
    var displayBet = $('#bet');
    // bet stuff
    var kda = $('#kda');
    updateScore();
    kda.text('W' + wins + ' L' + losses + ' T' + ties);
  }

  function placeBet() {
    bankroll -= bet;
  };

  function deal() {
    placeBet();
    updateHeader();
    player.space.empty();
    dealer.space.empty();
    player.hand = {cards: [], total: 0, stand: false};
    dealer.hand = {cards: [], total: 0, stand: false};
    player.drawCard();
    player.drawCard();
    dealer.drawCard();
    dealer.drawCard();
    if (winner === null) {
      hideReset();
    }
  }

  function showReset() {
    $('#reset').css({display: 'block'});
    $('#actions').css({display: 'none'});
    $('#prompt').css({display: 'none'});
    $('#betList').css({display: 'block'});
  }

  function hideReset() {
    $('#reset').css({display: 'none'});
    $('#actions').css({display: 'block'});
    $('#prompt').css({display: 'block'});
    $('#betList').css({display: 'none'});
  }

  function newGame() {
    $('#reset').on('click', function() {
      deal();
    });
  }

  function hit() {
    var button = $('#hit');
    var buttonCursor = $('.cursor').eq(0);
    button.on({
      'click': function() {
        if (player.hand.total < 21) {
          player.drawCard();
          if (winner === null) {
            if (dealer.hand.total < 17) {
              dealer.drawCard();
            }
          }
        }
      },
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });
    buttonCursor.on({
      'click': function() {
        if (player.hand.total < 21) {
          player.drawCard();
          if (winner === null) {
            if (dealer.hand.total < 17) {
              dealer.drawCard();
            }
          }
        }
      },
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });
  };

  function stand() {
    var button = $('#stand');
    var buttonCursor = $('.cursor').eq(1);

    button.on(
      {'click': function() {
      player.hand.stand = true;
      if (dealer.hand.total >= 17) {
        checkWin();
      } else while (dealer.hand.total < 17) {
          dealer.drawCard();
        }
      },
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });
    buttonCursor.on(
      {'click': function() {
      player.hand.stand = true;
      if (dealer.hand.total >= 17) {
        checkWin();
      } else while (dealer.hand.total < 17) {
          dealer.drawCard();
        }
      },
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });
  };

  function double() {
    var button = $('#double');
    var buttonCursor = $('.cursor').eq(2);

    button.on({
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });
    buttonCursor.on({
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });
  };

  function surrender() {
    var button = $('#surrender');
    var buttonCursor = $('.cursor').eq(3);

    $.merge(button, buttonCursor).on({
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });
  };

  function checkWin() {
    if (player.hand.total === 21) { // if player blackjack, automate rest of game
      if (dealer.hand.total === 21) {
        console.log("Double blackjack! Push!");
        winner = 'tie';
      } else {
        player.hand.stand = true;
        while (dealer.hand.total < 17) { // throw in more dealer logic later
          dealer.drawCard();
        } if (dealer.hand.total !== 21) {
          console.log("Blackjack! You win!");
          winner = 'player';
        } else {
          console.log("Dealer also got blackjack! Push!");
          winner = 'tie';
        }
      }
    } else if (player.hand.total > 21) { // if player busts
      console.log("Bust!");
      winner = 'dealer';
    } else if (dealer.hand.total > 21) { // if dealer busts
      console.log("Dealer bust! You win!");
      winner = 'player';
    } else if (player.hand.stand && (dealer.hand.total > 16)) { // check if game is over
        if (player.hand.total === dealer.hand.total) { //if tie
          console.log("Push!");
          winner = 'tie';
        } else if (player.hand.total > dealer.hand.total) {
          console.log("You win!");
          winner = 'player';
        } else if (player.hand.total < dealer.hand.total) {
          console.log("You lose!");
          winner = 'dealer';
        }
    } else { // game ongoing
      winner = null;
    }
    if (winner != null) {
      showReset();
    }
  };

  function updateScore() {
    if (winner == 'player') {
      wins++;
    } else if (winner == 'dealer') {
      losses++;
    } else if (winner == 'tie') {
      ties++;
    }
  }

  var deck = createDeck();
  var player = new Player('Player', 'Raymond'); // nickname should be decided thru prompt of some sort
  var dealer = new Player('Dealer', 'Dealer');
  var wins = 0, losses = 0, ties = 0, winner;
  var bankroll = 300;
  var bet = 5;
  makeHeader();
  player.makeTable();
  dealer.makeTable();
  player.blackjackMeter();
  dealer.blackjackMeter();
  // Will almost definitely store these calls in an init function
  newGame();

  hit();
  stand();
  double();
  surrender();

});
