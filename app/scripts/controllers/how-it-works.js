angular.module('app').controller('HowItWorksCtrl', function ($scope, $rootScope) {   
    //watches every change in the view
    $scope.$watch('$viewContentLoaded', function() {
        var offsetValue = $('#' + $rootScope.divset).offset().top;
        $('html, body').animate({scrollTop: offsetValue}, 'slow');
    });
});