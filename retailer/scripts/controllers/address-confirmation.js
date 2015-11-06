angular
        .module('app')
        .controller(
                'AddressConfirmationCtrl',
                function ($scope, $upload, $rootScope, $location, envconfig,
                        $modal, restservice, modalservice, $http, $routeParams,
                        $filter, AddressConfirmationService, $timeout,
                        geocodeservice, colrefdocservice)
                {
                    $scope.valueCheckBoxAcAddr = false;
                    $scope.valueCheckBoxTcAddr = false;
                    $scope.oneAtATime = true;
                    $scope.isCollection = false;
                    $scope.userpostcode = "";
                    $scope.iSvalueR = true;
                    $scope.recieptNoUnique = false;
                    $scope.isConfirm = false;

                    $scope.status =
                            {
                                isFirstOpen: true,
                                isSecondOpen: true,
                                isFirstDisabled: false
                            };
                    $scope.bookingRequestArr = {};
                    $scope.bookingrequesttimeslot = {};
                    $scope.voucher = {
                        code: ""
                    };
                    $scope.selected = undefined;
                    $scope.isVoucherUsed = false;
                    // $scope.isVoucherValid = true;

                    $scope.collectionreferences = {};
                    $scope.items = [];
                    $scope.userProfile = {};
                    $scope.book =
                            {
                                uuid: '',
                                phonenumber: ''
                            };
                    $scope.obj =
                            {
                                phoneNumber: null,
                                address: null,
                                deliveryReferenceName: null,
                                otherInstructions: null
                            };

                    $scope.storetime =
                            {
                                opentime: null,
                                closetime: null

                            };
                    $scope.collectionDeliverySave = function (obj, isValid)
                    {
                        if (obj.address === null) {
                            $scope.obj.selected = true;
                        }

                        if (!isValid || $scope.items.length === 0)
                            return;



                        $scope.obj = obj;

                        $scope.isConfirm = true;
                        var collection = [];
                        for (var i = 0; i < $scope.items.length; i++)
                        {

                            //MRS. Remove transient properties.
                            //delete <property> may be slow. Prefer blanking 'em out
                            //
                            if ("fileUploadErrorMessage" in $scope.items[i])
                                $scope.items[i].fileUploadErrorMessage = "";
                            //
                            if ("isWorking" in $scope.items[i])
                                $scope.items[i].isWorking = false;

                            //
                            if ("progressMessage" in $scope.items[i])
                                $scope.items[i].progressMessage = "";

                            collection.push(angular.toJson($scope.items[i]));
                        }

                        var payload =
                                {
                                    uuid: $routeParams.uuid,
                                    collectionreferences: collection
                                };
                        var latLong;

                        if ($scope.obj.deliveryReferenceName != null)
                        {
                            payload.deliveryrefname = $scope.obj.deliveryReferenceName;
                        }
                        if ($scope.obj.address != null)
                        {
                            payload.deliveryrefaddress1 = $scope.obj.address.address1;
                            if ($scope.obj.address.address2) {
                                payload.deliveryrefaddress2 = $scope.obj.address.address2;
                            } else {
                                payload.deliveryrefaddress2 = "~|^";
                            }
                            payload.deliveryrefaddresstown = $scope.obj.address.town;
                            payload.deliveryrefaddresscounty = $scope.obj.address.county;
                            payload.deliveryrefcompany = $scope.obj.address.company;

                        }
                        if ($scope.obj.phoneNumber != null)
                        {
                            payload.deliveryrefphoneno = $scope.obj.phoneNumber;
                        }
                        if ($scope.obj.otherInstructions)
                        {
                            payload.deliveryrefotherinst = $scope.obj.otherInstructions;
                        } else {
                            payload.deliveryrefotherinst = "~|^";
                        }


                        restservice
                                .put(
                                        envconfig.get('host')
                                        + "/bookings/bookingrequest/updateRetailerAdd",
                                        '',
                                        // "http://localhost/BookingModule/services/bookings",'',
                                                // envconfig.get('host')+"/retailer/getretailers",
                                                        // '',
                                                                function (data, status)
                                                                {



                                                                    restservice
                                                                            .get(
                                                                                    envconfig.get('host')
                                                                                    + "/timeslots/expiry/"
                                                                                    + $routeParams.uuid,
                                                                                    '',
                                                                                    function (data, status)
                                                                                    {

                                                                                        if (data.isExpired == "false") {
                                                                                            // the
                                                                                            // user
                                                                                            // has
                                                                                            // subscription
                                                                                            // and
                                                                                            // valid
                                                                                            // delivery
                                                                                            if ($scope.validSubscription && $scope.bookingRequestArr.zone == "within")
                                                                                            {
                                                                                                $scope.bookOrder();
                                                                                                // show
                                                                                                // booking
                                                                                                // confirmation
                                                                                                // page
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                // show
                                                                                                // payment
                                                                                                // page
                                                                                                $scope.getQuotePaymentPage();
                                                                                            }
                                                                                        } else {
                                                                                            alert("Timeslot Expired Redirecting to select new Timeslot for Delivery");
                                                                                            $location.path($routeParams.uuid + "/Booking/timeslots");
                                                                                        }

                                                                                    }, function (data, status)
                                                                            {
                                                                            });




                                                                }, function (data, status)
                                                        {
                                                            // failure
                                                        }, payload);
                                                    };
                                            $scope.go = function (path)
                                            {
                                                $location
                                                        .path($routeParams.uuid + path + $scope.userpostcode);
                                            };
                                            $scope.collectionDeliveryGoBack = function ()
                                            {
                                                // $location.path('/:uuid/Booking/timeslots');
                                                $location.path($routeParams.uuid + '/Booking/timeslots');

                                            };
                                            /*
                                             * phone number checkbox hide and
                                             * show start
                                             */

                                            $scope.isRegesterPhno = true;
                                            if ($scope.isRegesterPhno)
                                            {
                                                $scope.phoneNo = "";
                                            }
                                            /*
                                             * phone number checkbox hide and
                                             * show ends
                                             */

                                            /* dynamin form append start */
                                            $scope.deleteItem = function (index)
                                            {
                                                // MRS: Delete file associated
                                                // with this collection
                                                // reference
                                                $scope.deleteFile(index, false);
                                                $scope.items.splice(index, 1)
                                                if ($scope.items.length == 0)
                                                {
                                                    $scope.isCollection = true;
                                                }
                                                else
                                                {
                                                    $scope.isCollection = false;
                                                }
                                            };
                                            $scope.addItem = function (index)
                                            {
                                                $scope.items.push(
                                                        {
                                                            id: $scope.items.length + 1
                                                        });
                                                $scope.isCollection = false;
                                            };
// $scope.addItem(0);
                                            /* dynamin form append ends */

                                            /*
                                             * Start functional logic for
                                             * autocoplate function in addres
                                             */

//                                            var url1 = "http://localhost:8383/app/scripts/json/addressdropdown.json";
//                                            $http.get(url1).
                                            $http.get(
                                                    envconfig.get('host') + '/address/'
                                                    + $routeParams.uuid).
                                                    success(
                                                            function (data, status, headers, config)
                                                            {
                                                                console.log(angular.fromJson(data.enclosedObject));
                                                                if (data && data.enclosedObject)
                                                                {
                                                                    $scope.posts = angular.fromJson(data.enclosedObject);
                                                                    $scope.posts[0].town;
                                                                }
                                                            }).error(function (data, status, headers, config)
                                            {
                                                // log error
                                            });
                                            /*
                                             * End Of functional logic for
                                             * autocoplate function
                                             */
                                            $scope.showmodal = function ()
                                            {
                                                modalservice.show('md', 'file-upload.html',
                                                        'AddressConfirmationCtrl');
                                            };
                                            $scope.hidemodal = function ()
                                            {
                                                modalservice.hide();
                                            };

                                            $scope.focusOut = function (address)
                                            {
                                                $scope.obj.selected = true;
                                                $scope.obj.address = address;
                                                $timeout(function () {
                                                    $('input.addressmanually').blur();
                                                    $('input.addressmanually').val('');
                                                    $('input#company').focus();
                                                }, 2, false);
                                            };

                                            $scope.onFileSelect = function ($files, index)
                                            {
                                                // TEST
                                                // $routeParams.uuid =
                                                // "srikanth1234";
                                                // $scope.items[index].recieptNo
                                                // = "receiptNumber123";


                                                colrefdocservice.uploadDoc($files, index, $scope,
                                                        restservice, $upload, envconfig,
                                                        $scope.items, $routeParams.uuid);
                                            };
                                            $scope.fileIndex = null;
                                            $scope.fileInteractive = null;

                                            $scope.deleteFileModel = function (index, interactive)
                                            {
                                                $scope.fileIndex = index;
                                                $scope.fileInteractive = interactive;
                                                modalservice.show('lg', 'views/template/modal/delete-booking.html', 'ModalCtrl', $scope, 'medium-dialog');
                                            }
                                            $scope.deleteFileYes = function ()
                                            {
                                                modalservice.close();
                                                $scope.deleteFile($scope.fileIndex, $scope.fileInteractive);
                                            }
                                            $scope.deleteFile = function (index, interactive)
                                            {

//                                                alert('function');
                                                colrefdocservice.deleteDoc(index, $scope,
                                                        restservice, envconfig, interactive,
                                                        $scope.items, $routeParams.uuid);
                                            };
                                            // get booking request details
                                            $scope.getBookingRequest = function ()
                                            {
//                                                var url = "scripts/json/add.json";
//                                                restservice.get(url, '', function (data, status)
//                                                {
                                                restservice
                                                        .get(
                                                                envconfig.get('host')
                                                                + "/bookings/bookingrequest/"
                                                                + $routeParams.uuid,
                                                                '',
                                                                function (data, status)
                                                                {

                                                                    $scope.bookingRequestArr = data;
                                                                    $scope.userpostcode = $scope.bookingRequestArr.postcode;
                                                                    $scope.userVoucherStatus();
                                                                    $scope.getStoreTime($scope.bookingRequestArr.packagecollectionreadydate);
                                                                    if ($scope.bookingRequestArr.deliveryrefaddress1 != null) {
                                                                        $scope.obj.address = {};
                                                                        $scope.addressTemp = {};
                                                                        $scope.addressTemp.address1 = $scope.bookingRequestArr.deliveryrefaddress1;
                                                                        $scope.obj.address.address1 = $scope.bookingRequestArr.deliveryrefaddress1;
                                                                        if ($scope.bookingRequestArr.deliveryrefaddress2) {
                                                                            $scope.obj.address.address2 = $scope.bookingRequestArr.deliveryrefaddress2;
                                                                            $scope.addressTemp.address2 = $scope.bookingRequestArr.deliveryrefaddress2;
                                                                        }
                                                                        $scope.obj.address.town = $scope.bookingRequestArr.deliveryrefaddresstown;
                                                                        $scope.addressTemp.town = $scope.bookingRequestArr.deliveryrefaddresstown;
                                                                        if ($scope.bookingRequestArr.deliveryrefaddresscounty) {
                                                                            $scope.obj.address.county = $scope.bookingRequestArr.deliveryrefaddresscounty;
                                                                            $scope.addressTemp.county = $scope.bookingRequestArr.deliveryrefaddresscounty;
                                                                        }
                                                                        $scope.obj.address.postcode = $scope.bookingRequestArr.postcode;
                                                                        $scope.addressTemp.postcode = $scope.bookingRequestArr.postcode;
                                                                        if ($scope.bookingRequestArr.deliveryrefcompany) {
                                                                            $scope.obj.address.company = $scope.bookingRequestArr.deliveryrefcompany;
                                                                            $scope.addressTemp.company = $scope.bookingRequestArr.deliveryrefcompany;
                                                                        }
                                                                        $scope.obj.otherInstructions = $scope.bookingRequestArr.deliveryrefotherinst;
                                                                    }
                                                                    $scope.obj.deliveryReferenceName = $scope.bookingRequestArr.deliveryrefname;
                                                                    $scope.collectionreferences = $scope.bookingRequestArr.collectionreferences;
                                                                    if ($scope.collectionreferences != null
                                                                            && $scope.collectionreferences.length > 0)
                                                                    {
                                                                        for (var i = 0; i < $scope.collectionreferences.length; i++)
                                                                        {

                                                                            $scope.items
                                                                                    .push(angular
                                                                                            .fromJson($scope.collectionreferences[i]));
                                                                            console.log($scope.items);
                                                                        }

                                                                    }
                                                                    else
                                                                    {
                                                                        $scope.addItem(0);
                                                                    }

                                                                    if ($rootScope.loggedUser != null)
                                                                    {
                                                                        $scope.getUserPhone();
                                                                    }

                                                                    $scope.getLocation();
                                                                    if ($scope.bookingRequestArr.timeslotId != null)
                                                                    {
                                                                        restservice
                                                                                .get(
                                                                                        envconfig
                                                                                        .get('host')
                                                                                        + "/timeslots/"
                                                                                        + $routeParams.uuid
                                                                                        + "/"
                                                                                        + $scope.bookingRequestArr.timeslotId,
                                                                                        '',
                                                                                        function (data,
                                                                                                status)
                                                                                        {

                                                                                            $scope.bookingrequesttimeslot = data;
                                                                                        },
                                                                                        function (data,
                                                                                                status)
                                                                                        {
                                                                                            console
                                                                                                    .log('Error while fetching bookingrequesttimeslot  for UUID'
                                                                                                            + $routeParams.uuid);
                                                                                        });
                                                                    }
                                                                },
                                                                function (data, status)
                                                                {

                                                                    console
                                                                            .log('Error while fetching booking request for UUID'
                                                                                    + $routeParams.uuid);
                                                                });
                                            };
                                            $scope.getStoreTime = function (packagedate)
                                            {

                                                var day = $filter('date')(new Date(packagedate), 'EEE');
                                                // var day = new
                                                // Date('2015-01-07');
                                                var openTime = "";
                                                var closeTime = "";
                                                if (day == 'Mon')
                                                {
                                                    openTime = "mondayBranchStoreOpenTime";
                                                    closeTime = "mondayBranchStoreClosingTime"
                                                }
                                                else if (day == 'Tue')
                                                {
                                                    openTime = "tuesdayBranchStoreOpenTime";
                                                    closeTime = "tuesdayBranchStoreClosingTime"
                                                }
                                                else if (day == 'Wed')
                                                {
                                                    openTime = "wednesdayBranchStoreOpenTime";
                                                    closeTime = "wednesdayBranchStoreClosingTime"
                                                }
                                                else if (day == 'Thu')
                                                {
                                                    openTime = "thursdayBranchStoreOpenTime";
                                                    closeTime = "thursdayBranchStoreClosingTime"
                                                }
                                                else if (day == 'Fri')
                                                {
                                                    openTime = "fridayBranchStoreOpenTime";
                                                    closeTime = "fridayBranchStoreClosingTime"
                                                }
                                                else if (day == 'Sat')
                                                {
                                                    openTime = "saturdayBranchStoreOpenTime";
                                                    closeTime = "saturdayBranchStoreClosingTime"
                                                }
                                                else if (day == 'Sun')
                                                {
                                                    openTime = "sundayBranchStoreOpenTime";
                                                    closeTime = "sundayBranchStoreClosingTime"
                                                }
                                                $scope.storetime.opentime = openTime;
                                                $scope.storetime.closetime = closeTime;
                                            };
                                            $scope.getUserPhone = function ()
                                            {


                                                // var userProfileUrl =
                                                // envconfig.get('host') +
                                                // "/getUserProfile?userName="
                                                // +
                                                // $rootScope.loggedUser;//
                                                // Original
                                                // restservice.get(envconfig.get('host')
                                                // +
                                                // "/getUserProfile?userName="
                                                // + $rootScope.loggedUser,
                                                // '', function (data,
                                                // status)
                                                var userProfileUrl = envconfig.get('host') + "/user-profile";

                                                restservice.get(userProfileUrl, '', function (data,
                                                        status)
                                                {

                                                    $scope.userProfile = data;
                                                    $scope.obj.phoneNumber = data.telephoneNumber;
                                                }, function (data, status)
                                                {
                                                    // failure
                                                    $scope.getFailed = true;
                                                    $timeout(function ()
                                                    {
                                                        $scope.getFailed = false;
                                                    }, 3000);
                                                });
                                            };
                                            $scope.updateUserPhone = function ()
                                            {

                                                $scope.userProfile.telephoneNumber = $scope.obj.phoneNumber;
                                                restservice.put(envconfig.get('host')
                                                        + "/updateUserProfile", '', function (data,
                                                                status)
                                                        {
                                                            $scope.updateSuccess = true;
                                                            $timeout(function ()
                                                            {
                                                                $scope.updateSuccess = false;
                                                            }, 3000);
                                                        }, function (data, status)
                                                {
                                                    $scope.updateFailed = true;
                                                    $timeout(function ()
                                                    {
                                                        $scope.updateFailed = false;
                                                    }, 3000);
                                                }, $scope.userProfile);
                                            };
                                            $scope.bookOrder = function ()
                                            {

                                                $scope.book.uuid = $routeParams.uuid;
                                                $scope.book.phonenumber = $scope.obj.phoneNumber;
                                                restservice.post(envconfig.get('host')
                                                        + "/bookings/order", '', function (data, status)
                                                        {
                                                            $location.path($routeParams.uuid
                                                                    + '/payment-success');
                                                        }, function (data, status)
                                                {
                                                    $location.path($routeParams.uuid
                                                            + '/payment-success');
                                                }, $scope.book);
                                            };
                                            $scope.getQuotePaymentPage = function ()
                                            {
                                                if (!$scope.isVoucherValid)
                                                {

// restservice
// .get(
// envconfig.get('host')
// + encodeURI("/getquotepayment?uuid="
// + $routeParams.uuid
// + "&userName="
// + $rootScope.loggedUser),
// '',
// function (data, status)

                                                    var getQuotePaymentUrl = envconfig.get('host') + "/quote-payment/" + $routeParams.uuid;

                                                    restservice.get(getQuotePaymentUrl, '', function (data,
                                                            status)
                                                    {
                                                        /*
                                                         * $scope.merchantId =
                                                         * data.merchantId;
                                                         * $scope.orderId =
                                                         * data.orderId;
                                                         * $scope.subaccount =
                                                         * data.subaccount;
                                                         * $scope.amount =
                                                         * data.amount;
                                                         * $scope.currency =
                                                         * data.currency;
                                                         * $scope.timestamp =
                                                         * data.timestamp;
                                                         * $scope.sha1hash =
                                                         * data.sha1hash;
                                                         * $scope.MERCHANT_RESPONSE_URL =
                                                         * data.MERCHANT_RESPONSE_URL;
                                                         * $scope.COMMENT1 =
                                                         * data.COMMENT1;
                                                         * $scope.COMMENT2 =
                                                         * data.COMMENT2;
                                                         * $scope.WORKFLOW =
                                                         * data.WORKFLOW;
                                                         * $scope.PROD_ID =
                                                         * data.PROD_ID;
                                                         * $scope.USER =
                                                         * data.USER;
                                                         * $scope.UUID =
                                                         * data.UUID;
                                                         * $scope.$apply();
                                                         * document.getElementById("getquotepaymentform").submit();
                                                         */

                                                        var createform = document
                                                                .createElement('form');
                                                        createform
                                                                .setAttribute("action",
                                                                        envconfig.get('payment'));
                                                        createform.setAttribute("method",
                                                                "post");
                                                        createform.setAttribute("name",
                                                                "abcde");
                                                        createform.setAttribute("id",
                                                                "myForm");
                                                        var inputelement = document
                                                                .createElement('input');
                                                        inputelement.setAttribute("type",
                                                                "hidden");
                                                        inputelement.setAttribute("name",
                                                                "MERCHANT_ID");
                                                        inputelement.setAttribute("value",
                                                                data.merchantId);
                                                        createform
                                                                .appendChild(inputelement);
                                                        var inputelement1 = document
                                                                .createElement('input');
                                                        inputelement1.setAttribute("type",
                                                                "hidden");
                                                        inputelement1.setAttribute("name",
                                                                "ORDER_ID");
                                                        inputelement1.setAttribute("value",
                                                                data.orderId);
                                                        createform
                                                                .appendChild(inputelement1);
                                                        var inputelement2 = document
                                                                .createElement('input');
                                                        inputelement2.setAttribute("type",
                                                                "hidden");
                                                        inputelement2.setAttribute("name",
                                                                "ACCOUNT");
                                                        inputelement2.setAttribute("value",
                                                                data.subaccount);
                                                        createform
                                                                .appendChild(inputelement2);
                                                        var inputelement3 = document
                                                                .createElement('input');
                                                        inputelement3.setAttribute("type",
                                                                "hidden");
                                                        inputelement3.setAttribute("name",
                                                                "AMOUNT");
                                                        inputelement3.setAttribute("value",
                                                                data.amount);
                                                        createform
                                                                .appendChild(inputelement3);
                                                        var inputelement4 = document
                                                                .createElement('input');
                                                        inputelement4.setAttribute("type",
                                                                "hidden");
                                                        inputelement4.setAttribute("name",
                                                                "CURRENCY");
                                                        inputelement4.setAttribute("value",
                                                                data.currency);
                                                        createform
                                                                .appendChild(inputelement4);
                                                        var inputelement5 = document
                                                                .createElement('input');
                                                        inputelement5.setAttribute("type",
                                                                "hidden");
                                                        inputelement5.setAttribute("name",
                                                                "TIMESTAMP");
                                                        inputelement5.setAttribute("value",
                                                                data.timestamp);
                                                        createform
                                                                .appendChild(inputelement5);
                                                        var inputelement6 = document
                                                                .createElement('input');
                                                        inputelement6.setAttribute("type",
                                                                "hidden");
                                                        inputelement6.setAttribute("name",
                                                                "SHA1HASH");
                                                        inputelement6.setAttribute("value",
                                                                data.sha1hash);
                                                        createform
                                                                .appendChild(inputelement6);
                                                        var inputelement7 = document
                                                                .createElement('input');
                                                        inputelement7.setAttribute("type",
                                                                "hidden");
                                                        inputelement7.setAttribute("name",
                                                                "MERCHANT_RESPONSE_URL");
                                                        inputelement7.setAttribute("value",
                                                                data.MERCHANT_RESPONSE_URL);
                                                        createform
                                                                .appendChild(inputelement7);
                                                        var inputelement8 = document
                                                                .createElement('input');
                                                        inputelement8.setAttribute("type",
                                                                "hidden");
                                                        inputelement8.setAttribute("name",
                                                                "COMMENT1");
                                                        inputelement8.setAttribute("value",
                                                                data.COMMENT1);
                                                        createform
                                                                .appendChild(inputelement8);
                                                        var inputelement9 = document
                                                                .createElement('input');
                                                        inputelement9.setAttribute("type",
                                                                "hidden");
                                                        inputelement9.setAttribute("name",
                                                                "COMMENT2");
                                                        inputelement9.setAttribute("value",
                                                                data.COMMENT2);
                                                        createform
                                                                .appendChild(inputelement9);
                                                        var inputelement10 = document
                                                                .createElement('input');
                                                        inputelement10.setAttribute("type",
                                                                "hidden");
                                                        inputelement10.setAttribute("name",
                                                                "WORKFLOW");
                                                        inputelement10.setAttribute(
                                                                "value", data.WORKFLOW);
                                                        createform
                                                                .appendChild(inputelement10);
                                                        var inputelement11 = document
                                                                .createElement('input');
                                                        inputelement11.setAttribute("type",
                                                                "hidden");
                                                        inputelement11.setAttribute("name",
                                                                "PROD_ID");
                                                        inputelement11.setAttribute(
                                                                "value", data.PROD_ID);
                                                        createform
                                                                .appendChild(inputelement11);
                                                        var inputelement12 = document
                                                                .createElement('input');
                                                        inputelement12.setAttribute("type",
                                                                "hidden");
                                                        inputelement12.setAttribute("name",
                                                                "USER");
                                                        inputelement12.setAttribute(
                                                                "value", data.USER);
                                                        createform
                                                                .appendChild(inputelement12);
                                                        var inputelement13 = document
                                                                .createElement('input');
                                                        inputelement13.setAttribute("type",
                                                                "hidden");
                                                        inputelement13.setAttribute("name",
                                                                "UUID");
                                                        inputelement13.setAttribute(
                                                                "value", data.UUID);
                                                        createform
                                                                .appendChild(inputelement13);
                                                        var inputelement14 = document
                                                                .createElement('input');
                                                        inputelement14.setAttribute("type",
                                                                "hidden");
                                                        inputelement14.setAttribute("name",
                                                                "BOOKINGTYPE");
                                                        inputelement14.setAttribute(
                                                                "value", data.BOOKINGTYPE);
                                                        createform
                                                                .appendChild(inputelement14);


                                                        var inputelement15 = document
                                                                .createElement('input');
                                                        inputelement15.setAttribute("type",
                                                                "hidden");
                                                        inputelement15.setAttribute("name",
                                                                "SUCCESSURL");
                                                        inputelement15.setAttribute(
                                                                "value", data.SUCCESSURL);
                                                        createform
                                                                .appendChild(inputelement15);

                                                        var inputelement16 = document
                                                                .createElement('input');
                                                        inputelement16.setAttribute("type",
                                                                "hidden");
                                                        inputelement16.setAttribute("name",
                                                                "FAILUREURL");
                                                        inputelement16.setAttribute(
                                                                "value", data.FAILUREURL);
                                                        createform
                                                                .appendChild(inputelement16);


                                                        var inputelement17 = document.createElement('input');
                                                        inputelement17.setAttribute("type", "hidden");
                                                        inputelement17.setAttribute("name", "DISPLAYNAME");
                                                        inputelement17.setAttribute("value", "Single delivery");
                                                        createform.appendChild(inputelement17);

                                                        var inputelement18 = document.createElement('input');
                                                        inputelement18.setAttribute("type", "hidden");
                                                        inputelement18.setAttribute("name", "AUTO_SETTLE_FLAG");
                                                        inputelement18.setAttribute("value", "1");
                                                        createform.appendChild(inputelement18);

                                                        // console.log(createform);
                                                        document.body
                                                                .appendChild(createform);
                                                        document.getElementById("myForm").style.visibility = "none";
                                                        createform.submit();
                                                    }, function (data, status)
                                                    {
                                                        if (status == 401)
                                                        {
                                                            $location.path("/register");
                                                        }
                                                        else
                                                        {
                                                            // alert("internal
                                                            // server
                                                            // error");
                                                        }
                                                    });
                                                } else {
                                                    var quotebook =
                                                            {
                                                                uuid: ''

                                                            };
                                                    quotebook.uuid = $routeParams.uuid;
                                                    // $scope.book.phonenumber =
                                                    // $scope.obj.phoneNumber;

                                                    restservice.post(envconfig.get('host')
                                                            + "/quoteorder", '', function (data, status)
                                                            {
                                                                $location.path($routeParams.uuid
                                                                        + '/payment-success');
                                                            }, function (data, status)
                                                    {
                                                        $location.path($routeParams.uuid
                                                                + '/payment-success');
                                                    }, quotebook);
                                                }
                                            };
                                            $scope.getSubscriptions = function ()
                                            {
                                                // restservice.get("http://ec2-54-154-77-230.eu-west-1.compute.amazonaws.com/MyDeliveryPortal/subscription/mysubscrition/"+user,
                                                restservice
                                                        .get(
                                                                envconfig.get('host')
                                                                + "/subscription/mysubscription"
                                                                // +
                                                                // $rootScope.loggedUser
                                                                ,
                                                                // restservice.get("http://localhost/MyDeliveryPortal/subscription/mysubscrition/"+user,
                                                                '',
                                                                function (data, status)
                                                                {
                                                                    $scope.res = data;
                                                                    if (data.userSubscriptions)
                                                                    {
                                                                        $scope.validSubscription = data.userSubscriptions.isValidSubscription;
                                                                    }
                                                                    else
                                                                    {
                                                                        $scope.validSubscription = false;
                                                                    }
                                                                }, function (data, status)
                                                        {
                                                        });
                                            };
                                            $scope.getBookingRequest();
                                            $scope.getSubscriptions();
                                            $scope.getLocation = function ()
                                            {
                                                var geocoder = new google.maps.Geocoder();
                                                var retailerPostCode = $scope.bookingRequestArr.retailerpostalcode
                                                geocoder
                                                        .geocode(
                                                                {
                                                                    'address': $scope.bookingRequestArr.postcode
                                                                },
                                                        function (results, status)
                                                        {
                                                            if (status == google.maps.GeocoderStatus.OK)
                                                            {
                                                                var location = results[0].geometry.location, mapOptions =
                                                                        {
                                                                            center: location,
                                                                            zoom: 11,
                                                                            mapTypeId: google.maps.MapTypeId.ROADMAP
                                                                        }, map = new google.maps.Map(
                                                                        document
                                                                        .getElementById("map-container"),
                                                                        mapOptions), marker = new google.maps.Marker(
                                                                        {
                                                                            map: map,
                                                                            position: results[0].geometry.location,
                                                                            icon:
                                                                                    {
                                                                                        // path: google.maps.SymbolPath.CIRCLE,
                                                                                        // scale: 5,
                                                                                        // fillColor: '#43B02A',
                                                                                        // fillOpacity: 1.0,
                                                                                        // strokeColor: '#43B02A',
                                                                                        // strokeOpacity: 1.0
                                                                                        url: "images/delivery_postcode_pin_start.png" // url
                                                                                    }
                                                                        }), circle = new google.maps.Circle(
                                                                        {
                                                                            center: results[0].geometry.location,
                                                                            radius: 8047,
                                                                            map: map,
                                                                            fillColor: '#43B02A',
                                                                            fillOpacity: 0.5,
                                                                            strokeColor: '#43B02A',
                                                                            strokeOpacity: 0.4
                                                                        });
                                                                latLong = location;
                                                                geocoder
                                                                        .geocode(
                                                                                {
                                                                                    'address': $scope.bookingRequestArr.retailerpostalcode
                                                                                },
                                                                        function (
                                                                                results,
                                                                                status)
                                                                        {
                                                                            if (status == google.maps.GeocoderStatus.OK)
                                                                            {
                                                                                // Place
                                                                                // the
                                                                                // marker
                                                                                var marker = new google.maps.Marker(
                                                                                        {
                                                                                            map: map,
                                                                                            position: results[0].geometry.location,
                                                                                            icon:
                                                                                                    {
                                                                                                        // path: google.maps.SymbolPath.CIRCLE,
                                                                                                        // scale: 4,
                                                                                                        // fillColor: '#43B02A',
                                                                                                        // fillOpacity: 1.0,
                                                                                                        // strokeColor: '#43B02A',
                                                                                                        // strokeOpacity: 1.0
                                                                                                        url: "images/delivery_postcode_pin_dest.png" // url
                                                                                                    }
                                                                                        });
                                                                            }
                                                                            else
                                                                            {
                                                                                alert("plot retailer is not successfull : "
                                                                                        + status);
                                                                            }
                                                                        });

                                                                $scope.reFocus = function () {
                                                                    if (latLong)
                                                                    {
                                                                        map.setCenter(latLong);
                                                                    }
                                                                };



                                                            }
                                                        })
                                            };

                                            google.maps.event.addDomListener(window, "resize", function () {
                                                $scope.reFocus();
                                            });

                                            $scope.userVoucherStatus = function () {

                                                if ($scope.bookingRequestArr.zone != "within")
                                                {
                                                    $scope.isVoucherUsed = true;
                                                } else {
                                                    restservice.get(
                                                            envconfig.get('host') + "/vouchers/uservoucherstatus", '',
                                                            function (data, status) {
                                                                if (data.isvoucherused == "true") {
                                                                    $scope.isVoucherUsed = true;
                                                                }


                                                                // $scope.isVoucherUsed
                                                                // =
                                                                // data.isVoucherUsed;

                                                            }, function (data, status) {
                                                        console.log('Error while user voucher status');
                                                        $scope.isVoucherUsed = true;
                                                    });
                                                }

                                            };
                                            // $scope.userVoucherStatus();

                                            $scope.isVoucherValid = false;
                                            $scope.voucherMsg = "";
                                            $scope.voucherRedeem = function () {
                                                $scope.isVoucherValid = false;
                                                // $scope.voucherMsg = "Invalid
                                                // Voucher Code";
                                                // var vouCode =
                                                // $scope.voucherCode;
                                                var vouCode = $scope.voucher.code;
                                                // var isValid = false;
                                                restservice.get(
                                                        envconfig.get('host') + "/vouchers/" + vouCode, '',
                                                        function (data, status) {
                                                            // isValid =
                                                            // data.isValid;
                                                            if (data.valid) {
                                                                var formData = '{"uuid":"' + $routeParams.uuid + '","vouchercode":"' + vouCode + '"}';
                                                                restservice.post(envconfig.get('host') + "/vouchers/uservoucher", '',
                                                                        function (data1, status) {
                                                                            $scope.isVoucherValid = data.valid;
                                                                        }, function (data1, status1) {
                                                                    if (status1 == 401) {
                                                                        $location.path("/register");
                                                                    } else {
                                                                        alert("internal server error");
                                                                    }
                                                                }, formData);
                                                            } else {
                                                                $scope.voucherMsg = "Oops! This promo code is invalid or has expired. Sorry!";
                                                            }
                                                        }, function (data, status) {
                                                    console.log('Error while user voucher status');
                                                    $scope.voucherMsg = "Oops! This promo code is invalid or has expired. Sorry!";
                                                });
                                            };

                                            $scope.voucherCancel = function () {
                                                var vouchercancel =
                                                        {
                                                            uuid: '',
                                                            vouchercode: ''

                                                        };
                                                vouchercancel.uuid = $routeParams.uuid;
                                                vouchercancel.vouchercode = $scope.voucher.code;
                                                // $scope.book.phonenumber =
                                                // $scope.obj.phoneNumber;

                                                restservice.delete(envconfig.get('host')
                                                        + "/vouchers/uservoucher", '', function (data, status)
                                                        {
                                                            $scope.isVoucherValid = false;
//                                                            $scope.voucherMsg = "Voucher code cancelled";
                                                            $scope.voucher.code = '';
                                                        }, function (data, status)
                                                {
                                                    $scope.voucherMsg = "Some problem while cancelling voucher";
                                                }, vouchercancel);

                                            };


                                            $scope.enterAddress = function () {
                                                $scope.obj.selected = true;
                                                $timeout(function () {
                                                    $('input#company').focus();
                                                }, 2, false);
                                            };




                                            $scope.recCheck = function (recieptNo, index) {
                                                $scope.iSvalueR = true;

                                                if (index != 0) {
//                                                    alert(index)
                                                    for (var i = 0; i < $scope.items.length; i++) {
                                                        if ($scope.items[i].recieptNo == recieptNo && i != index) {
//                                                            alert('This Reciept no already used');
                                                            $scope.Rindex = index;
                                                            $scope.items[index].recieptNo = "";
                                                            $scope.recieptNoUnique = true;
                                                            $scope.iSvalueR = false;
                                                            break;
                                                        }
                                                        else
                                                        {
                                                            $scope.recieptNoUnique = false;
                                                        }
                                                    }

                                                }
                                                else {
                                                    $scope.iSvalueR = true;
                                                    for (var i = 0; i < $scope.items.length; i++) {
                                                        if ($scope.items[i].recieptNo == recieptNo && i != index) {
//                                                            alert('This Reciept no already used');
                                                            $scope.Rindex = index;
                                                            $scope.items[index].recieptNo = "";
                                                            $scope.recieptNoUnique = true;
                                                            $scope.iSvalueR = false;
                                                            break;
                                                        }
                                                        else
                                                        {
                                                            $scope.recieptNoUnique = false;
                                                        }
                                                    }

                                                }
                                            };
                                        });
