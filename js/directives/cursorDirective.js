angular.module('Blackjack')
  .directive('cursor', function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.bind('mouseover', function() {
          element[0].previousElementSibling.classList.add('cursor--active');
        });

        element.bind('mouseout', function() {
          element[0].previousElementSibling.classList.remove('cursor--active');
        });
      }
    }
  });
