$(document).ready(function() {

  function Player(name, nickname) {
    this.name = name; // might throw this up in an initial setup menu, along with deck amount and bankroll
    this.nickname = nickname;
    this.hand = {cards: [], total: 0, aces: 0, stand: false, hole: ''};
    this.menu = $('#' + this.name + 'Stats');
    // this.bankroll = options.bankroll || dealing with money later;
  };

  Player.prototype.makeTable = function makeTable() {
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
    this.hand.total += draw.value;
    var image = 'images/' + draw.name + '.png';
    var card = $('<img>').attr('src', image).addClass('card ' + this.name + 'Cards');
    var cardName = $('<p>').addClass('cardName').html(draw.name.replace(/_/g, '&nbsp;'));
    var cardValue = $('<p>').addClass('cardValue ' + this.name +'Points').html('Points: ' + draw.value);
    $('body').append(cardName, card, cardValue);
    var scope = this.name;

    var cardWidth;
    var cardHeight;
    var playerCardTop;
    var playerCardLeft;
    var playerCardBottom;
    var playerValueBottom;
    var playerNameBottom;
    var playerNameMargin;
    var playerValueMargin;
    var dealerCardMargin;
    var dealerCardTop;
    var dealerCardLeft;
    var dealerNameTop;
    var dealerNameMargin;
    var dealerValueMargin;
    var dealerValueTop;

    if (window.matchMedia('(min-width: 1250px)').matches) {
      playerCardMargin = (6.25 * this.hand.cards.length) + 'vh';
      playerCardLeft = '3%';
      playerCardBottom = '38%';
      cardWidth = '19vh';
      cardHeight = '29vh';
      playerCardTop = '40%';
      playerNameBottom = '60.5%';
      playerValueBottom = '33%';
      playerNameMargin = (2.75 * this.hand.cards.length) + '%';
      playerValueMargin = (3 * this.hand.cards.length) + '%';
      dealerCardMargin = (-6.25 * this.hand.cards.length) + 'vh';
      dealerCardLeft = '85%';
      dealerCardTop = '13%';
      dealerNameTop = '10.5%';
      dealerNameMargin = (-6.25 * this.hand.cards.length) + 'vh';
      dealerValueTop = '38%';
      dealerValueMargin = (-6.25 * this.hand.cards.length) + 'vh';
    } else if (window.matchMedia('(min-width: 992px)').matches) {
      playerCardMargin = (6.25 * this.hand.cards.length) + 'vh';
      playerCardLeft = '3%';
      playerCardBottom = '38%';
      cardWidth = '18vh';
      cardHeight = '27vh';
      playerCardTop = '40%';
      playerNameBottom = '60.5%';
      playerValueBottom = '35.5%';
      playerNameMargin = 1.5 + (3 * this.hand.cards.length) + '%';
      playerValueMargin = 3 + (4.5 * (this.hand.cards.length - 1)) + '%';
      dealerCardMargin = (-6.25 * this.hand.cards.length) + 'vh';
      dealerCardLeft = '85%';
      dealerCardTop = '13%';
      dealerNameTop = '10.5%';
      dealerNameMargin = -4 + (3.5 * this.hand.cards.length) + '%';
      dealerValueTop = '36.5%';
      dealerValueMargin = (-6.25 * this.hand.cards.length) + 'vh';
    } else if (window.matchMedia('(min-width: 720px)').matches) {
      playerCardMargin = (6.25 * this.hand.cards.length) + 'vh';
      playerCardLeft = '3%';
      playerCardBottom = '38%';
      cardWidth = '16vh';
      cardHeight = '24vh';
      playerCardTop = '45%';
      playerNameBottom = '56%';
      playerValueBottom = '34%';
      playerNameMargin = -0.75 + (5.75 * this.hand.cards.length - 1) + '%';
      playerValueMargin = -1.5 + (6 * this.hand.cards.length - 1) + '%';
      dealerCardMargin = (-6.25 * this.hand.cards.length) + 'vh';
      dealerCardLeft = '85%';
      dealerCardTop = '13%';
      dealerNameTop = '10.5%';
      dealerNameMargin = -4 + (3.5 * this.hand.cards.length) + '%';
      dealerValueTop = '33%';
      dealerValueMargin = (-6.25 * this.hand.cards.length) + 'vh';
    } else if (window.matchMedia('(min-width: 580px)').matches) {
      playerCardMargin = (6.25 * this.hand.cards.length) + 'vh';
      playerCardLeft = '3%';
      playerCardBottom = '38%';
      playerCardTop = '48%';
      cardWidth = '14vh';
      cardHeight = '21vh';
      playerNameBottom = '52.5%';
      playerValueBottom = '34%';
      playerNameMargin = -3 + (6.25 * this.hand.cards.length) + '%';
      playerValueMargin = -3 + (6.25 * this.hand.cards.length) + '%';
      dealerCardMargin = (-6.25 * this.hand.cards.length) + 'vh';
      dealerCardLeft = '85%';
      dealerCardTop = '13%';
      dealerNameTop = '10.5%';
      dealerNameMargin = (-6.25 * this.hand.cards.length) + 'vh';
      dealerValueTop = '29.75%';
      dealerValueMargin = (-6.25 * this.hand.cards.length) + 'vh';
    } else {
      playerCardMargin = (6.25 * this.hand.cards.length) + 'vh';
      playerCardLeft = '1%';
      playerCardBottom = '38%';
      playerCardTop = '59.5%';
      cardWidth = '12vh';
      cardHeight = '18vh';
      playerNameBottom = '41%';
      playerNameMargin = -6 + (7.8 * this.hand.cards.length) + '%';
      playerValueBottom = '26%';
      playerValueMargin = -6 + (7.8 * this.hand.cards.length) + '%';
      dealerCardMargin = (-6.25 * this.hand.cards.length) + 'vh';
      dealerCardLeft = '85%';
      dealerCardTop = '13%';
      dealerNameTop = '11.75%';
      dealerNameMargin = (-6.25 * this.hand.cards.length) + 'vh';
      dealerValueTop = '26.5%';
      dealerValueMargin = (-6.25 * this.hand.cards.length) + 'vh';
    }

    if (scope == 'Player') {
      card.animate({width: cardWidth, height: cardHeight, left: playerCardLeft, bottom: playerCardBottom, top: playerCardTop, marginTop: 0, marginLeft: playerCardMargin}, 500);
      cardName.css({bottom: playerNameBottom, left: playerCardLeft, marginLeft: playerNameMargin});
      cardValue.css({bottom: playerValueBottom, left: playerCardLeft, marginLeft: playerValueMargin});
    } else {
      card.animate({width: cardWidth, height: cardHeight, left: dealerCardLeft, top: dealerCardTop, marginTop: 0, marginLeft: dealerCardMargin}, 500);
      cardName.css({top: dealerNameTop, left: dealerCardLeft, marginLeft: dealerCardMargin});
      cardValue.css({top: dealerValueTop, left: dealerCardLeft, marginLeft: dealerCardMargin});
    }

    card.on({
      'mouseover': function() {
        $('.' + scope + 'Cards').css({opacity: '0.25'});
        card.css({zIndex: '2', opacity: '1'}).animate({marginTop: '-2.5vh'}, 50);
        cardName.css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '2.5vh', marginTop: '-2.5vh'}, 50);
        cardValue.css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '-2.5vh', marginTop: '2.5vh'}, 50);
      },
      'mouseout': function() {
        $('.' + scope + 'Cards').css({opacity: '1'});
        card.css({zIndex: '1'}).animate({marginTop: '0'}, 50);
        cardName.css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0', marginTop: '0'}, 50);
        cardValue.css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0', marginTop: '0'}, 50);
      }
    });

    this.blackjackMeter();

    if (player.hand.cards.length >= 2 && dealer.hand.cards.length >= 2) {
      checkWin();
    }
  };

  Player.prototype.drawHole = function drawHole() {
    this.hand.hole = deck.pop();
    this.hand.cards.push(this.hand.hole.name);

    var image = 'images/' + this.hand.hole.name + '.png';

    // var flipContainer = $('<div>').addClass('flip-container card');
    // var flipper = $('<div>').addClass('flipper');
    // var front = $('<div>').addClass('front');
    var card = $('<img>').attr('src', 'images/PokeballDeck.png').addClass('card ' + this.name + 'Cards hole');
    $('body').append(card);
    // var back = $('<div>').addClass('back');
    // var cardBack = $('<img>').attr('src', image).addClass('card ' + this.name + 'Cards holeBack');
    // front.append(card);
    // back.append(cardBack);
    // flipper.append(front, back);
    // flipContainer.append(flipper);
    // $('body').append(flipContainer);

    var cardWidth;
    var cardHeight;
    if (window.matchMedia('(min-width: 1250px)').matches) {
      cardWidth = '19vh';
      cardHeight = '29vh';
    } else if (window.matchMedia('(min-width: 992px)').matches) {
      cardWidth = '18vh';
      cardHeight = '27vh';
    } else if (window.matchMedia('(min-width: 720px)').matches) {
      cardWidth = '16vh';
      cardHeight = '24vh';
    } else if (window.matchMedia('(min-width: 580px)').matches) {
      cardWidth = '14vh';
      cardHeight = '21vh';
    } else {
      cardWidth = '12vh';
      cardHeight = '18vh';
    }

    var addMargin = (-6.25 * this.hand.cards.length) + 'vh';
    var destinationX = '85%';
    var destinationY = '13%';
    card.animate({width: cardWidth, height: cardHeight, left: destinationX, top: destinationY, marginTop: 0, marginLeft: addMargin}, 500);
    // flipContainer.css({marginTop: '0'});
    // flipContainer.animate({left: '71.5%', top: '-13.4%', marginLeft: addMargin}, 500);
    // cardBack.css({width: '19vh', height: '29vh', left: '71.5%', top: '-13.4%', marginTop: '0', marginLeft: addMargin});
    card.on({
      'mouseover': function() {
        $('.DealerCards').css({opacity: '0.25'});
        card.css({zIndex: '2', opacity: '1'}).animate({marginTop: '-2.5vh'}, 50);
      },
      'mouseout': function() {
        $('.DealerCards').css({opacity: '1'});
        card.css({zIndex: '1'}).animate({marginTop: '0'}, 50);
      }
    });
  }

  Player.prototype.revealHole = function revealHole() {
    card = this.hand.hole;
    var image = 'images/' + card.name + '.png';

    // document.querySelector(".flip-container").classList.toggle("flip");
    // card.css({top: '40%', left: '55%'});
    this.hand.total += card.value;
    this.blackjackMeter();
    var addMargin = (-6.25 * this.hand.cards.length) + 'vh';
    var destinationX = '85%';
    var destinationY = '13%';

    var cardName = $('<p>').addClass('cardName').html(card.name.replace(/_/g, '&nbsp;'));
    var cardValue = $('<p>').addClass('cardValue ' + this.name +'Points').html('Points: ' + card.value);
    $('body').append(cardName, cardValue);

    card.attr('src', image);

    // card.animate({width: '19vh', height: '29vh', left: destinationX, top: destinationY, marginTop: 0, marginLeft: addMargin}, 500);
    cardName.css({top: '10.5%', left: destinationX, marginLeft: addMargin});
    cardValue.css({top: '38%', left: destinationX, marginLeft: addMargin});

    $('.hole').on({
      'mouseover': function() {
        $('.DealerCards').css({opacity: '0.25'});
        $('.hole').css({zIndex: '2', opacity: '1'}).animate({marginTop: '-2.5vh'}, 50);
        cardName.css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '2.5vh', marginTop: '-2.5vh'}, 50);
        cardValue.css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '-2.5vh', marginTop: '2.5vh'}, 50);
      },
      'mouseout': function() {
        $('.DealerCards').css({opacity: '1'});
        $('.hole').css({zIndex: '1'}).animate({marginTop: '0'}, 50);
        cardName.css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0', marginTop: '0'}, 50);
        cardValue.css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0', marginTop: '0'}, 50);
        }
    });
    this.hand.hole = 'revealed';
    checkWin();
  }

  function resizeCards() {
    $(window).resize(function() {
      if (window.matchMedia('(min-width: 1250px)').matches) {
        $('.card').css({width: '19vh', height: '29vh'});
        $('.PlayerCards').css({top: '40%'});
        console.log('max');
      } else if (window.matchMedia('(min-width: 992px)').matches) {
        $('.card').css({width: '18vh', height: '27vh'});
        $('.PlayerCards').css({top: '40%'});
        console.log('992+');
      } else if (window.matchMedia('(min-width: 720px)').matches) {
        $('.card').css({width: '16vh', height: '24vh'});
        $('.PlayerCards').css({top: '45%'});
        console.log('720+');
      } else if (window.matchMedia('(min-width: 580px)').matches) {
        $('.card').css({width: '14vh', height: '21vh'});
        console.log('580+');
      } else {
        $('.card').css({width: '12vh', height: '18vh'});
        console.log('iPhone');
      }
    })
  };

  function newGame() {
    $('#deal').on({
      'click': function() {
        if ((bet >= 5) && (bet <= 100) && (bankroll >= bet)) {
          gameRun = true;
          deal();
        } else if (bankroll < bet) {
          gameRun = false;
          showResult('You don\'t have enough money!');
        } else if (bet < 5) {
          gameRun = false;
          showResult('Minimum bet is $5.');
        } else if (bet > 100) {
          gameRun = false;
          showResult('Maximum bet is $100.');
        }
      },
      'mouseover': function() {
        // hmm
      },
      'mouseout': function() {

      }
    });
  }

  // Creates deck
  function createDeck() {
    var deck = [];
    var ace = 'Ace';
    var face = ['Jack', 'Queen', 'King'];
    var suits = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];

    for (var x = 0; x < deckAmount; x++) {
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
    chooseBet.append($('<li>').addClass('selectBet bet1').text('$1'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet bet5').text('$5'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet bet10').text('$10'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet bet25').text('$25'));
    var prompt = $('<p>').attr('id', 'prompt').html('What will<br>' + player.nickname + ' do?');
    $('#bottom').prepend(prompt);
    $('#bottom').prepend(chooseBet);
  }

  function updateHeader() {
    updateBankrollHeader();
    updateBetHeader();
  }

  function placeBet() {
    bankroll -= bet;
  };

  function resetBet() {
    var betText = $('.betText');
    betText.css({cursor: 'pointer'}).on('click', function() {
      bet = 0;
      updateBetHeader();
      betText.css({cursor: 'auto'}).html('BET').off('click');
    });
  }

  // This function could be cleaned up a lot
  function changeBet() {
    var betText = $('.betText');
    var bet1 = $('.selectBet').eq(0);
    var bet1Cursor = $('.betCursor').eq(0);
    var bet5 = $('.selectBet').eq(1);
    var bet5Cursor = $('.betCursor').eq(1);
    var bet10 = $('.selectBet').eq(2);
    var bet10Cursor = $('.betCursor').eq(2);
    var bet25 = $('.selectBet').eq(3);
    var bet25Cursor = $('.betCursor').eq(3);
    var betCursor;

    bet1.on({
      'click': function() {
        bet += 1;
        updateBetHeader();
        clearInterval(betCursor);
        betText.html('RESET');
        resetBet();
      },
      'mouseover': function() {
        bet1Cursor.css({color: 'rgba(0, 0, 0, 1)'});
        blink(bet1Cursor);
        betCursor = setInterval(function() {
          blink(bet1Cursor);
        }, 1000);
      },
      'mouseout': function() {
        bet1Cursor.css({color: 'rgba(0, 0, 0, 0)'});
        clearInterval(betCursor);
      }
    });

    bet5.on({
      'click': function() {
        bet += 5;
        updateBetHeader();
        clearInterval(betCursor);
        betText.html('RESET');
        resetBet();
      },
      'mouseover': function() {
        bet5Cursor.css({color: 'rgba(0, 0, 0, 1)'});
        blink(bet5Cursor);
        betCursor = setInterval(function() {
          blink(bet5Cursor);
        }, 1000);
      },
      'mouseout': function() {
        bet5Cursor.css({color: 'rgba(0, 0, 0, 0)'});
        clearInterval(betCursor);
      }
    });

    bet10.on({
      'click': function() {
        bet += 10;
        updateBetHeader();
        clearInterval(betCursor);
        betText.html('RESET');
        resetBet();
      },
      'mouseover': function() {
        bet10Cursor.css({color: 'rgba(0, 0, 0, 1)'});
        blink(bet10Cursor);
        betCursor = setInterval(function() {
          blink(bet10Cursor);
        }, 1000);
      },
      'mouseout': function() {
        bet10Cursor.css({color: 'rgba(0, 0, 0, 0)'});
        clearInterval(betCursor);
      }
    });

    bet25.on({
      'click': function() {
        bet += 25;
        updateBetHeader();
        clearInterval(betCursor);
        betText.html('RESET');
        resetBet();
      },
      'mouseover': function() {
        bet25Cursor.css({color: 'rgba(0, 0, 0, 1)'});
        blink(bet25Cursor);
        betCursor = setInterval(function() {
          blink(bet25Cursor);
        }, 1000);
      },
      'mouseout': function() {
        bet25Cursor.css({color: 'rgba(0, 0, 0, 0)'});
        clearInterval(betCursor);
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
    $('.card, .cardName, .cardValue').remove();
    player.hand = {cards: [], total: 0, stand: false, aces: 0};
    dealer.hand = {cards: [], total: 0, stand: false, aces: 0};
    player.drawCard();
    setTimeout(function() {
      dealer.drawHole();
    }, 500); // HOLE CARD
    setTimeout(function() {
      player.drawCard();
    }, 1000);
    setTimeout(function() {
      dealer.drawCard();
    }, 1500);
    $('#deal').off('click');
    $('.betText').off('click');
    $('.selectBet').eq(0).off('click');
    $('.selectBet').eq(1).off('click');
    $('.selectBet').eq(2).off('click');
    $('.selectBet').eq(3).off('click');
    setTimeout(function() {
      if (winner === null) {
        hideDeal();
      }
      $('.betText').html('BET');
      changeBet();
      newGame();
    }, 2000);
    surrender();
  }

  function showResult(str) {
    $('#deal').css({display: 'none'});
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
      if (gameRun) { // check to see if deal actually ran
        var kda = $('#kda');
        updateScore();
        kda.text('W' + wins + ' L' + losses + ' T' + ties);
        bet = 5;
        updateBetHeader();
      }
      showDeal();
    });
  }

  function showDeal() {
    updateBankrollHeader();
    $('#result').css({display: 'none'});
    clearInterval(cursor);
    $('#nextCursor').css({display: 'none'});
    $('#deal').css({display: 'block'});
    $('#betList').css({display: 'block'});
  }

  function hideDeal() {
    $('#deal').css({display: 'none'});
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
          // if (winner === null) {
          //   if (dealer.hand.total < 17) {
          //     dealer.drawCard();
          //   }
          // }
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
      // if (dealer.hand.total >= 17) {
      checkWin();
      //} } else while (dealer.hand.total < 17) {
      //     dealer.drawCard();
      //   }
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
        if ((bankroll - bet) >= 0) {
          placeBet();
          bet *= 2;
          updateHeader();
          player.drawCard();
          player.hand.stand = true;
          // if (dealer.hand.total >= 17) {
            checkWin();
          // } else while (dealer.hand.total < 17) {
          //     dealer.drawCard();
          // }
        } else {
          trainerBattle('Can\'t double down!');
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
        trainerBattle('Can\'t surrender!');
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

  function trainerBattle(str) {
    $('#actions').css({display: 'none'});
    var result = $('#result');
    result.html(str).css({display: 'block'});
    $('#nextCursor').css({display: 'block'});
    blink($('#nextCursor'));
    cursor = setInterval(function() {
      blink($('#nextCursor'))
    }, 1000);
    result.off('click').on('click', function() {
      result.css({display: 'none'});
      $('#actions').css({display: 'block'});
    });
  }

  function aceLogic(busta) { // pass in the ONE who BUSTS
    if (busta.hand.aces > 0) { // check if they have aces
      busta.hand.aces--;
      busta.hand.total -= 10;
      busta.blackjackMeter();
      // Updates Ace card value display
      var cardsByValue = $('.' + busta.name + 'Points'); // player/dealer cards class
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
      } else if (dealer.hand.hole != 'revealed') {
        setTimeout(function() {
          dealer.revealHole();
        }, 500);
        return;
      } else if (dealer.hand.total < 17) {
        setTimeout(function() {
          dealer.drawCard();
        }, 500);
        return;
      } else { // if dealer hand is greater than 17
        resultMessage = "Blackjack! You win!";
        winner = 'player';
        bankroll += (bet + (bet * 1.5));
      }
    } else if (player.hand.stand) {
      if (dealer.hand.hole != 'revealed') {
        setTimeout(function() {
          dealer.revealHole();
        }, 500);
        return;
      } else if (dealer.hand.total < 17) {
        setTimeout(function() {
          dealer.drawCard();
        }, 500);
        return;
      } else {
        if (player.hand.total === dealer.hand.total) {
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

// Hover over decks to get deck amount--not sure if this should be added
  // function inspectDeck() {
  //   var cardsLeft = $('<p>').attr('id', 'cardsLeft').html('Cards left: ' + deck.length);
  //   var numberOfDecks = $('<p>').attr('id', 'numberOfDecks').html(deckAmount + ' Decks');
  //   $('#cardHolder').append(cardsLeft, numberOfDecks);
  // }

  // got tired of staring at green so here's something fun
  function changeBackgroundColor() {
    var colors = ['#8bcd73', '#ffe69c', '#5a8362', '#e65a29', '#8bc5cd', '#a4624a', '#ff8bac', '#f6bd20', '#c57be6', '#b4b4b4'];
    var color = Math.floor(Math.random() * colors.length);
    $('body').css({backgroundColor: colors[color]});
    $('#title').on('click', function() {
      if (color == (colors.length - 1)) {
        color = 0;
      } else {
        color++;
      }
      $('body').css({backgroundColor: colors[color]});
      navBorderColor();
    });
  }

  function navBorderColor() {
    $('.nav').css({borderRightColor: document.body.style.backgroundColor});
    $('#kda').css({borderRight: 'none'});
  }

  function blink(element) {
    element.css({visibility: 'visible'});
    setTimeout(function() {
      element.css({visibility: 'hidden'});
    }, 500);
  };

// INITIALIZATIONS
  var deckAmount = 3; // can I prompt for this?
  var deck = createDeck();
  var player = new Player('Player', 'Player'); // nickname rewrite in form
  var dealer = new Player('Dealer', 'Dealer');
  var wins = 0, losses = 0, ties = 0, winner = null;
  var bankroll = 300;
  var bet = 5;
  var runGame = true;
  makeHeader();
  player.makeTable();
  dealer.makeTable();
  player.blackjackMeter();
  dealer.blackjackMeter();
  newGame();
  // inspectDeck();
  changeBet();
  var cursor;
  var actionCursor;
  hit();
  stand();
  double();
  resizeCards();
  // surrender() called in as necessary

  changeBackgroundColor();
  navBorderColor();
});
