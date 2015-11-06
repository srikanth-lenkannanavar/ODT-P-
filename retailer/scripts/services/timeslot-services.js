angular.module('app').factory('TimeSlotService', function (envconfig, restservice, $q, $rootScope) {
    var TimeSlotService = {
        postTimeslot: function (payLoad) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.post(envconfig.get('host') + "/timeslots/getAndSaveTimeSlots", '', function (data, status) {
            //restservice.get("scripts/json/retailer/time-slot.json", '', function (data, status) {
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
        getTimeslot: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.get(envconfig.get('host') + "/timeslots/getAndSaveTimeSlots", '', function (data, status) {
                deferred.resolve(data);
            }, function (data, status) {
                var errMsg = {
                    "data": data,
                    "status": status
                };
                deferred.reject(errMsg);
            });
            return promise;
        }
    };
    return TimeSlotService;
});
