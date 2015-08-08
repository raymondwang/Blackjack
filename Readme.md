## Blackjack

A fully functional Blackjack simulation that adheres to standard casino rules.

### User Story

---
### Test Statements

---
### TO DO:
- Bet/Bankroll logic - min/max bet, can't bet if bankroll < bet, if bankroll <= 0 GAMEOVER
  - NAVBAR includes MAX BET and MIN BET?
- Initial menu prompt/forms: Bankroll, Name, -maybe- Amount of Decks
- Improve dealing animation
- Face down logic (will take a while)
  - maybe init hand.hole;
  - function dealerHole does everything that drawCard does, except doesn't add total value, doesn't check win, sets image to image back, sets name to hand.hole
    - function revealHole flips hole--image is still hand.hole, checks win
  - can add in way more dealer functionality that way
- WAY more responsiveness! -- especially awful text
- "Can't surrender" prompt  
  - should be pretty easy - set to "deactivateSurrender", instead of calling prompt in like normal just reuse code from prompt manually
