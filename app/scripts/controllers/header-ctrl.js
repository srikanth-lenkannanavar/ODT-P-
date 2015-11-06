'use strict';
angular.module('app').controller('HeaderCtrl', function ($scope, $rootScope, $location, $modal, CommonService, envconfig, postcodeService, geocodeservice, restservice, modalservice, photourlservice) {

    $scope.homeUrl = envconfig.get("home");
    $scope.homeNonSslUrl = envconfig.get("homeNonSsl");
    $scope.consumerHomeUrl = envconfig.get("consumerHome");
    $scope.retailerHomeUrl = envconfig.get("retailerHome");
    //if($rootScope.userLogged){
    // CommonService.getTransactionCount().then(function(data){
    //     $scope.showSubscriptionMenu = (data > 0) ? true : false ;
    // });
    // }

    $scope.IsIeVersion = false;
    $scope.headerMap = {};

    $scope.alerts = [];
    $scope.mydeliveryuser =
            {
                postCodeValue: ''
            };

    $scope.mymodal =
            {
                modalInstance: ''
            };

    // getting the location
    $scope.findAndUseLocation = function (position)
    {
        if (navigator.geolocation)
        {
            navigator.geolocation
                    .getCurrentPosition($scope.getPostalCode);
        }
        else
        {
            $scope
                    .alertfunc('Geolocation is not supported by this browser.');

        }
    };

    // getting the postcode
    $scope.getPostalCode = function (position)
    {
        geocodeservice.getPostalCode(position,
                $scope.updatepostcode, $scope.alertfunc);
    };

    // updating the ui after getting the results from service
    $scope.updatepostcode = function (postcode)
    {
        $scope.mydeliveryuser.postCodeValue = postcode;
        $scope.$apply();
    };

    // navigate to second page
    $scope.go = function (path)
    {
        var result = postcodeService
                .validate($scope.mydeliveryuser.postCodeValue);


        // return false;

        // console.log();

        if (result !== false)
        {

            var postcodepart = result.split(" ");

            // console.log(postcodepart.join(''));

            // get with url,config,successcallback and
            // errorcallback
            restservice
                    .get(
                            envconfig.get('host')
                            + "/bookings/deliveryAdd/"
                            + postcodepart.join(''),
                            '',
                            function (data, status)
                            {

                                if (data.hasOwnProperty('serviced'))
                                {
                                    $rootScope.uuid = data['uuid'];
                                    $location
                                            .path(data['uuid']
                                                    + path
                                                    + '/'
                                                    + $scope.mydeliveryuser.postCodeValue);
                                }
                            }, function (data, status)
                    {
                        if (data
                                .hasOwnProperty('enclosedObject')
                                && data.enclosedObject !== null
                                && data.enclosedObject !== '')
                        {
                            // alert(data.errorMsg);
                            $rootScope.errorMsg = data.errorMsg;
                            $rootScope.noServiceUUID = data.enclosedObject;
                            // $scope.showmodal();
                            modalservice
                                    .show(
                                            'lg',
                                            'views/template/modal/getquot-notification.html',
                                            'ModalCtrl',
                                            $scope,
                                            'medium-dialog');
                            $scope.alertfunc("");
                        }
                    });

        }
        else
        {
            $scope.alertfunc("Please enter a valid postcode");
        }
    };

    $scope.showmodal = function ()
    {
        modalservice.show('', 'myModalContent.html',
                'MainPageCtrl')
    };

    $scope.hidemodal = function ()
    {
        modalservice.hide();
    };

    // updating the ui after getting the results from service
    $scope.alertfunc = function (message)
    {
        $scope.alerts = [];
        $scope.alerts.push(
                {
                    type: 'danger',
                    msg: message
                });
    };

    $scope.showHeaderPhoto = function ()
    {
        restservice
                .get(
                        envconfig.get('host')
                        + "/photo-location",
                        '',
                        function (data, status)
                        {
                            // success
                            // console.log(data);

                            var objPhotoLocation = angular
                                    .fromJson(data);

                            $scope.header_img_url = photourlservice
                                    .resolvePhotoUrl(
                                            objPhotoLocation.enclosedObject.photoLocation,
                                            objPhotoLocation.enclosedObject.defaultPhotoLocation);

                        }, function (data, status)
                {
                    // fail
                    // console.log("Fail");
                    console.log(data);
                }, '');
    };

    var ieDetector = function () {
        var browser = { // browser object

            verIE: null,
            docModeIE: null,
            verIEtrue: null,
            verIE_ua: null

        },
        tmp;

        tmp = document.documentMode;
        try {
            document.documentMode = "";
        } catch (e) {
        }
        ;

        browser.isIE = typeof document.documentMode == "number" || eval("/*@cc_on!@*/!1");
        try {
            document.documentMode = tmp;
        } catch (e) {
        }
        ;

        // We only let IE run this code.
        if (browser.isIE) {
            browser.verIE_ua =
                    (/^(?:.*?[^a-zA-Z])??(?:MSIE|rv\s*\:)\s*(\d+\.?\d*)/i).test(navigator.userAgent || "") ?
                    parseFloat(RegExp.$1, 10) : null;

            var e, verTrueFloat, x,
                    obj = document.createElement("div"),
                    CLASSID = [
                        "{45EA75A0-A269-11D1-B5BF-0000F8051515}", // Internet Explorer Help
                        "{3AF36230-A269-11D1-B5BF-0000F8051515}", // Offline Browsing Pack
                        "{89820200-ECBD-11CF-8B85-00AA005B4383}"
                    ];

            try {
                obj.style.behavior = "url(#default#clientcaps)"
            } catch (e) {
            }
            ;

            for (x = 0; x < CLASSID.length; x++) {
                try {
                    browser.verIEtrue = obj.getComponentVersion(CLASSID[x], "componentid").replace(/,/g, ".");
                } catch (e) {
                }
                ;

                if (browser.verIEtrue)
                    break;

            }
            ;
            verTrueFloat = parseFloat(browser.verIEtrue || "0", 10);
            browser.docModeIE = document.documentMode ||
                    ((/back/i).test(document.compatMode || "") ? 5 : verTrueFloat) ||
                    browser.verIE_ua;
            browser.verIE = verTrueFloat || browser.docModeIE;
        }
        ;

        return {
            isIE: browser.isIE,
            Version: browser.verIE
        };

    }();
    if ((ieDetector.isIE) && (ieDetector.Version <= 9))
    {
        $scope.IsIeVersion = true;
    }
//    else {
//        alert("sgdf")
//    }
//    document.write('isIE: ' + ieDetector.isIE + "<br />");
//    document.write('IE Version Number: ' + ieDetector.Version);

});