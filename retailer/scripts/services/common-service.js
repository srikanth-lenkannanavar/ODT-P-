/**
 * Created by ghanavela on 12/16/2014.
 */
/*
 *
 *Your Quote Service
 *
 */
angular.module('app').factory('CommonService', function (envconfig, restservice, $q, $rootScope) {
    var CommonService = {
        closeTimes: [
            '00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00',
            '03:30',
            '04:00',
            '04:30',
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30'
        ],
        allTimes: ['00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00',
            '03:30',
            '04:00',
            '04:30',
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30'
        ],
        shopOpenningTimes: [
            '00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00',
            '03:30',
            '04:00',
            '04:30',
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30'
        ],
        readyAtTime: [
            'Now',
            '00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00',
            '03:30',
            '04:00',
            '04:30',
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30'
        ],
        headerFooterRes: [
            {
                "header": [
                    {
                        "main": {
                            "isHeader": false,
                            "imgHref": "",
                            "imgUrl": "otd-home-footerbg",
                            "title": "On the dot: a delivery service that works around you",
                            "keywords": "Click & collect,Next day delivery,Same day delivery,Collection and delivery service,London delivery service",
                            "description": "Choose an hour delivery window so you never have to waste time waiting in for a delivery ever again. Shop online or in-store and we'll bring it straight to your door exactly when you want us to."
                        },
                        "howItWorks": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | How it works",
                            "keywords": "Click & Collect ,Same day delivery, Collection and delivery service",
                            "description": "Our collection and delivery service is simple and straight forward. Order what you want and we'll bring it straight to you."
                        },
                        "whereWeDeliver": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | Where we deliver",
                            "keywords": "Delivery services, Delivery service, Collection and delivery services, Collection and delivery service",
                            "description": "Enter your delivery postcode to see if you can take advantage of On the dot's collection and delivery services"
                        },
                        "howMuchItCosts": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | How much does it cost?",
                            "keywords": "Next day delivery",
                            "description": "Find out about our bundles and how much it costs for us to deliver straight to your door within your preferred hour"
                        },
                        "aboutUs": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | About us",
                            "keywords": "Delivery service",
                            "description": "Our delivery service is about making shopping easier with your items brought to you at the time you choose"
                        },
                        "faqs": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | FAQs for shoppers",
                            "keywords": "Click & Collect, Delivery services, Next day delivery,London delivery service",
                            "description": "Have any questions or unsure about our delivery services? Take a look through our FAQs to find the answers you need"
                        },
                        "faqsRetailer": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | FAQs for retailers",
                            "keywords": "Click & Collect, Delivery services, Collection and delivery service",
                            "description": "Have a question about our delivery services and how they can benefit your customers? Check our FAQs"
                        },
                        "integrationWithOurOpenApi": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | Retailer API integration ",
                            "keywords": "API,Delivery service",
                            "description": "Find out how our simple, RESTful, open API can be integrated with your systems"
                        },
                        "onthedotConsumerOffering": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | Our consumer offering",
                            "keywords": "Delivery services, Local retailers",
                            "description": "Find out how we’re doing deliveries differently and how you can offer this to your customers for free"
                        },
                        "press": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | Press enquiries",
                            "description": "For journalists who would like any press-related information or would like to ask the On the dot team any questions "
                        },
                        "termsAndConditions": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | Terms and Conditions",
                            "description": "On the dot full terms and conditions"
                        },
                        "privacyPolicy": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | Privacy policy",
                            "description": "Full On the dot privacy policy which details how we approach your data and personal information"
                        },
                        "cookies": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | Cookies",
                            "description": "Full details on how On the dot makes use of cookies for its service"
                        },
                        "areYouARetailer": {
                            "isHeader": true,
                            "imgHref": "",
                            "title": "On the dot | Are you a retailer?",
                            "keywords": "Click & Collect, Delivery services",
                            "description": "Why using our delivery services will better connect you to your customers and help your business grow"
                        },
                        "getInTouch": {
                            "isHeader": true,
                            "imgHref": "",
                            "imgUrl": "otd-get-in-touch-footerbg"
                        },
                        "getInTouchRetailer": {
                            "isHeader": true,
                            "imgHref": "",
                            "imgUrl": "otd-get-in-touch-footerbg"
                        },
                        "userRegistration": {
                            "isHeader": true,
                            "imgHref": "",
                            "imgUrl": "otd-user-registration-footerbg"
                        }
                    }
                ],
                "footer": [
                    {
                        "main": {
                            "isFooter": false,
                            "imgHref": envconfig.get("home") + "/how-much-it-costs",
//                            "footerClass": "otd-home-footerbg"
                        },
                        "aboutUs": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-much-it-costs",
                            "footerClass": "otd-aboutus-footerbg"
                        },
                        "press": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/register",
                            "footerClass": "otd-press-footerbg"
                        },
                        "termsAndConditions": {
                            "isFooter": false
                        },
                        "cookies": {
                            "isFooter": false
                        },
                        "privacyPolicy": {
                            "isFooter": false
                        },
                        "faqs": {
                            "isFooter": true,
                            "imgHref": envconfig.get("consumerHome") + "/what-it-costs",
                            "footerClass": "otd-faq-footerbg"
                        },
                        "getInTouch": {
                            "isFooter": true,
                            "imgHref": envconfig.get("consumerHome") + "/what-it-costs",
                            "footerClass": "otd-get-in-touch-footerbg"
                        },
                        "getInTouchRetailer": {
                            "isFooter": true,
                            "imgHref": envconfig.get("consumerHome") + "/what-it-costs",
                            "footerClass": "otd-get-in-touch-footerbg"
                        },
                        "whereWeDeliver": {
                            "isFooter": false,
                            "imgHref": envconfig.get("consumerHome") + "/what-it-costs",
//                            "footerClass": "otd-where-we-deliver-footerbg"
                        },
                        "howMuchItCosts": {
                            "isFooter": false,
                            "imgHref": envconfig.get("home") + "/register",
//                            "footerClass": "otd-how-much-it-costs-footerbg"
                        },
                        "userRegistration": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/register",
                            "footerClass": "otd-user-registration-footerbg"
                        },
                        "howItWorks": {
                            "isFooter": false,
                            "imgHref": envconfig.get("home") + "/register",
//                            "footerClass": "otd-how-it-works-footerbg"
                        },
                        "termsAndConditions":
                                {
                                    "isFooter": false,
                                    "imgHref": envconfig.get("home") + "/how-it-works",
                                    "footerClass": "otd-terms-and-conditions-footerbg"
                                },
                        "myDeliveries": {
                            "isFooter": false,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "myBilling": {
                            "isFooter": false,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "myProfile": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "deliveryZone": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "yourQuote": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "subscribeBook": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "subscribes": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "addressConfirmation": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "paymentSuccess": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "mySubscription": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "forgotpassword": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "updatepassword": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "editBooking": {
                            "isFooter": false,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "servicableZones": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "retailerIntegration": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/onthedot-consumer-offering",
                            "footerClass": "otd-retailer-integration-footerbg"
                        },
                        "areYouARetailer": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/faqs",
                            "footerClass": "otd-are-you-a-retailer-footerbg"
                        },
                        "onthedotCoUk": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/retailer-integration",
                            "footerClass": "otd-on-the-dot-co-uk-footerbg"
                        },
                        "uploadDocument": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/how-it-works",
                            "footerClass": "otd-generic-footerbg"
                        },
                        "integrationWithOurOpenApi": {
                            "isFooter": true,
                            "imgHref": envconfig.get("consumerHome") + "/onthedot-consumer-offering",
                            "footerClass": "otd-integration-with-our-open-api-footerbg"
                        },
                        "onthedotConsumerOffering": {
                            "isFooter": true,
                            "imgHref": envconfig.get("home") + "/integration-with-our-open-api",
                            "footerClass": "otd-onthedot-consumer-offering-footerbg"
                        },
                        "portal": {
                            "isFooter": true,
                            "imgHref": envconfig.get("retailerHome") + "/faqs",
                            "footerClass": "otd-portal-footerbg"
                        }
                    }
                ]
            }
        ],
        snakeToCamel: function (s) {
            return s.replace(/(\-\w)/g, function (m) {
                return m[1].toUpperCase();
            });
        },
        unCamelCase: function (s) {
            return  s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([a-z])/g, ' $1$2').replace(/\ +/g, ' ');
        },
        getDayDifFromToday: function (cd, noOfDays) {
            var currentDate = moment(moment().format('MM/DD/YYYY'));
            var days = moment.duration(moment(cd).diff(currentDate)).asDays();
            return (days >= noOfDays) ? false : true;
        },
        getDayDifFromGivenDate: function (givenDate, noOfDays) {
            var currentDate = moment(moment().format('MM/DD/YYYY'));
            var days = moment.duration(moment(cd).diff(currentDate)).asDays();
            return (days >= noOfDays) ? false : true;
        },

        getDayDifFromGivenDates: function (date1, date2) {

            //var now = moment("05/09/2013");
            //var then = moment("04/09/2013");
            var days= moment.duration(moment(date2,"DD/MM/YYYY ").diff(moment(date1,"DD/MM/YYYY"))).asDays();
            return days;
        },
        retailerPresent: function (retailers, data) {
            /* angular.forEach(retailers, function (retailer,key) {
             angular.forEach(retailer.retailerDetailsList,function(retailerdata,i) {
             if((data.retailerpostalcode == retailerdata.postCode) && (data.retailername == retailerdata.retailerName) &&  (data.retailerBranchName == retailerdata.retailerBranchName)) {
             console.log("retailerDataPresent");
             return false;
             }
             });
             });*/
            for (var i in retailers)
            {
                var retailersDataList = retailers[i].retailerDetailsList;
                for (var j in retailersDataList) {
                    if ((data.retailerpostalcode == retailersDataList[j].postCode) && (data.retailername == retailersDataList[j].retailerName) && (data.retailerBranchName == retailersDataList[j].retailerBranchName)) {
                        //console.log("retailerDataPresent");
                        return false;
                    }
                }
            }
            return true;
        },
        isHomePage: function (page) {
            var arr = ["main"];
            var res = arr.indexOf(page);
            return (res >= 0) ? "yes" : "no";
        },
        isStaticPage: function (page) {
            var arr = ["howItWorks", "whereWeDeliver", "howMuchItCosts", "aboutUs", "faqs", "getInTouch", "press", "termsAndConditions", "privacyPolicy", "cookies", "faqsRetailer", "getInTouchRetailer", "areYouARetailer", "integrationWithOurOpenApi", "onthedotConsumerOffering"];
            var res = arr.indexOf(page);
            return (res >= 0) ? "yes" : "no";
        },
        isTransactionalPage: function (page) {
            var arr = ["myDeliveries", "deliveryZone", "yourQuote", "mySubscription", "myBilling", "myProfile", "editBooking"];
            var res = arr.indexOf(page);
            return (res >= 0) ? "yes" : "no";
        },
        getTransactionCount: function () {
            var count;
            var user = $rootScope.loggedUser;
            var deferred = $q.defer();
            var promise = deferred.promise;
            //restservice.get(envconfig.get('host')+"/subscription/mysubscriptionnumber/"+user,
            //restservice.get("http://localhost/MyDeliveryPortal/subscription/mysubscritionnumber/"+user,
            restservice.get(envconfig.get('host') + "/subscription/mysubscriptionnumber",
                    '', function (data, status) {
                        count = data.subcount.subscriptionCount;
                        deferred.resolve(count);
                    }, function (data, status) {
                // error message
                deferred.reject(count);
            });
            return promise;
        },
        getRetailerSubscriptions: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.get(envconfig.get('host') + "/subscription/getsubscriptions", '', function (data, status) {
                //restservice.get("scripts/json/retailer/Subscription_Response.json", '', function (data, status) {
                //restservice.get("scripts/json/retailer/ActiveSubscription_Response.json",'', function (data, status) {
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
        getServerTime: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.get(envconfig.get('host') + "/bookings/getServerTime", '', function (data, status) {

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

        getMasterTblRadius : function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.get(envconfig.get('host')+ "/config?key=radius", '', function (data, status) {

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


        getZoomValue : function (radius) {
            if(radius > 8047){
                return 10;
            }else{
                return 11;
            }


        },
        setCalendarConfiguration: function (collectionDate, timeslotDate) {
            var diff = Number(timeslotDate.diff(collectionDate, 'days'));

            if (diff <= 0) {
                nextFlag = true;
                prevFlag = false;
            }
            if (diff === 6) {
                nextFlag = false;
                prevFlag = true;
            }
            if (diff > 0 && diff < 6) {
                nextFlag = true;
                prevFlag = true;
            }
            return {
                "nextFlag": nextFlag,
                "prevFlag": prevFlag
            };
        },
        getRetailerTimeslots: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.get("scripts/json/retailer/time-slot.json", '', function (data, status) {
                //debugger;
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
        getRetailerMyDeliveries: function (config) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //?pageNumber="+config.pageNumber+"&pageSize="+config.pageSize+"&sortBy="+config.sortBy+"&sortOrder="+config.sortOrder
            //restservice.get("scripts/json/retailer/my-delivery.json",'', function (data, status) {
            //restservice.get(envconfig.get('host') + "/userbookingdetails/mydeliveries", '', function (data, status) {
            restservice.get(envconfig.get('host') + "/userbookingdetails/mydeliveries?pageNumber="+config.pageNumber+"&pageSize="+config.pageSize+"&sortBy="+config.sortBy+"&sortOrder="+config.sortOrder, '', function (data, status) {
                //debugger;
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
        confirmPay: function (payLoad) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            restservice.post("scripts/json/retailer/voucher-cancel-post.json", '', function (data, status) {
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
        safeApply: function ($scope, fn) {
            fn = fn || function () {
            };
            if ($scope.$$phase) {
                //don't worry, the value gets set and AngularJS picks up on it...
                fn();
            }
            else {
                //this will fire to tell angularjs to notice that a change has happened
                //if it is outside of it's own behaviour...
                $scope.$apply(fn);
            }
        }
    };
    return CommonService;
});
// The "stacktrace" library that we included in the Scripts
// is now in the Global scope; but, we don't want to reference
// global objects inside the AngularJS components - that's
// not how AngularJS rolls; as such, we want to wrap the
// stacktrace feature in a proper AngularJS service that
// formally exposes the print method.
angular.module('app').factory("stacktraceService",
        function () {
            // "printStackTrace" is a global object.
            return({
                print: printStackTrace
            });
        }
);
// By default, AngularJS will catch errors and log them to
// the Console. We want to keep that behavior; however, we
// want to intercept it so that we can also log the errors
// to the server for later analysis.
//console.log(app);
app.provider(
        "$exceptionHandler",
        {
            $get: function (errorLogService) {
                return(errorLogService);
            }
        }
);
// By default, AngularJS will catch errors and log them to
// the Console. We want to keep that behavior; however, we
// want to intercept it so that we can also log the errors
// to the server for later analysis.
app.provider(
        "$exceptionHandler",
        {
            $get: function (errorLogService) {
                return(errorLogService);
            }
        }
);
// -------------------------------------------------- //
// -------------------------------------------------- //
// The error log service is our wrapper around the core error
// handling ability of AngularJS. Notice that we pass off to
// the native "$log" method and then handle our additional
// server-side logging.
app.factory(
        "errorLogService", function ($log, $window, $injector, stacktraceService) {
            // I log the given error to the remote server.
            function log(exception, cause) {
                // Pass off the error to the default error handler
                // on the AngualrJS logger. This will output the
                // error to the console (and let the application
                // keep running normally for the user).
                $log.error.apply($log, arguments);
                // Now, we need to try and log the error the server.
                // --
                // NOTE: In production, I have some debouncing
                // logic here to prevent the same client from
                // logging the same error over and over again! All
                // that would do is add noise to the log.
                try {
                    var errorMessage = exception.toString();
                    //console.log(stacktraceService);
                    //console.log(exception);
                    var stackTrace = stacktraceService.print({e: exception});
                    // Log the JavaScript error to the server.
                    // --
                    // NOTE: In this demo, the POST URL doesn't
                    // exists and will simply return a 404.
                    //console.log("welcome");
                    //console.log(newrelic);
                    var $location = $injector.get('$location');
                    /*
                     newrelic.noticeError(stackTrace);
                     newrelic.addPageAction('errorTest', {
                     url: $location.url(),
                     errorMessage: errorMessage,
                     stackTrace: stackTrace,
                     cause: ( cause || "" )
                     });
                     console.log("errorTest");
                     */
                    /*
                     $.ajax({
                     type: "POST",
                     url: "./javascript-errors",
                     contentType: "application/json",
                     data: angular.toJson({
                     errorUrl: $window.location.href,
                     errorMessage: errorMessage,
                     stackTrace: stackTrace,
                     cause: ( cause || "" )
                     })
                     });
                     */
                } catch (loggingError) {
                    // For Developers - log the log-failure.
                    $log.warn("Error logging failed");
                    $log.log(loggingError);
                }
            }
            // Return the logging function.
            return(log);
        }
);