angular.module('app').controller('MyPaymentHistoryCtrl', function ($scope,$rootScope, $filter, envconfig, restservice,PaymentService) {
    var user = $rootScope.loggedUser;
    var reverse = false;
    $scope.reverse = false;
    $scope.page = {
        currentPage: 1
    }

    $scope.prevLink = false;
    $scope.nextLink = false;
    $scope.limit = 10;

    var paginationConfig = {
        pageNumber: $scope.page.currentPage,
        pageSize: $scope.limit,
        sortBy: "createdate",
        sortOrder: "desc"
    }
    $rootScope.loadingDiv = true;

    //?pageNumber=8&pageSize=2&sortBy=createdate&sortOrder=asc
     $scope.getPaymentHistory = function(config){
         $rootScope.loadingDiv = true;
         if(paginationConfig.pageNumber != 0) {
             PaymentService.getPaymentHistory(config).then(function(data){
                 $rootScope.loadingDiv = false;
                 if(data.data.data.payments){
                     $scope.payments = data.data.data.payments;
                 }else{
                     $scope.payments = [];
                 }

                 $scope.totalRecord = Math.ceil(data.data.size / $scope.limit);

                 $scope.store  = data.data.data.store;
                 if(data.success){
                     $scope.myPaymentHistorySuccess = data.success.status.toLowerCase();

                 }
             },function(err){
                 $rootScope.loadingDiv = false;
                 $scope.errFlag = true;
                 $scope.errStatusCode = err.status;
                 if(Number($scope.errStatusCode) === 404){
                     $scope.errStatusMsg = ", resource not found.";
                 }
             });
         }

     }
     
    //sorting function
    $scope.doSort = function () {
        if(paginationConfig.sortOrder == 'asc'){
            paginationConfig.sortOrder = 'desc';
        }else {
            paginationConfig.sortOrder = 'asc';
        }        
        $scope.getPaymentHistory(paginationConfig);
    }

    $scope.getPaymentHistory(paginationConfig);


    /*$scope.doPagination = function(pageNum){

        $scope.page.currentPage = pageNum;

        if($scope.page.currentPage === $scope.totalRecord){
            $scope.prevLink = false;
        }
        paginationConfig.pageNumber = $scope.page.currentPage;
        $scope.getPaymentHistory(paginationConfig);

    };*/
    
    $scope.doPagination = function(pageNum){
        pageNum = parseInt(pageNum);
        $scope.page.currentPage = pageNum;
        if(($scope.page.currentPage == $scope.totalRecord) || (($scope.page.currentPage < $scope.totalRecord) && ($scope.page.currentPage != 0))){
            $scope.prevLink = false;
            //$scope.prevButton = true;
            $('.input-pagination').parent().removeClass('has-error');
            $scope.paginationError = false;
            paginationConfig.pageNumber = $scope.page.currentPage;
            $scope.getPaymentHistory(paginationConfig)
        } else {
            //show error
            $('.input-pagination').parent().addClass('has-error');
            $scope.paginationError = true;     
        }
    };








});