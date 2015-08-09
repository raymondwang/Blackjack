## Blackjack

A fully functional Blackjack simulation that adheres to standard casino rules.

### User Story

---
### Test Statements

---
### TO DO:
- Initial menu prompt/forms: Bankroll, Name, -maybe- Amount of Decks
- Face down logic (will take a while)
  - maybe init hand.hole;
  - function dealerHole does everything that drawCard does, except doesn't add total value, doesn't check win, sets image to image back, sets name to hand.hole
    - function revealHole flips hole--image is still hand.hole, checks win
  - can add in way more dealer functionality that way
  - will update all dealer draws after this
- Could add some more responsiveness for screen height maybe; I don't know what to do about very small widths
- still have to update responsiveness for card positioning
  - mobile sizing bet cursors disabled for now

for fun:
- have blackjack bars fill up at intervals ? ? ?
