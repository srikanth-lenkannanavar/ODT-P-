angular.module('app').factory('BookingService', function (envconfig, restservice, $q, $rootScope) {
    var BookingService = {
        updateBookingRequest: function (payLoad) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.put(envconfig.get('host') + "/bookings/bookingrequest/updateRetailer", '', function (data, status) {
                deferred.resolve(data);
            }, function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            }, payLoad);
            return promise;
        },
        saveBookingRequest: function (payLoad, uuid) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var config = {
                headers: {
                    "Content-Type": "application/json",
                    "UUID": uuid
                }
            };
            restservice.post(envconfig.get('host') + "/bookings/addBooking", config, function (data, status) {
                deferred.resolve(data);
            }, function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            }, payLoad);
            return promise;
        },
        getRealex: function (uuid) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //restservice.get("scripts/json/retailer/my-payment-history.json",'', function (data, status) {
            restservice.get(envconfig.get('host') + "/quote-payment/" + uuid, '', function (data, status) {
                //restservice.get("scripts/json/retailer/new-payment-history.json",'', function (data, status) {
                deferred.resolve(data);
            }, function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            });
            return promise;
        },
        getBookingRequest: function (uuid) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.get(envconfig.get('host') + "/bookings/bookingrequest/" + uuid, '', function (data, status) {
                deferred.resolve(data);
            }, function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            });
            return promise;
        },

        getBookingByBrJobNumber: function (brJobNumber) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.get(envconfig.get('host') + "/bookings/getorderdetails?brJobNumber=" + brJobNumber, '', function (data, status) {
                deferred.resolve(data);
            }, function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            });
            return promise;
        },
        editBookingByBrJobNumber: function (payLoad) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            /*
            var config = {
                headers: {
                    "Content-Type": "application/json",
                    "UUID": uuid
                }
            };
            */
            restservice.put(envconfig.get('host') + "/amendBooking/save", "", function (data, status) {
                deferred.resolve(data);
            }, function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            }, payLoad);
            return promise;
        }
    };
    return BookingService;
});
