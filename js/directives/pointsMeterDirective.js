angular.module('Blackjack')
  .directive('pointsMeter', function() {
    return {
      restrict: 'E',
      template: '<div class="stats-pointsMeter"></div>',
      scope: {
        points: '<'
      },
      link: function(scope, element) {
        scope.$watch('points', function(points, previousPoints) {
          var width = getWidth(points);
          var color = getColor(points);
          var steps = Math.abs(points - previousPoints);

          Velocity(element[0].firstChild, {
            width: width + 'px',
            backgroundColor: color
          }, {
            easing: 'easeOut',
            duration: 400
          });
        });

        function getWidth(points) {
          return points < 21 ? points * 11 : 230;
        }

        function getColor(points) {
          if (points === 0) {
            // Background color
            return '#6B8E23';
          } else if (points < 21) {
            // Blue
            return '#1E90FF';
          } else if (points === 21) {
            // Yellow
            return '#FFD700';
          } else if (points > 21) {
            // Red
            return '#B22222';
          }
        }
      }
    }
  });
