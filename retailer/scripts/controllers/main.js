'use strict';

/**
 * @ngdoc function
 * @name app.controller:MainCtrl
 * @description # MainCtrl Controller of the app
 */
app
        .controller(
                'MainPageCtrl',
                function ($rootScope, $scope, $modal, modalservice)
                {
                    $scope.playVideo = function () {
                        modalservice
                                .show(
                                        'md',
                                        'views/template/modal/video-home.html',
                                        'ModalCtrl',
                                        $scope,
                                        'video-popup');
                    };

                    $scope.divfocus = function (val) {
                        $rootScope.divset = val;
                    };

                });