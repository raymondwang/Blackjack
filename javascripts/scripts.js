$(document).ready(function() {

  function Player(name, nickname) {
    this.name = name; // might throw this up in an initial setup menu, along with deck amount and bankroll
    this.nickname = nickname;
    this.hand = {cards: [], total: 0, aces: 0, stand: false};
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
    this.handTotal = $('<div>').attr('id', this.name + 'Total').addClass('pointTotals');
    this.stats.append(this.spade, this.hpBar, this.handTotal);
    this.handTotal.append(this.handVal);
    $('body').append(this.stats);
    var addName = ($('<p>').text(this.nickname.toUpperCase()).attr('id', this.name + 'Name').addClass('name'));
    $('body').append(addName);
  }

  Player.prototype.blackjackMeter = function blackjackMeter() {
    var color;
    var handPoints = this.handVal;
    if (this.hand.total >= 0 && this.hand.total < 21) {
      value = ((0.88095238095) * this.hand.total) + 'vw';
      color = 'blue';
      handPoints.text(this.hand.total + ' / 21');
      if (this.hand.total < 10) {
        this.spade.html('&diams;<span class="colon">:</span>').css({color: 'red'});
      } else {
        this.spade.html('&clubs;<span class="colon">:</span>').css({color: 'black'});
      }
    } else if (this.hand.total === 21) {
      value = '18.5vw';
      color = 'yellow';
      handPoints.text('BLACKJACK!')
      this.spade.html('&spades;<span class="colon">:</span>').css({color: 'black'});
    } else {
      value = '18.5vw';
      color = 'red';
      handPoints.text('BUST!');
      this.spade.html('&hearts;<span class="colon">:</span>').css({color: 'red'});
    }
    this.meter.css({backgroundColor: color, height: '0.5vh', 'width': value});
  }

  // Draws card
  Player.prototype.drawCard = function drawCard() {
    var draw = deck.pop();
    if (draw.value === 11) {
      this.hand.aces++;
    }
    this.hand.cards.push(draw.name);
    this.hand.total += draw.value; // evaluate A value
    var image = 'images/' + draw.name + '.png';
    var card = $('<img>').attr('src', image).addClass('card');
    var cardName = $('<p>').addClass('cardName').html(draw.name.replace(/_/g, '&nbsp;'));
    var cardValue = $('<p>').addClass('cardValue').html('Points: ' + draw.value);

    if (this.name == 'Player') {
      card.on({
        'mouseover': function() {
          $('#PlayerSpace .card').css({opacity: '0.25'});
          card.css({zIndex: '2', opacity: '1'}).animate({marginBottom: '2.5vh'}, 50);
          cardName.css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '2.5vh'}, 50);
          cardValue.css({zIndex: '2'}).animate({opacity: '1'}, 50);
        },
        'mouseout': function() {
          $('#PlayerSpace .card').css({opacity: '1'});
          card.css({zIndex: '1'}).animate({marginBottom: '0'}, 50);
          cardName.css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0'}, 50);
          cardValue.css({zIndex: '1'}).animate({opacity: '0'}, 50);
        }
      });
    } else if (this.name == 'Dealer') {
      // cardInfo.css({textAlign: 'right'});
        card.on({
          'mouseover': function() {
            $('#DealerSpace .card').css({opacity: '0.25'});
            card.css({zIndex: '2', opacity: '1'}).animate({marginBottom: '2.5vh'}, 50);
            cardName.css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '2.5vh'}, 50);
            cardValue.css({zIndex: '2'}).animate({opacity: '1'}, 50);
          },
          'mouseout': function() {
            $('#DealerSpace .card').css({opacity: '1'});
            card.css({zIndex: '1'}).animate({marginBottom: '0'}, 50);
            cardName.css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0'}, 50);
            cardValue.css({zIndex: '1'}).animate({opacity: '0'}, 50);
          }
        });
    };
    this.space.append(cardName, card, cardValue);
    this.blackjackMeter();

    if (player.hand.cards.length >= 2 && dealer.hand.cards.length >= 2) {
      checkWin();
    }
  };

  // Player.prototype.getBankroll = function getBankroll() {
  //   might make this a button in the menu actually
  // }

  // Creates deck
  function createDeck() {
    var numberOfDecks = 3; // can do as input
    var deck = [];
    var ace = 'Ace';
    var face = ['Jack', 'Queen', 'King'];
    var suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];

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
    var title = $('<h1>').attr('id', 'title').addClass('nav').text('Blackjack!');
    var displayBankroll = $('<h1>').attr('id', 'bankroll').addClass('nav').text('Bankroll: $' + bankroll);
    var displayBet = $('<h1>').attr('id', 'bet').addClass('nav').text('Bet: $' + bet);
    var kda = $('<h1>').attr('id', 'kda').addClass('nav').text('W' + wins + ' L' + losses + ' T' + ties);
    navbar.append(title, displayBankroll, displayBet, kda);

    var chooseBet = $('#betList');
    chooseBet.append($('<h3>').addClass('betText').text('BET'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet').text('$5'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet').text('$10'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet').text('$25'));
    var prompt = $('<p>').attr('id', 'prompt').html('What will<br>' + player.nickname + ' do?');
    $('#bottom').prepend(prompt);
    $('#bottom').prepend(chooseBet);
  }

  function updateHeader() {
    updateBankrollHeader();
    updateBetHeader();
    var displayBet = $('#bet');
    displayBet.text('Bet: $' + bet);
  }

  function placeBet() {
    bankroll -= bet;
  };

  function changeBet() {
    var bet5 = $('.selectBet').eq(0);
    var bet5Cursor = $('.betCursor').eq(0);
    var bet10 = $('.selectBet').eq(1);
    var bet10Cursor = $('.betCursor').eq(1);
    var bet25 = $('.selectBet').eq(2);
    var bet25Cursor = $('.betCursor').eq(2);

    bet5.on({
      'click': function() {
        bet = 5;
        updateBetHeader();
      },
      'mouseover': function() {
        bet5Cursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        bet5Cursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });

    bet10.on({
      'click': function() {
        bet = 10;
        updateBetHeader();
      },
      'mouseover': function() {
        bet10Cursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        bet10Cursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });

    bet25.on({
      'click': function() {
        bet = 25;
        updateBetHeader();
      },
      'mouseover': function() {
        bet25Cursor.css({color: 'rgba(0, 0, 0, 1)'});
      },
      'mouseout': function() {
        bet25Cursor.css({color: 'rgba(0, 0, 0, 0)'});
      }
    });
  }

  function updateBankrollHeader() {
    $('#bankroll').text('Bankroll: $' + bankroll);
  }

  function updateBetHeader() {
    $('#bet').text('Bet: $' + bet);
  }

  function deal() {
    placeBet();
    updateHeader();
    player.space.empty();
    dealer.space.empty();
    player.hand = {cards: [], total: 0, stand: false, aces: 0};
    dealer.hand = {cards: [], total: 0, stand: false, aces: 0};
    player.drawCard();
    dealer.drawCard();
    player.drawCard();
    dealer.drawCard();
    if (winner === null) {
      hideDeal();
    }
    surrender();
  }

  function showResult(str) {
    $('#actions').css({display: 'none'});
    $('#prompt').css({display: 'none'});
    var result = $('#result');
    result.html(str).css({display: 'block'});
    $('#nextCursor').css({display: 'block'});
    blink($('#nextCursor'));
    cursor = setInterval(function() {
      blink($('#nextCursor'))
    }, 1000);
    result.off('click').on('click', function() {
      var kda = $('#kda');
      updateScore();
      kda.text('W' + wins + ' L' + losses + ' T' + ties);
      showDeal(nextCursor);
    });
  }

  function showDeal() {
    updateBankrollHeader();
    $('#result').css({display: 'none'});
    clearInterval(cursor);
    $('#nextCursor').css({display: 'none'});
    $('#dealBlock').css({display: 'block'});
    $('#betList').css({display: 'block'});
  }

  function hideDeal() {
    $('#dealBlock').css({display: 'none'});
    $('#actions').css({display: 'block'});
    $('#prompt').css({display: 'block'});
    $('#betList').css({display: 'none'});
  }

  function hit() {
    var button = $('#hit');
    var buttonCursor = $('.cursor').eq(0);

    button.on({
      'click': function() {
        if (player.hand.total < 21) {
          player.drawCard();
          clearInterval(actionCursor);
          if (winner === null) {
            if (dealer.hand.total < 17) {
              dealer.drawCard();
            }
          }
        }
        deactivateSurrender();
      },
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
        blink(buttonCursor);
        actionCursor = setInterval(function() {
          blink(buttonCursor);
        }, 1000);
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
        clearInterval(actionCursor);
      }
    });
  };

  function stand() {
    var button = $('#stand');
    var buttonCursor = $('.cursor').eq(1);

    button.on(
      {'click': function() {
      clearInterval(actionCursor);
      player.hand.stand = true;
      if (dealer.hand.total >= 17) {
        checkWin();
      } else while (dealer.hand.total < 17) {
          dealer.drawCard();
        }
      },
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
        blink(buttonCursor);
        actionCursor = setInterval(function() {
          blink(buttonCursor);
        }, 1000);
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
        clearInterval(actionCursor);
      }
    });
  };

  function double() {
    var button = $('#double');
    var buttonCursor = $('.cursor').eq(2);

    button.on({
      'click': function() {
        clearInterval(actionCursor);
        bet *= 2;
        updateHeader();
        player.drawCard();
        player.hand.stand = true;
        if (dealer.hand.total >= 17) {
          checkWin();
        } else while (dealer.hand.total < 17) {
            dealer.drawCard();
        }
      },
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
        blink(buttonCursor);
        actionCursor = setInterval(function() {
          blink(buttonCursor);
        }, 1000);
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
        clearInterval(actionCursor);
      }
    });
  };

  function surrender() {
    var button = $('#surrender');
    var buttonCursor = $('.cursor').eq(3);

    button.off('click').on({
      'click': function() {
        clearInterval(actionCursor);
        bankroll += (bet / 2);
        losses++;
        updateBankrollHeader();
        showResult('You have surrendered.');
      },
      'mouseover': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 1)'});
        blink(buttonCursor);
        actionCursor = setInterval(function() {
          blink(buttonCursor);
        }, 1000);
      },
      'mouseout': function() {
        buttonCursor.css({color: 'rgba(0, 0, 0, 0)'});
        clearInterval(actionCursor);
      }
    });
  };

  function deactivateSurrender() {
    var button = $('#surrender');
    var buttonCursor = $('.cursor').eq(3);
    button.off('click').on({
      'click': function() {
        clearInterval(actionCursor);
        console.log('Can\'t surrender!');
      },
      'mouseover': function() {
        blink(buttonCursor);
        actionCursor = setInterval(function() {
          blink(buttonCursor);
        }, 1000);
      },
      'mouseout': function() {
        clearInterval(actionCursor);
      }
    });
  }

  function aceLogic(busta) { // pass in the ONE who BUSTS
    if (busta.hand.aces > 0) { // check if they have aces
      busta.hand.aces--;
      busta.hand.total -= 10;
      busta.blackjackMeter();
      // Updates Ace card value display
      var cardsByValue = $('#' + busta.name + 'Space .cardValue');
      for (var i = 0; i < cardsByValue.length; i++) {
        if (cardsByValue.eq(i).html().indexOf('11') > -1) {
          cardsByValue.eq(i).html('Points: 1');
          break;
        }
      }
      return true; // return true that there were aces
    } else {
    return false;
    }
  }

  function checkWin() {
    var resultMessage = '';

    if (player.hand.total > 21) { // if player busts
      if (!aceLogic(player)) { // bust if player had no aces
        winner = 'dealer';
        showResult('Bust! You lose!');
        return;
      }
    }
    if (dealer.hand.total > 21) { // if dealer busts
      if (!aceLogic(dealer)) { // bust if dealer had no aces
        winner = 'player';
        bankroll += (bet + (bet * 1.5));
        showResult('Dealer bust! You win!');
        return;
      }
    }

    if (player.hand.total === 21) { // if player blackjack, automate rest of game
      if (dealer.hand.total === 21) {
        resultMessage = "Blackjack push!";
        winner = 'tie';
        bankroll += bet;
      } else { // if (dealer.hand.total > 17) {
        resultMessage = "Blackjack! You win!";
        winner = 'player';
        bankroll += (bet + (bet * 1.5));
      }
      // still having trouble getting blackjack logic to work fluidly
      // else {
      //   dealer.drawCard();
      // }
    } else if (player.hand.stand && (dealer.hand.total > 16)) { // check if game is over
        if (player.hand.total === dealer.hand.total) { //if tie
          resultMessage = "Push!";
          winner = 'tie';
          bankroll += bet;
        } else if (player.hand.total > dealer.hand.total) {
          resultMessage = "You win!";
          winner = 'player';
          bankroll += (bet + (bet * 1.5));
        } else if (player.hand.total < dealer.hand.total) {
          resultMessage = "You lose!";
          winner = 'dealer';
        }
    } else { // game ongoing
      winner = null;
    }
    if (winner != null) {
      showResult(resultMessage);
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

  // got tired of staring at green so here's something fun
  function changeBackgroundColor() {
    var colors = ['#8bcd73', '#ffe69c', '#5a8362', '#e65a29', '#8bc5cd', '#a4624a', '#f6bd20', '#ff7300', '#c57be6', '#b4b4b4'];
    var color = Math.floor(Math.random() * colors.length);
    $('body').css({backgroundColor: colors[color]});

    $('#title').on('click', function() {
      if (color == (colors.length - 1)) {
        color = 0;
      } else {
        color++;
      }
      $('body').css({backgroundColor: colors[color]});
    });
  };

  function blink(element) {
    element.css({visibility: 'visible'});
    setTimeout(function() {
      element.css({visibility: 'hidden'});
    }, 500);
  };

  function newGame() {
    $('#deal').off('click').on({
      'click': function() {
        deal();
      },
      'mouseover': function() {
        $('#leftCursor').css({visibility: 'visible'});
        $('#rightCursor').css({visibility: 'visible'});
      },
      'mouseout': function() {
        $('#leftCursor').css({visibility: 'hidden'});
        $('#rightCursor').css({visibility: 'hidden'});
      }
    });
  }

// INITIALIZATIONS
  var deck = createDeck();
  var player = new Player('Player', 'Player'); // nickname rewrite in form
  var dealer = new Player('Dealer', 'Dealer');
  var wins = 0, losses = 0, ties = 0, winner;
  var bankroll = 300;
  var bet = 5;
  makeHeader();
  player.makeTable();
  dealer.makeTable();
  player.blackjackMeter();
  dealer.blackjackMeter();
  newGame();
  changeBet();
  var cursor;
  var actionCursor;
  hit();
  stand();
  double();
  // surrender() called in as necessary
  changeBackgroundColor();
});
