'use strict';

/**
 * @ngdoc function
 * @name app.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the app
 */
angular.module('app')
    .controller('CopyPasteCtrl', function ($scope) {

        $scope.preview = function(){
            alert('sss');
        };

       $scope.preview = function(){

            var content =  document.getElementById('getContent').innerHTML;
           // console.log(content);
            document.getElementById('preview').innerHTML =  content;
        };


    });

