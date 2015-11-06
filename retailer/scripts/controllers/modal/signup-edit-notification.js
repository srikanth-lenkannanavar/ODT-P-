'use strict';
angular.module('app').controller('SignupEditNotificationCtrl', function ($scope, $route, $rootScope, $http, $location, $modal, postcodeService, geocodeservice, restservice, modalservice, $routeParams, $window, envconfig, CommonService) {
    $scope.changeEditdemodal = function ()
    {
        $scope.$watch(function ()
        {
            modalservice.close();
            $scope.isGo = false;
        });
    };
});