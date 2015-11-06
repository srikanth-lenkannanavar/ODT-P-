angular.module('app').controller('MyDeliveriesCtrl', function ($scope, $filter, $rootScope, $location, $modal, envconfig, restservice, modalservice, CommonService) {

    $scope.errFlag = false;
    $rootScope.loadingDiv = true;

    $scope.myDeliveries = [];

    $scope.page = {
        currentPage: 1
    }

    $scope.prevLink = false;
    $scope.nextLink = false;
    $scope.next = true;
    $scope.limit = 10;
    $scope.paginationError = false;

    var paginationConfig = {
        pageNumber: $scope.page.currentPage,
        pageSize: $scope.limit,
        sortBy: "transactiondate",
        sortOrder: "desc"
    }



    $scope.getDeliveries =  function(config){
        if(paginationConfig.pageNumber != 0) {
            CommonService.getRetailerMyDeliveries(config).then(function (data) {
                $rootScope.loadingDiv = false;
    //            $scope.myDeliveries = data.data;
    //            if (data.success) {
    //                $scope.myDeliveriesSuccess = data.success.status.toLowerCase();
    //            }

                $scope.myDeliveries = data.data;

                $scope.totalRecord = Math.ceil(data.size / $scope.limit);
                if (data.data.success) {
                    $scope.myDeliveriesSuccess = data.data.success.status.toLowerCase();
                    //$scope.myDeliveriesSuccess = data.success.status.toLowerCase();
                }
            }, function (err) {
                $rootScope.loadingDiv = false;
                //debugger;
                 $scope.errFlag = true;
                 $scope.errStatusCode = err.status;
                 if (Number($scope.errStatusCode) === 404) {
                 $scope.errStatusMsg = ", Store not found.";
                 }

            });
        }
    };
    
    $scope.getDeliveries(paginationConfig);  
    
    //sorting function
    $scope.doSort = function (obj) {
        if(paginationConfig.sortOrder == 'asc'){
            paginationConfig.sortOrder = 'desc';
        }else {
            paginationConfig.sortOrder = 'asc';
        }        
        $scope.getDeliveries(paginationConfig);
    }

    $scope.doPagination = function(pageNum){
        pageNum = parseInt(pageNum);
        $scope.page.currentPage = pageNum;
        if(($scope.page.currentPage == $scope.totalRecord) || (($scope.page.currentPage < $scope.totalRecord) && ($scope.page.currentPage != 0))){
            $scope.prevLink = false;
            //$scope.prevButton = true;
            $('.input-pagination').parent().removeClass('has-error');
            $scope.paginationError = false;
            paginationConfig.pageNumber = $scope.page.currentPage;
            $scope.getDeliveries(paginationConfig)
        } else {
            //show error
            $('.input-pagination').parent().addClass('has-error');
            $scope.paginationError = true;     
        }
    };



    $scope.confirmCancellation = function (deliveryObj) {
        $scope.orderNo = deliveryObj.orderNo;
        $scope.isGoTemp = false;
        modalservice.show('lg', 'views/template/modal/retailer/cancel-booking-popup.html', 'ModalCtrl', $scope, 'medium-dialog');
    };
    $scope.track = function (job, deliveryObj) {
        $scope.trackmap = true;
        $scope.bookingObj = deliveryObj;
        if (job !== "") {
            restservice.get(envconfig.get('host') + "/track/" + $scope.bookingObj.store.storeId + "/" + job, '', function (data, status) {
                $scope.lat = data.latitude;
                $scope.lng = data.longitude;
                $scope.vehicle = data.vehicleDescription;
                modalservice.show('lg', 'views/template/modal/track-your-delivery.html', 'ModalCtrl', $scope);
            }, function (data, status) {
                $scope.errFlag = true;
                $scope.errStatusCode = status;
            });
        }
        else {
            $scope.errFlag = true;
            $scope.errStatusCode = ", Store not found.";
        }
    };
});
