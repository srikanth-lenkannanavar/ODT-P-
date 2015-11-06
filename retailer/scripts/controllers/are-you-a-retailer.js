'use strict';

/**
 * @ngdoc function
 * @name app.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the app
 */
angular.module('app')
        .controller('AreYouARetailerCtrl', function ($scope, $modal, modalservice, envconfig) {

            $scope.homeUrl = envconfig.get("retailerHome");
            $scope.consumerHomeUrl = envconfig.get("consumerHome");
            //  $scope.retailerHomeUrl = envconfig.get("retailerHome");

//    alert($scope.consumerHomeUrl)
            $scope.homeNonSslUrl = envconfig.get("homeNonSsl");
            //$scope.name ="john";
            $scope.playVideo = function () {
                modalservice
                        .show(
                                'md',
                                'views/template/modal/video-retailer.html',
                                'ModalCtrl',
                                $scope,
                                'video-popup');
            };
        });
