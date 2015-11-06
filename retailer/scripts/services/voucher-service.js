angular.module('app').factory('VoucherService', function (envconfig, restservice, $q, $rootScope) {

    var VoucherService = {
        getIsVoucherUsed: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //envconfig.get('host') + "/vouchers/uservoucherstatus"
            //restservice.get("scripts/json/retailer/voucher-get.json",'', function (data, status) {
            restservice.get(envconfig.get('host') + "/vouchers/uservoucherstatus",'', function (data, status) {

                deferred.resolve(data);
            },function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            });
            return promise;

        },

       isVoucherValid: function (voucherCode) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //envconfig.get('host') + "/vouchers/{voucher code}",
            //restservice.get("scripts/json/retailer/voucher-get.json",'', function (data, status) {
            restservice.get(envconfig.get('host') + "/vouchers/"+voucherCode,'', function (data, status) {
                deferred.resolve(data);
            },function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            });
            return promise;

        },
        voucherRedeem: function(payLoad) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //restservice.post("scripts/json/retailer/voucher-redeem-post-valid.json",'',function (data,status){
            restservice.post(envconfig.get('host')+"/vouchers/uservoucher",'',function (data,status){
               deferred.resolve(data);
            },function (data,status){
                var errMsg = {
                    "data": data,
                    "status": status
                };
               deferred.reject(errMsg);
            }, payLoad);
            return promise;
        },
        voucherCancel: function(payLoad) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var user = payLoad.user;
            var uuid = payLoad.uuid;
            //debugger;
            //restservice.post("scripts/json/retailer/voucher-cancel-post.json",'',function (data,status){
            restservice.delete(envconfig.get('host')+ "/vouchers/uservoucher/",'',function (data,status){
                deferred.resolve(data);
                debugger;
            },function (data,status){
                debugger;
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            }, payLoad);
            return promise;
        }
    };
    return VoucherService;

});
