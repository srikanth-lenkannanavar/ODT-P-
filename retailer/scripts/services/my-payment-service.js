angular.module('app').factory('PaymentService', function (envconfig, restservice, $q, $rootScope) {

    var PaymentService = {
        getPaymentHistory: function(config) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //restservice.get("scripts/json/retailer/my-payment-history.json",'', function (data, status) {
            restservice.get(envconfig.get('host') + "/billinghistory/paymenthistory?pageNumber="+config.pageNumber+"&pageSize="+config.pageSize+"&sortBy="+config.sortBy+"&sortOrder="+config.sortOrder,'', function (data, status) {
            //restservice.get("scripts/json/retailer/my-payment-history.json",'', function (data, status) {
                deferred.resolve(data);
            },function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            });
            return promise;

        }



    };

    return PaymentService;

});
