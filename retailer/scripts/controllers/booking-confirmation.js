angular.module('app')
        .controller('BookingConfirmationCtrl', function ($scope, $upload, $rootScope, $location, $modal, modalservice, $http) {
            $scope.saveAddress = function () {
                modalservice.show('lg', 'views/template/modal/save-delivery-address.html', 'ModalCtrl', $scope, 'medium-dialog');
            };
            $scope.orderPrnt = function () {
                window.print();
            };
          


            $http.get('scripts/save-add.json').
                    success(function (response) {
//                        console.log(response)
    //                    console.log(angular.fromJson(response))
                        
//                        console.log($scope.userAddr)

                        $scope.names = response;
                    }).
                    error(function () {
                        // log error
                    });




        });





            