angular.module('Blackjack')
  .directive('card', CardDirective);

CardDirective.$inject = ['$animateCss', '$window'];
function CardDirective($animateCss, $window) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var index = Array.prototype.indexOf.call(element.parent().children(),
          element[0]);
      // The cards have a width of 118; 59 is half. 119.5 is a golden number.
      var cardOffset = (index * 59) + 119.5,
          fromOptions,
          toOptions;

      // These measurements are brittle, but I don't anticipate moving either
      // the deck or card placements.
      if (element.hasClass('card--player')) {
        fromOptions = {
          bottom: ($window.innerHeight / 2 - 263) + 'px',
          left: ($window.innerWidth / 2 - cardOffset) + 'px'
        };
        toOptions = {
          bottom: 0,
          left: 0
        };
      } else if (element.hasClass('card--dealer')) {
        fromOptions = {
          top: ($window.innerHeight / 2 - 197) + 'px',
          right: ($window.innerWidth / 2 - cardOffset) + 'px'
        };
        toOptions = {
          top: 0,
          right: 0
        };
      }

      $animateCss(element, {
        event: 'enter',
        structural: true,
        from: fromOptions,
        to: toOptions,
        duration: 0.5
      }).start();
    }
  }
}
