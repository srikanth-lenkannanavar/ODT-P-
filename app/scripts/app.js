'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */


var app = angular
        .module('app', [
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ui.bootstrap',
            'postcode',
            'ngCookies',
            'google-maps'.ns(),
            'angularFileUpload',
            'app.directives',
            'ngMessages',
            'uktimefilter',
            'angulartics',
            'angulartics.google.tagmanager',
            'newrelic-timing'
        ])

        .run(function ($rootScope, $cookies, $location, $timeout, $window, $routeParams, CommonService) {
            $rootScope.userPostCode = "";
            $rootScope.uuid = "";
            $rootScope.userLoggedOut = true;
            $rootScope.userLogged = false;

            $rootScope.standAloneMapHeader = false;
            $rootScope.called = false;

            $rootScope.$watch(function ()
            {

                if ($location.search().logout && $location.search().logout == 'sso')
                {

                    //$cookies.user = undefined;
                    //$cookies.samlssoTokenId = undefined;
                    $rootScope.userLoggedOut = true;
                    $rootScope.userLogged = false;
                }

                if ($location.search().sso == "true") {
                    var domainName = "." + document.domain;
                    if (domainName.indexOf("www") > -1) {
                        domainName = domainName.replace('www.', '');
                    }
                    var samlTokenCookie = $cookies.onthedotTokenId;
                    document.cookie = 'onthedotTokenId=' + samlTokenCookie + '; domain=' + domainName + '; path=/; expires=' + newDate(0).toUTCString();
                    var userCookie = $cookies.user;
                    document.cookie = 'user=' + userCookie + '; domain=' + domainName + '; path=/; expires=' + newDate(0).toUTCString();
                }


                if ($location.search().user)
                {
                    //$cookies.user = $location.search().user;
                    //$cookies.samlssoTokenId = $location.search().user;
                    $rootScope.loggedUser = $location.search().user;
                }
                else if ($cookies.user && $cookies.user != "undefined")
                {
                    $rootScope.loggedUser = $cookies.user.replace(/"/g, '');
                }



                if ($cookies.onthedotTokenId && $cookies.user && $cookies.onthedotTokenId != "undefined" && $cookies.user != "undefined") {

                    $rootScope.userLogged = true;
                    $rootScope.userLoggedOut = false;

                    if (!$rootScope.called)
                    {
                        CommonService.getTransactionCount().then(function (data) {
                            $rootScope.showSubscriptionMenu = (data > 0) ? true : false;
                        });
                        $rootScope.called = true;
                    }
                }
                else
                {
                    $rootScope.userLoggedOut = true;
                    $rootScope.userLogged = false;
                }
            }, function (newValue) {


            });

            $rootScope.$on("$routeChangeStart", function (event, next, current) {

                if (current && (current.controller === "PaymentSuccessCtrl" || current.controller === "PaymentSuccessCtrl1" || current.controller === "YourQuoteCtrl" || current.controller === "MySubscriptionCtrl")) {
                    window.history.forward();
                }


                var headerFooterRes = CommonService.headerFooterRes;
                $rootScope.footerImg = "";
                $rootScope.footerLink = "";
                $rootScope.headerImg = "";
                $rootScope.headerLink = "";
                $rootScope.isFooter = false;
                $rootScope.title = "On the dot";
                $rootScope.keywords = "";
                $rootScope.description = "";

                //console.log(current.loadedTemplateUrl);
                var hPage = CommonService.snakeToCamel(next.templateUrl.split("/")[1].split(".html")[0]);
                $rootScope.standAloneMapHeader = (hPage == 'trackMap') ? true : false;
                $rootScope.isHomeHdr = (hPage == 'main') ? true : false;
                $rootScope.isRetailerHdr = (hPage == 'areYouARetailer') ? true : false;
                //console.log($rootScope.isHomeHdr);
                //console.log(hPage);

                if (headerFooterRes[0].header[0][hPage] && headerFooterRes[0].header[0][hPage].title) {
                    $rootScope.title = headerFooterRes[0].header[0][hPage].title;
                }
                if (headerFooterRes[0].header[0][hPage] && headerFooterRes[0].header[0][hPage].keywords) {
                    $rootScope.keywords = headerFooterRes[0].header[0][hPage].keywords;
                }

                if (headerFooterRes[0].header[0][hPage] && headerFooterRes[0].header[0][hPage].description) {
                    $rootScope.description = headerFooterRes[0].header[0][hPage].description;
                }


                if (headerFooterRes[0].footer[0][hPage]) {
                    /*
                     $rootScope.footerImg = headerFooterRes[0].footer[0][hPage].imgSrc;
                     $rootScope.footerLink = headerFooterRes[0].footer[0][hPage].imgHref;
                     */
                    //console.log("sss "+headerFooterRes[0].footer[0][hPage].isFooter);

                    if (headerFooterRes[0].footer[0][hPage].isFooter) {
                        $rootScope.isFooter = true;
                        $rootScope.footerClass = headerFooterRes[0].footer[0][hPage].footerClass;
                        $rootScope.footerLink = headerFooterRes[0].footer[0][hPage].imgHref;
                    } else {
                        $rootScope.isFooter = false;
                        $rootScope.footerClass = "";
                        $rootScope.footerLink = "";
                    }

                }


                if (headerFooterRes[0].header[0][hPage]) {

                    $rootScope.headerImg = headerFooterRes[0].header[0][hPage].imgSrc;
                    $rootScope.headerLink = headerFooterRes[0].header[0][hPage].imgHref;
                }
            });

            $rootScope.$on("$routeChangeSuccess", function (event, current) {
                //console.log($window1);

                var hPage = CommonService.snakeToCamel(current.loadedTemplateUrl.split("/")[1].split(".html")[0]);
                //console.log(current);
                var user = $rootScope.loggedUser || "Not logged in";
                var uuid = $routeParams.uuid || "nil";
                //console.log($routeParams.uuid);

                newrelic.addPageAction('routeChangeSucess', {
                    url: $location.url(),
                    hostName: $location.host(),
                    userName: user,
                    uuid: uuid,
                    name: hPage,
                    pageName: CommonService.unCamelCase(hPage),
                    isHomePage: CommonService.isHomePage(hPage),
                    isStaticPage: CommonService.isStaticPage(hPage),
                    isTransactionalPage: CommonService.isTransactionalPage(hPage)

                });
                //newrelic.addPageAction('ajaxAction', { ajaxUrl: $location.url(), method: "post/get" });
                //newrelic.setPageViewName('setPageTest', { url: $location.url() })
                //$rootScope.isLoading = true;
                //console.log(event);
                //console.log(current.loadedTemplateUrl);
                //console.log( CommonService.snakeToCamel(current.loadedTemplateUrl.split("/")[1].split(".html")[0]));
                if (current && (current.controller === "PaymentSuccessCtrl" || current.controller === "PaymentSuccessCtrl1" || current.controller === "YourQuoteCtrl" || current.controller === "MySubscriptionCtrl")) {
                    window.history.forward();
                }

                $rootScope.isLoading = false;
                $rootScope.showImg = true;
                $window.scrollTo(0, 0);
                //debugger;
                //console.log(current);
                //console.log($location);
                //console.log($location.path());
            });

        })

        .config(function (datepickerConfig, datepickerPopupConfig) {
            datepickerConfig.showWeeks = false;
            datepickerPopupConfig.toggleWeeksText = null;
            datepickerConfig.maxMode = "day";
        })

        .config(['$httpProvider', function ($httpProvider) {
                //initialize get if not there
                //console.log($httpProvider);

                if (!$httpProvider.defaults.headers.get) {
                    $httpProvider.defaults.headers.get = {};
                }

                $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
                $httpProvider.defaults.headers.common.Pragma = "no-cache";
                //disable IE ajax request caching
                $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

            }])

        .config(function ($routeProvider, $locationProvider) {

            $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainPageCtrl',
                    })
                    .when('/my-billing', {
                        templateUrl: 'views/my-billing.html',
                        controller: 'MyBillingCtrl',
                    })
                    .when('/upload-document', {
                        templateUrl: 'views/upload-document.html',
                    })
                    .when('/Booking/Retailers/:userpostcode', {
                        templateUrl: 'views/delivery-zone.html',
                        controller: 'DeliveryZoneCtrl',
                    })
                    .when('/:uuid/Booking/Retailers/:userpostcode', {
                        templateUrl: 'views/delivery-zone.html',
                        controller: 'DeliveryZoneCtrl',
                    })
                    .when('/:uuid/Booking/timeslots', {
                        templateUrl: 'views/your-quote.html',
                        controller: 'YourQuoteCtrl',
                    })
                    .when('/:uuid/Booking/Subscribe', {
                        templateUrl: 'views/subscribe-book.html',
                        controller: 'SubscribeBookCtrl',
                    })
                    .when('/subscriptions/subscribes', {
                        templateUrl: 'views/subscribes.html',
                        controller: 'SubscribeCtrl',
                    })
                    .when('/:uuid/address-confirmation', {
                        templateUrl: 'views/address-confirmation.html',
                        controller: 'AddressConfirmationCtrl',
                    })
                    .when('/:uuid/payment-success', {
                        templateUrl: 'views/payment-success.html',
                        //Name the controller accordingly
                        controller: 'PaymentSuccessCtrl'
                    })
                    .when('/:uuid/payment-success1', {
                        templateUrl: 'views/payment-success1.html',
                        //Name the controller accordingly
                        controller: 'PaymentSuccessCtrl1'
                    })
                    .when('/my-subscription', {
                        templateUrl: 'views/my-subscription.html',
                        controller: 'MySubscriptionCtrl',
                    })
                    .when('/my-deliveries', {
                        templateUrl: 'views/my-deliveries.html',
                        controller: 'MyDeliveriesCtrl'
                    })
                    .when('/register', {
                        templateUrl: 'views/user-registration.html',
                        controller: 'UserRegistrationCtrl'
                    })
                    .when('/forgotpassword', {
                        templateUrl: 'views/forgotpassword.html',
                        controller: 'ForgotPasswordCtrl'
                    })
                    .when('/updatepassword', {
                        templateUrl: 'views/updatepassword.html',
                        controller: 'ForgotPasswordCtrl'
                    })
                    .when('/myprofile', {
                        templateUrl: 'views/my-profile.html',
                        controller: 'MyProfileCtrl'
                    })
                    .when('/register/:uuid/:page', {
                        templateUrl: 'views/user-registration.html',
                        controller: 'UserRegistrationCtrl'
                    })
                    .when('/track-map/:trackstring', {
                        templateUrl: 'views/track-map.html',
                        controller: 'TrackMapCtrl'
                    })
                    .when('/copypaste', {
                        templateUrl: 'views/copy-paste.html',
                        controller: 'CopyPasteCtrl'
                    })
                    .when('/edit-booking/:uuid/:status/:transdate', {
                        templateUrl: 'views/edit-booking.html',
                        controller: 'EditBookingCtrl',
                    })
                    .when('/servicable-zones', {
                        templateUrl: 'views/servicable-zones.html',
                        controller: 'servicableZonesCtrl',
                    })
                    .when('/how-it-works', {
                        templateUrl: 'views/how-it-works.html',
                        //controller: 'HowItWorksCtrl'
                    })
                    .when('/where-we-deliver', {
                        templateUrl: 'views/where-we-deliver.html'
                    })
                    .when('/what-it-costs', {
                        templateUrl: 'views/how-much-it-costs.html'
                    })
                    .when('/about-us', {
                        templateUrl: 'views/about-us.html'
                    })
                    .when('/press', {
                        templateUrl: 'views/press.html'
                    })
                    .when('/blog', {
                        templateUrl: 'views/blog.html'
                    })
                    .when('/privacy-policy', {
                        templateUrl: 'views/privacy-policy.html'
                    })
                    .when('/cookies', {
                        templateUrl: 'views/cookies.html'
                    })
                    .when('/faqs', {
                        templateUrl: 'views/faqs.html'
                    })
                    .when('/faqs-retailer', {
                        templateUrl: 'views/faqs-retailer.html'
                    })
                    .when('/terms-and-conditions', {
                        templateUrl: 'views/terms-and-conditions.html'
                    })
                    .when('/get-in-touch', {
                        templateUrl: 'views/get-in-touch.html',
                        controller: 'GetInTouchConsumerCtrl'
                    })
                    .when('/get-in-touch-retailer', {
                        templateUrl: 'views/get-in-touch-retailer.html',
                        controller: 'GetInTouchRetailerCtrl'
                    })
                    .when('/are-you-a-retailer', {
                        templateUrl: 'views/are-you-a-retailer.html',
                        controller: 'AreYouARetailerCtrl'
                    })
                    .when('/retailer-integration', {
                        templateUrl: 'views/retailer-integration.html'
                    })
                    .when('/integration-with-our-open-api', {
                        templateUrl: 'views/integration-with-our-open-api.html'
                    })
//                    .when('/onthedot-consumer-offering', {
//                        templateUrl: 'views/onthedot-consumer-offering.html'
//                    })
                    // .when('/onthedot-co-uk', {
                    //     templateUrl: 'views/onthedot-co-uk.html'
                    // })                                    
                    .otherwise({
                        redirectTo: '/'
                    });

            //remove "#" from URL
            $locationProvider.html5Mode(true);

        });


//shoule move these controllers to its own page
angular.module('app')
        .controller('AlertCtrl', function ($rootScope)
        {

            $rootScope.alerts = [];

            $rootScope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };

        });

angular.module('app')
        .controller('NavigationController', function ($scope, $location)
        {
            //highlighting the active nav item
            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };

        });

/* Directives */
angular.module('app.directives', [])
        .directive('pwCheck', [function () {
                return {
                    require: 'ngModel',
                    link: function (scope, elem, attrs, ctrl) {
                        var firstPassword = '#' + attrs.pwCheck;
                        elem.add(firstPassword).on('keyup', function () {
                            scope.$apply(function () {
                                // console.info(elem.val() === $(firstPassword).val());
                                ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                            });
                        });
                    }
                }
            }]);