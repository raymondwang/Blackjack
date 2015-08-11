$(document).ready(function() {

  function Player(name) {
    this.name = name; // might throw this up in an initial setup menu, along with deck amount and bankroll
    this.hand = {cards: [], total: 0, aces: 0, stand: false, hole: ''};
    this.menu = $('#' + this.name + 'Stats');
  };

  Player.prototype.makeTable = function makeTable() {
    this.stats = $('<div>').attr('id', this.name + 'Stats');
    this.spade = $('<li>').addClass("spade").html('&spades;<span class="colon">:</span>');
    this.hpBar = $('<div>').attr('id', this.name + 'HP').addClass('hpBar');
    this.meter = $('<div>').attr('id', this.name + 'Meter').css({height: '0.5vh', position: 'absolute'});
    this.hpBar.append(this.meter);
    this.handVal = $('<li>').attr('id', this.name + 'Value').addClass('handValue');
    this.handTotal = $('<div>').attr('id', this.name + 'Total').addClass('pointTotals');
    this.stats.append(this.spade, this.hpBar, this.handTotal);
    this.handTotal.append(this.handVal);
    $('body').append(this.stats);
  }

  Player.prototype.blackjackMeter = function blackjackMeter() {
      var color;
      var handPoints = this.handVal;
      var currentPoints = $('#' + this.name + 'Value').text().split(' / ')[0];

      if (this.hand.total >= 0 && this.hand.total < 21) {
        value = ((0.88095238095) * this.hand.total) + 'vw';
        color = 'blue';
        if (this.hand.total < 10) {
          this.spade.html('&diams;<span class="colon">:</span>').css({color: 'red'});
        } else {
          this.spade.html('&clubs;<span class="colon">:</span>').css({color: 'black'});
        }
      } else if (this.hand.total === 21) {
        value = '18.5vw';
        color = 'yellow';
        this.spade.html('&spades;<span class="colon">:</span>').css({color: 'black'});
      } else {
        value = '18.5vw';
        color = 'red';
        this.spade.html('&hearts;<span class="colon">:</span>').css({color: 'red'});
      }
      this.meter.css({backgroundColor: color});
      var scope = this;

      var difference = this.hand.total - currentPoints;
      var speed = 500 / difference;

      var incrementer = setInterval(function() {
        if (currentPoints < scope.hand.total) {
          currentPoints++;
          if (currentPoints > 21) {
            handPoints.text('BUST!');
          } else {
            handPoints.text(currentPoints + ' / 21');
          }
        } else {
          clearInterval(incrementer);
          if (currentPoints === 21) {
           handPoints.text('BLACKJACK!');
         }
        }
      }, speed);
      this.meter.animate({width: value}, 500, 'linear');
    }

  Player.prototype.makeMeter = function makeMeter() {
    this.handVal.text('0 / 21');
    this.meter.animate({width: '0'}, 250);
    this.spade.css({color: 'black'});
  }

  // Draws card
  Player.prototype.drawCard = function drawCard() {
    $('.disableOverlay').css({display: 'block'});
    var draw = deck.pop();
    if (draw.value === 11) {
      this.hand.aces++;
    }
    this.hand.cards.push(draw.name);
    this.hand.total += draw.value;
    var image = 'images/' + draw.name.toLowerCase() + '.png';

    var card = $('<div>').addClass('card ' + this.name + 'Cards');
    var cardImg = $('<img>').attr('src', image).addClass('cardImg ' + this.name + 'Cards');
    var cardName = $('<p>').addClass('cardName').html(draw.name.replace(/_/g, '&nbsp;'));
    var cardValue = $('<p>').addClass('cardValue ' + this.name +'Points').html('Points: ' + draw.value);
    card.append(cardName, cardImg, cardValue);
    $('body').append(card);
    var scope = this.name;

    var cardWidth;
    var cardHeight;
    var playerCardTop;
    var playerCardLeft;
    var playerCardBottom;
    var dealerCardTop = '13%';
    var dealerCardLeft = '85%';
    var displayInfo = true;
    var playerCardMargin = (6.25 * this.hand.cards.length) + 'vh';
    var dealerCardMargin = (-6.25 * this.hand.cards.length) + 'vh';

    if (window.matchMedia('(min-width: 1250px)').matches) {
      playerCardLeft = '3%';
      playerCardBottom = '38%';
      cardWidth = '19vh';
      cardHeight = '29vh';
      playerCardTop = '40%';
    } else if (window.matchMedia('(min-width: 992px)').matches) {
      playerCardLeft = '3%';
      playerCardBottom = '38%';
      cardWidth = '18vh';
      cardHeight = '27vh';
      playerCardTop = '40%';
    } else if (window.matchMedia('(min-width: 720px)').matches) {
      playerCardLeft = '3%';
      playerCardBottom = '38%';
      cardWidth = '16vh';
      cardHeight = '24vh';
      playerCardTop = '45%';
    } else if (window.matchMedia('(min-width: 580px)').matches) {
      playerCardLeft = '0';
      playerCardBottom = '38%';
      playerCardTop = '52%';
      cardWidth = '12vh';
      cardHeight = '18vh';
      displayInfo = false;
    } else {
      playerCardLeft = '0';
      playerCardBottom = '38%';
      playerCardTop = '65%';
      cardWidth = '8vh';
      cardHeight = '12vh';
      dealerCardLeft = '90%';
      displayInfo = false;
    }

    if (scope == 'Player') {
      card.animate({width: cardWidth, height: cardHeight, left: playerCardLeft, bottom: playerCardBottom, top: playerCardTop, marginBottom: 0, marginTop: 0, marginLeft: playerCardMargin}, 500);
      cardImg.animate({width: cardWidth, height: cardHeight});
    } else { // if Dealer
      card.animate({width: cardWidth, height: cardHeight, left: dealerCardLeft, top: dealerCardTop, marginTop: 0, marginBottom: 0, marginLeft: dealerCardMargin}, 500);
      cardImg.animate({width: cardWidth, height: cardHeight});
    }
    if (displayInfo) {
      cardName.css({display: 'block'});
      cardValue.css({display: 'block'});
    } else {
      cardName.css({display: 'none'});
      cardValue.css({display: 'none'});
    }

    card.on({
      'mouseover': function() {
        $('.' + scope + 'Cards').css({opacity: '0.25'});
        card.css({zIndex: '2', opacity: '1'}).animate({marginTop: '-2.5vh'}, 50);
        cardImg.css({zIndex: '2', opacity: '1'});
        cardName.css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '2.5vh', marginTop: '-2.5vh'}, 50);
        cardValue.css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '-2.5vh', marginTop: '2.5vh'}, 50);
      },
      'mouseout': function() {
        $('.' + scope + 'Cards').css({opacity: '1'});
        card.css({zIndex: '1'}).animate({marginTop: '0'}, 50);
        cardImg.css({zIndex: '2', opacity: '1'});
        cardName.css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0', marginTop: '0'}, 50);
        cardValue.css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0', marginTop: '0'}, 50);
      }
    });

    this.blackjackMeter();

    // if (player.hand.cards.length >= 2 && dealer.hand.cards.length >= 2) {
    //   checkWin();
    // }
  };

  Player.prototype.drawHole = function drawHole() {
    this.hand.hole = deck.pop();
    this.hand.cards.push(this.hand.hole.name);
    var image = 'images/' + this.hand.hole.name.toLowerCase() + '.png';
    var flipContainer = $('<div>').addClass('flip-container DealerCards');
    var flipper = $('<div>').addClass('flipper');
    var front = $('<div>').addClass('front');
    var card = $('<img>').attr('src', 'images/PokeballDeck.png').addClass('card hole');
    var back = $('<div>').addClass('back');
    var cardBack = $('<img>').attr('src', image).addClass('card holeBack');
    var cardName = $('<p>').addClass('cardName holeName').html(this.hand.hole.name.replace(/_/g, '&nbsp;'));
    var cardValue = $('<p>').addClass('cardValue DealerPoints holePoints').html('Points: ' + this.hand.hole.value);
    front.append(card);
    back.append(cardBack);
    flipper.append(front, back);


    flipContainer.append(cardName, flipper, cardValue);

    $('body').append(flipContainer);

    var cardWidth;
    var cardHeight;
    var dealerCardMargin = (-6.25 * this.hand.cards.length) + 'vh';
    var dealerCardTop = '13%';
    var dealerCardLeft = '85%';
    var displayInfo = true;

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
      cardWidth = '12vh';
      cardHeight = '18vh';
      displayInfo = false;
    } else {
      cardWidth = '8vh';
      cardHeight = '12vh';
      dealerCardLeft = '90%';
      displayInfo = false;
    }

    flipContainer.animate({width: cardWidth, height: cardHeight, left: dealerCardLeft, top: dealerCardTop, marginTop: 0, marginLeft: dealerCardMargin}, 500);
    card.animate({width: cardWidth, height: cardHeight}, 500);
    cardBack.css({width: cardWidth, height: cardHeight});

    if (displayInfo) {
      cardName.css({display: 'block'});
      cardValue.css({display: 'block'});
    } else {
      cardName.css({display: 'none'});
      cardValue.css({display: 'none'});
    }

    flipContainer.on({
      'mouseover': function() {
        $('.DealerCards').css({opacity: '0.25'});
        flipContainer.css({zIndex: '2', opacity: '1'}).animate({marginTop: '-2.5vh'}, 50);
      },
      'mouseout': function() {
        $('.DealerCards').css({opacity: '1'});
        flipContainer.css({zIndex: '1'}).animate({marginTop: '0'}, 50);
      }
    });
  }

  Player.prototype.revealHole = function revealHole() {
    card = this.hand.hole;
    this.hand.total += card.value;
    if (card.value == 11) {
      this.aces++;
    }
    this.blackjackMeter();
    var flipContainer = $(".flip-container");
    $('.DealerCards:not(:eq(0))').animate({opacity: '0.25'}, 500);
    flipContainer.animate({marginTop: '-5vh', zIndex: '2'}, 500);
    document.querySelector(".flip-container").classList.toggle("flip");
    flipContainer.animate({zIndex: '1'}, 750);
    setTimeout(function() {
      $('.DealerCards').animate({opacity: '1'}, 500);
      flipContainer.animate({marginTop: '0', zIndex: '1'}, 500);
    }, 1000);

    var dealerNameTop;
    var dealerNameMargin;
    var dealerValueMargin;
    var dealerValueTop;

    if (window.matchMedia('(max-width: 580px)').matches) {
      displayInfo = false;
      console.log('small');
    } else {
      displayInfo = true;
    }

    $('.flip-container').off('mouseover', 'mouseout');

    $('.holeBack').on({
      'mouseover': function() {
        $('.DealerCards').css({opacity: '0.25'});
        $('.flip-container').css({zIndex: '2', opacity: '1'}).animate({marginTop: '-2.5vh'}, 50);
        if (displayInfo) {
          $('.holeName').css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '2.5vh', marginTop: '-2.5vh'}, 50);
          $('.holePoints').css({zIndex: '2', visibility: 'visible'}).animate({marginBottom: '-2.5vh', marginTop: '2.5vh'}, 50);
        }
      },
      'mouseout': function() {
        $('.DealerCards').css({opacity: '1'});
        $('.holeBack').css({zIndex: '1'}).animate({marginTop: '0'}, 50);
        $('.holeName').css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0', marginTop: '0'}, 50);
        $('.holePoints').css({zIndex: '1', visibility: 'hidden'}).animate({marginBottom: '0', marginTop: '0'}, 50);
        }
    });
    this.hand.hole = 'revealed';
    checkWin();
  }

  function resizeCards() {
    $(window).resize(function() {
      var cardWidth;
      var cardHeight;
      var playerCardTop;
      var playerCardLeft;
      var playerCardBottom;
      var dealerCardTop = '13%';
      var dealerCardLeft = '85%';
      var displayInfo = true;
      var bet1 = "$1";
      var bet10 = "$10";

      if (window.matchMedia('(max-width: 580px)').matches) {
        playerCardLeft = '0';
        playerCardBottom = '38%';
        playerCardTop = '65%';
        cardWidth = '8vh';
        cardHeight = '12vh';
        dealerCardTop = '13%';
        displayInfo = false;
        bet1 = "-";
        bet10 = "+";
      } else if (window.matchMedia('(min-width: 580px)').matches) {
        playerCardLeft = '0';
        playerCardBottom = '38%';
        playerCardTop = '52%';
        cardWidth = '12vh';
        cardHeight = '18vh';
        displayInfo = false;
      } else if (window.matchMedia('(min-width: 720px)').matches) {
        playerCardLeft = '3%';
        playerCardBottom = '38%';
        cardWidth = '16vh';
        cardHeight = '24vh';
        playerCardTop = '45%';
      } else if (window.matchMedia('(min-width: 992px)').matches) {
        playerCardLeft = '3%';
        playerCardBottom = '38%';
        cardWidth = '18vh';
        cardHeight = '27vh';
        playerCardTop = '40%';
      } else if (window.matchMedia('(min-width: 1250px)').matches) {
        playerCardLeft = '3%';
        playerCardBottom = '38%';
        cardWidth = '19vh';
        cardHeight = '29vh';
        playerCardTop = '40%';
      }

     $('.PlayerCards').css({width: cardWidth, height: cardHeight, left: playerCardLeft, bottom: playerCardBottom, top: playerCardTop, marginBottom: 0, marginTop: 0});
     $('.DealerCards').css({width: cardWidth, height: cardHeight, left: dealerCardLeft, top: dealerCardTop, marginTop: 0, marginBottom: 0});
     $('.hole').css({width: cardWidth, height: cardHeight});
     $('.holeBack').css({width: cardWidth, height: cardHeight});
     $('.cardImg').css({width: cardWidth, height: cardHeight});
    if (displayInfo) {
      $('.cardName').css({display: 'block'});
      $('.cardValue').css({display: 'block'});
    } else {
      $('.cardName').css({display: 'none'});
      $('.cardValue').css({display: 'none'});
    }
    $('.bet1').text(bet1);
    $('.bet10').text(bet10);
    changeBet();
    updateBankrollHeader();
    })
  };

  function newGame() {
    $('#deal').on({
      'click': function() {
        if ((bet >= 5) && (bet <= 100) && (bankroll >= bet)) {
          gameRun = true;
          player.meter.animate({'width': '0'}, 250);
          dealer.meter.animate({'width': '0'}, 250);
          $('#PlayerName').attr('readonly', true).css({cursor: 'text'});
          $('.bankrollInput').attr('readonly', true);
          $('#betList').css({display: 'none'});
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
    var displayBankroll = $('<h1>').attr('id', 'bankroll').addClass('nav').html('Bankroll: $');
    if (window.matchMedia('(max-width: 580px)').matches) {
      displayBankroll.html('$');
    }
    var bankrollForm = $('<form>').attr('id', 'bankrollForm').appendTo(displayBankroll);
    var bankrollInput = $('<input>').attr({
      class: 'bankrollInput',
      name: 'bankroll',
      type: 'number',
      min: '5',
      max: '9999',
      value: '300',
      maxlength: '4'
    }).appendTo(bankrollForm);
    var displayBet = $('<h1>').attr('id', 'bet').addClass('nav').text('Bet: $' + bet);
    var kda = $('<h1>').attr('id', 'kda').addClass('nav').text('W' + wins + ' L' + losses + ' T' + ties);
    navbar.append(title, displayBankroll, displayBet, kda);

    var chooseBet = $('#betList');
    chooseBet.append($('<h3>').addClass('betText').text('BET'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet bet1').text('$1'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet bet5').html('$5'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet bet10').text('$10'));
    chooseBet.append($('<li>').addClass('betCursor').html('&spades;'));
    chooseBet.append($('<li>').addClass('selectBet bet25').text('$25'));
    if (window.matchMedia('(max-width: 580px)').matches) {
      $('.bet1').text('-');
      $('.bet10').text('+');
    }
    var prompt = $('<p>').attr('id', 'prompt');
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

    bet1.off('click');
    bet5.off('click', 'mouseover', 'mouseout');
    bet10.off('click');
    bet25.off('click');

    if (window.matchMedia('(min-width: 580px)').matches) {
      console.log('big enough');
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
    } else {
      bet1.on('click', function() {
        bet -= 5;
        updateBetHeader();
      });
      bet5.on({
        'mouseover': function() {
          bet5.text('BET');
        },
        'mouseout': function() {
          bet5.text('$5');
        }
      })
      bet10.on('click', function() {
        bet += 5;
        updateBetHeader();
      });
    }
  }

  function updateBankrollHeader() {
    if (window.matchMedia('(min-width: 580px)').matches) {
      $('#bankroll').text('Bankroll: $' + bankroll);
    } else {
      $('#bankroll').text('$' + bankroll);
    }
  }

  function updateBetHeader() {
    $('#bet').text('Bet: $' + bet);
  }

  function deal() {
    $('.flip-container').remove();
    placeBet();
    updateHeader();
    $('.card, .cardName, .cardValue').remove();
    player.hand = {cards: [], total: 0, stand: false, aces: 0, hole: ''};
    dealer.hand = {cards: [], total: 0, stand: false, aces: 0, hole: ''};
    player.makeMeter();
    dealer.makeMeter();
    setTimeout(function() {
      player.drawCard();
    }, 250);
    setTimeout(function() {
      dealer.drawHole();
    }, 750); // HOLE CARD
    setTimeout(function() {
      player.drawCard();
    }, 1250);
    setTimeout(function() {
      dealer.drawCard();
      checkWin();
    }, 1750);
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
    $('.disableOverlay').css({display: 'none'});
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
  };

  function showDeal() {
    updateBankrollHeader();
    $('#result').css({display: 'none'});
    clearInterval(cursor);
    $('#nextCursor').css({display: 'none'});
    $('#deal').css({display: 'block'});
    $('#betList').css({display: 'block'});
    $('.disableOverlay').css({display: 'none'});
  }

  function hideDeal() {
    $('#deal').css({display: 'none'});
    $('#actions').css({display: 'block'});
    $('#prompt').css({display: 'block'}).html('What will<br>' + nickname + ' do?');
    $('#betList').css({display: 'none'});
    $('.disableOverlay').css({display: 'none'});
  }

  function hit() {
    var button = $('#hit');
    var buttonCursor = $('.cursor').eq(0);

    button.on({
      'click': function() {
        player.drawCard();
        checkWin();
        clearInterval(actionCursor);
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
      checkWin();
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
          checkWin();
          player.hand.stand = true;
          checkWin();
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
        $('.disableOverlay').css({display: 'block'});
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
        $('.disableOverlay').css({display: 'block'});
        clearInterval(actionCursor);
        trainerBattle('Can\'t surrender!');
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
    $('.disableOverlay').css({display: 'none'});
    result.off('click').on('click', function() {
      clearInterval(cursor);
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
    $('.disableOverlay').css({display: 'block'});
    var resultMessage = '';

    if (player.hand.total > 21) { // if player busts
      if (!aceLogic(player)) { // bust if player had no aces
        winner = 'dealer';
        setTimeout(function() {
          showResult('Bust! You lose!');
        }, 500);
        return;
      }
    }
    if (dealer.hand.total > 21) { // if dealer busts
      if (!aceLogic(dealer)) { // bust if dealer had no aces
        winner = 'player';
        bankroll += (bet + (bet * 1.5));
        setTimeout(function() {
          showResult('Dealer bust! You win!');
        }, 500);
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
          var drawToEnd = setInterval(function() {
            if (dealer.hand.total < 17) {
              dealer.drawCard();
            } else {
              checkWin();
              clearInterval(drawToEnd);
            }
          }, 500);
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
          var drawToEnd = setInterval(function() {
            if (dealer.hand.total < 17) {
              dealer.drawCard();
            } else {
              checkWin();
              clearInterval(drawToEnd);
            }
          }, 500);
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
      $('.disableOverlay').css({display: 'none'});
    }
    if (winner != null) {
      setTimeout(function() {
        showResult(resultMessage)
      }, 500);
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
  var deckAmount = 3; // should I prompt for this?
  var deck = createDeck();
  var player = new Player('Player');
  var dealer = new Player('Dealer');
  var nickname = 'PLAYER';
  console.log('Hint! You can change your name and bankroll only before you begin...');
  $('#nameForm').submit(function() {
    nickname = $('#PlayerName').val() || 'PLAYER';
    console.log('Name registered!');
    return false;
  })
  var wins = 0, losses = 0, ties = 0, winner = null;
  var bet = 0;
  var runGame = true;
  makeHeader();
  bankroll = 300;
  $("#bankrollForm").submit(function() {
    bankroll = $('.bankrollInput').val() || 300;
    console.log('You have successfully dropped $' + bankroll + '. Good luck!');
    return false;
  });
  player.makeTable();
  dealer.makeTable();
  player.makeMeter();
  dealer.makeMeter();
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
