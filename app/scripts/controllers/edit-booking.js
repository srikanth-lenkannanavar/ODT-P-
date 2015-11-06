angular
        .module('app')
        .controller(
                'EditBookingCtrl',
                function ($scope, $upload, $rootScope, $location, envconfig,
                        $modal, restservice, modalservice, $http, $routeParams,
                        $filter, AddressConfirmationService, $timeout,
                        geocodeservice, colrefdocservice, CommonService)
                {

                    $scope.valueCheckBoxAc = false;
                    $scope.valueCheckBoxTc = false;
                    $scope.isEditCollection = false;
                    $scope.retailerType = "";
                    $scope.retailerstoreopentime = "";
                    $scope.retailerstoreclosetime = "";

                    $scope.iSvalueR = true;
                    $scope.recieptNoUnique = false;

                    $scope.oneAtATime1 = false;
                    $scope.status =
                            {
                                isFirstOpen: true,
                                isSecondOpen: true,
                                isFirstDisabled: true,
                                isSecondDisabled: true
                            };
							
					$scope.dsRadio =
							{
								res: ""
							};

                    $scope.editBookingFailed = false;
                    $scope.timeslotsArr = {};
                    $scope.isOpen = false;
                    $scope.isOpen2 = false;
                    $scope.popupOptions = {};
                    $scope.userProfile = {};
                    $scope.bookingTableData = {};
                    $scope.sevenDays = true;

                    $scope.oneAtATime = false;
                    $scope.bookingRequestArr = {};
                    $scope.bookingrequesttimeslot = {};
                    $scope.selected = undefined;
                    $scope.packageCollectiondate = '';
                    $scope.packagecollectionreadyfrom = '';
                    $scope.saveDeliveryDate = '';
                    $scope.deliverydate = '';
                    $scope.isTimeslot = true;
                    $scope.showMorelimit = 20;
                    $scope.collectionreferences = {};
                    $scope.collectiondateFlag = false
                    $scope.itemsArray = [];
                    $scope.storetime =
                            {
                                opentime: null,
                                closetime: null
                            };
                    $scope.isCalendarChanged = false;
                    // $scope.deliverydate = currDate + "/" + currMonth + "/" +
                    // currYear;
                    // =getDate();
                    $scope.objects =
                            {
                                phoneNumber: null,
                                address:
                                        {
                                            address1: null,
                                            address2: null,
                                            town: null,
                                            county: null

                                        },
                                deliveryReferenceName: null
                            }

                    $scope.status =
                            {
                                isFirstOpen: true,
                                isSecondOpen: true,
                                isFirstDisabled: true,
                                isSecondDisabled: true
                            };

                    var dp1 = $('#datetimepicker1');
                    dp1.datetimepicker(
                            {
                                pickTime: false,
                                format: 'DD-MM-YYYY',
                                minDate: moment().format('DD-MM-YYYY'),
                                maxDate: moment().add(7, 'days').format('DD-MM-YYYY')

                            });






                    $scope.getBookingRequest = function (uuid)
                    {

//                        var url = "scripts/json/add.json";
//                        restservice
//                                .get(url,
                        restservice
                                .get(
                                        envconfig.get('host')
                                        + "/bookings/bookingrequest/"
                                        + $routeParams.uuid,
                                        '',
                                        function (data, status)
                                        {

                                            // updating the Amend history table
                                            // to store the previous booking
                                            // balue
                                            restservice
                                                    .post(
                                                            envconfig
                                                            .get('host')
                                                            + "/amendBkRequest/save",
                                                            '',
                                                            function (amendData,
                                                                    status)
                                                            {
                                                                console
                                                                        .log('Updated Amend Booking History table for uuid '
                                                                                + $routeParams.uuid);

                                                            },
                                                            function (amendData,
                                                                    status)
                                                            {

                                                                console
                                                                        .log('Error while updating Amend Booking History table for uuid '
                                                                                + $routeParams.uuid);
                                                            }, data);

                                            $scope.bookingRequestArr = data;
                                            $scope.retailerstoreopentime = $scope.bookingRequestArr.retailerstoreopentime;
                                            $scope.retailerstoreclosetime = $scope.bookingRequestArr.retailerstoreclosetime;
                                            $scope.packagecollectionreadyfrom = $scope.bookingRequestArr.packagecollectionreadyfrom;
                                            $scope.getStoreTime($scope.bookingRequestArr.packagecollectionreadydate);
                                            $scope.packageCollectiondate = $filter('date')(new Date($scope.bookingRequestArr.packagecollectionreadydate), 'yyyy-MM-dd');
                                            $scope.saveDeliveryDate = $filter('date')(new Date($scope.bookingRequestArr.deliveryDate), 'yyyy-MM-dd');
                                            $scope.deliverydate = $filter(
                                                    'date')
                                                    (
                                                            new Date(
                                                                    $scope.bookingRequestArr.deliveryDate),
                                                            'dd-MM-yyyy');
                                            $scope.packageDate = $filter('date')
                                                    (
                                                            new Date(
                                                                    $scope.bookingRequestArr.packagecollectionreadydate),
                                                            'dd-MM-yyyy');
                                            $scope.retailerType = $scope.bookingRequestArr.retailertype;
                                            // call with the page loads to get
                                            // time slot
                                            // $scope.timeslots();

                                            $scope.objects.address.address1 = $scope.bookingRequestArr.deliveryrefaddress1;
                                            $scope.objects.address.address2 = $scope.bookingRequestArr.deliveryrefaddress2;
                                            $scope.objects.address.town = $scope.bookingRequestArr.deliveryrefaddresstown;
                                            $scope.objects.address.county = $scope.bookingRequestArr.deliveryrefaddresscounty;
                                            $scope.objects.address.company = $scope.bookingRequestArr.deliveryrefcompany;
                                            $scope.objects.address.otherInstructions = $scope.bookingRequestArr.deliveryrefotherinst;

                                            // $scope.objects.editAddr =
                                            // $scope.objects.address.address1 +
                                            // " " +
                                            // $scope.objects.address.address2 +
                                            // " " + $scope.objects.address.town
                                            // + " " +
                                            // $scope.objects.address.county;

                                            $scope.objects.deliveryReferenceName = $scope.bookingRequestArr.deliveryrefname;
                                            $scope.objects.phoneNumber = $scope.bookingRequestArr.deliveryrefphoneno;
                                            $scope.collectionreferences = $scope.bookingRequestArr.collectionreferences;

                                            $scope.timeslots();
                                            if ($scope.deliverydate == '')
                                            {
                                                fmtdeliverydate = $filter('date')(new Date(),
                                                        'yyyy-MM-dd');
                                            }
                                            else
                                            {

                                                fmtdeliverydate = $scope.saveDeliveryDate;
                                            }

                                            var delDate = moment(fmtdeliverydate);
                                            var now = moment();
                                            if ((now > delDate) || (now.format('YYYY-MM-DD') == fmtdeliverydate)) {
                                                //$scope.quoteDate = fmtdeliverydate;
                                                $scope.isPrevArw = false;

                                            } else {
                                                //$scope.quoteDate = "today";
                                                $scope.isPrevArw = true;

                                            }
                                            /*
                                             if ($scope.today != fmtDelData) {
                                             $scope.quoteDate = fmtDelData;
                                             $scope.isPrevArw = true;
                                             } else {
                                             $scope.quoteDate = "today";
                                             $scope.isPrevArw = false;
                                             }
                                             */

                                            if ($scope.collectionreferences != null
                                                    && $scope.collectionreferences.length > 0)
                                            {
                                                for (var i = 0; i < $scope.collectionreferences.length; i++)
                                                {
                                                    $scope.itemsArray.push(angular.fromJson($scope.collectionreferences[i]));
                                                }
                                            }
                                        }, function (data, status)
                                {

                                    // console.log('Error while fetching
                                    // booking request for UUID' +
                                    // $rootScope.editBooking.uuid);
                                });
//                        $scope.isEditCollection = false;
                    };

                    $scope.getBookingRequest($routeParams.uuid);

                    $scope.getStoreTime = function (packagedate)
                    {

                        var day = $filter('date')(new Date(packagedate), 'EEE');
                        // var day = new Date('2015-01-07');
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


                    //open the modal when the user chooses "later"
                    $scope.later = function () {


                        modalservice.show('lg', 'views/template/modal/editbooking-later.html', 'ModalCtrl', $scope, 'medium-dialog', 'medium-dialog');

                    };



                    dp1.off("dp.change").on("dp.change", function (e) {
                        $scope.sevenDays = CommonService.getDayDifFromToday(e.date.format('MM/DD/YYYY'), 7);
                        $scope.deliverydate = e.date.format('DD-MM-YYYY');
                        $scope.saveDeliveryDate = e.date.format('YYYY-MM-DD');
                        $scope.shopdeliverydate = e.date.format('ddd');
                        $scope.isCalendarChanged = true;
                        if (!$scope.collectiondateFlag) {
                            if ($scope.retailerType == "Manual") {
                                if ($scope.retailerstoreclosetime == "")
                                    $scope.retailerstoreclosetime = "18:30";
                                if ($scope.retailerstoreopentime == "")
                                    $scope.retailerstoreopentime == "09:30";
                                modalservice.show('lg', 'views/template/modal/edit-retailer-modal.html', 'ModalCtrl', $scope, 'medium-dialog');
                            } else
                                $scope.timeslots();
                        } else {
                            $scope.timeslots();
                            $scope.collectiondateFlag = false;
                        }


                    });

                    $scope.timeslotCall = function (wen) {
                        $scope.$watch(function () {
                            $scope.isTimeslot = false;
                        });

                        if (!$scope.isCalendarChanged) {
                            var delDate = moment($scope.bookingRequestArr.deliveryDate)
                            var now = moment();
                            if (now > delDate && (now.format('YYYY-MM-DD') != delDate.format('YYYY-MM-DD'))) {
                                // date is past
                                console.log("date is past");
                                //$scope.isPrevArw = false;
                                var dsDate = now.subtract(1, 'days');
                            } else {
                                console.log("future");
                                //$scope.isPrevArw = true;
                                var dsDate = $('#datetimepicker1').data("DateTimePicker").getDate();
                            }
                        } else {
                            var dsDate = $('#datetimepicker1').data("DateTimePicker").getDate();
                        }



                        //console.log($scope.packageCollectiondate);
                        if ($scope.packageCollectiondate <= dsDate.format('YYYY-MM-DD') && wen != "next") {
                            if (dsDate.format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD'))
                                return false;
                        }

                        /*
                         if ($scope.deliverydate <= $scope.packageCollectiondate)
                         {
                         var changeDsDate = (wen == "next") ? dsDate.add(1, 'days') : dsDate.subtract(1, 'days');
                         }
                         else
                         {
                         var changeDsDate = (wen == "next") ? dsDate.add(0, 'days') : dsDate.subtract(1, 'days');
                         }
                         */


                        var changeDsDate = (wen == "next") ? dsDate.add(1, 'days') : dsDate.subtract(1, 'days');

                        var changeddate = moment(changeDsDate.format('MM/DD/YYYY'));
                        var currentDate = moment(moment().format('MM/DD/YYYY'));
                        var days = moment.duration(changeddate.diff(currentDate)).asDays();
                        /*
                         if (days >= 7) {
                         $scope.sevenDays = false;
                         }

                         else
                         {
                         $scope.sevenDays = true;
                         }
                         */
                        $('#datetimepicker1').data("DateTimePicker").setDate(changeDsDate);
                        $scope.deliverydate = dsDate.format('DD-MM-YYYY');
                        $scope.saveDeliveryDate = dsDate.format('YYYY-MM-DD');
                        $scope.timeslots();
                    }

                    $scope.timeslots = function ()
                    {
                        $scope.isTimeslot = true;
                        var fmtpackageCollectionDate = '', fmtdeliverydate = '';
                        if ($scope.packageDate == '')
                        {
                            fmtpackageCollectionDate = $filter('date')(
                                    new Date(), 'yyyy-MM-dd');
                        }
                        else
                        {
                            fmtpackageCollectionDate = $scope.packageCollectiondate;
                        }
                        if ($scope.deliverydate == '')
                        {
                            fmtdeliverydate = $filter('date')(new Date(),
                                    'yyyy-MM-dd');
                        }
                        else
                        {

                            fmtdeliverydate = $scope.saveDeliveryDate;
                        }

                        var fmtDelData = moment(fmtdeliverydate).format('DD-MM-YYYY');
                        $scope.today = moment().format('DD-MM-YYYY');
                        if ($scope.today != fmtDelData) {
                            //$scope.quoteDate = fmtDelData;
                            $scope.isPrevArw = true;
                        } else {
                            //$scope.quoteDate = "today";
                            $scope.isPrevArw = false;
                        }

                        // alert($scope.request.packagecollectionreadydate + "
                        // test "+$scope.request.packagedeliveryDate);

//                        var url1 = "scripts/json/timeslots.json";
//                        restservice
//                                .get(url1,
                        restservice
                                .get(
                                        envconfig.get('host') + "/timeslots/"
                                        + $routeParams.uuid
                                        + "/"
                                        + fmtpackageCollectionDate
                                        + "/" + fmtdeliverydate,
                                        '',
                                        function (data, status)
                                        {
                                            $scope.timeslotsArr = data;
                                            $scope.dsErorrFlag = ($scope.timeslotsArr.length > 0) ? false
                                                    : true;

                                            if (!$scope.dsErorrFlag)
                                            {
                                                for (var i = 0; i < $scope.timeslotsArr.length; i++) {
                                                    if ($scope.bookingRequestArr.timeslotstart == $scope.timeslotsArr[i].starttime)
                                                    {
                                                        $scope.dsRadio =
                                                                {
                                                                    res: $scope.timeslotsArr[i].id
                                                                };
                                                    }
                                                    else {
														
                                                    }
                                                }
                                            }
                                            $scope.showNoTimeslotsFlag = false;
                                            $scope.showMoreFlag = ($scope.timeslotsArr.length > $scope.showMorelimit) ? (($scope.dsErorrFlag) ? false
                                                    : true)
                                                    : false;

                                        }, function (data, status)
                                {
                                    // error message
                                    $scope.timeslotsArr = [];
                                    $scope.showMoreFlag = false;
                                    $scope.showNoTimeslotsFlag = true;
                                });
                    }

                    $scope.deleteItem = function (index)
                    {
                        // MRS: Delete file associated with this collection
                        // reference.
                        $scope.deleteFile(index, false);
//                        if (index > 0)
//                        {
//                            $scope.itemsArray.splice(index, 1);
//                        }
                        $scope.itemsArray.splice(index, 1)
                        if (index === 0)
                        {
                            $scope.isEditCollection = true;
                        }
                        else
                        {
                            $scope.isEditCollection = false;
                        }
                    };

                    $scope.onFileSelect = function ($files, index)
                    {

                        colrefdocservice.uploadDoc($files, index, $scope, restservice,
                                $upload, envconfig, $scope.itemsArray, $routeParams.uuid);
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
                        colrefdocservice.deleteDoc(index, $scope,
                                restservice, envconfig, interactive,
                                $scope.itemsArray, $routeParams.uuid);
                    };

                    $scope.addItem = function (index)
                    {
                        $scope.itemsArray.push(
                                {
                                    id: $scope.itemsArray.length + 1
                                            // title: $scope.newItemName
                                });
                        $scope.isEditCollection = false;

                        // console.log($scope.itemsArray);
                    }

                    $scope.collectionDeliverySave = function (obj, isValid)
                    {
//                        alert("edit")
                        if (!isValid)
                            return;
                        $scope.obj = obj;
                        // console.log("test");
                        // console.log($scope.obj);

                        var collection = [];
                        for (var i = 0; i < $scope.itemsArray.length; i++)
                        {

                            //MRS. Remove transient properties.
                            //delete <property> may be slow. Prefer blanking 'em out
                            //
                            if ("fileUploadErrorMessage" in $scope.itemsArray[i])
                                $scope.itemsArray[i].fileUploadErrorMessage = "";
                            //
                            if ("isWorking" in $scope.itemsArray[i])
                                $scope.itemsArray[i].isWorking = false;

                            //
                            if ("progressMessage" in $scope.itemsArray[i])
                                $scope.itemsArray[i].progressMessage = "";

                            collection.push(angular
                                    .toJson($scope.itemsArray[i]));
                        }

                        var payload =
                                {
                                    uuid: $routeParams.uuid,
                                    collectionreferences: collection
                                }
                        payload.retailername = $scope.bookingRequestArr.retailername;
                        payload.retaileraddressline1 = $scope.bookingRequestArr.retaileraddressline1;
                        payload.packagecollectionreadydate = $scope.packageCollectiondate;
                        payload.deliveryDate = $scope.saveDeliveryDate;


                        if ($scope.obj.deliveryReferenceName != null)
                        {
                            payload.deliveryrefname = $scope.obj.deliveryReferenceName;
                        }
                        if ($scope.obj.address != null)
                        {
                            payload.deliveryrefaddress1 = $scope.obj.address.address1;
                            payload.deliveryrefaddress2 = $scope.obj.address.address2;
                            payload.deliveryrefaddresstown = $scope.obj.address.town;
                            payload.deliveryrefaddresscounty = $scope.obj.address.county;
                            payload.deliveryrefcompany = $scope.obj.address.company;
                            payload.deliveryrefotherinst = $scope.obj.address.otherInstructions;
                        }
                        if ($scope.obj.phoneNumber != null)
                        {
                            payload.deliveryrefphoneno = $scope.obj.phoneNumber;
                        }

                        // store the phone number in user profile if the user
                        // updated it

                        if ($scope.dsRadio!=undefined && $scope.dsRadio.res) {
                            //save time slot
                            payload.timeslotId = $scope.dsRadio.res;




                        }



                        //data to make booking call
                        payload.bookingStatus = $routeParams.status;
                        payload.transactiondate = $routeParams.transdate;
                        payload.username = $rootScope.loggedUser;

                        restservice
                                .post(
                                        envconfig
                                        .get('host')
                                        + "/amendBooking/save",
                                        '',
                                        function (data,
                                                status)
                                        {
                                            if (data.status == "Failed") {
                                                $scope.editBookingFailed = true;

                                            }
                                            else {
                                                $location
                                                        .path('/my-deliveries');
                                            }

                                        }, function (data,
                                        status)
                                {
                                    $scope.editBookingFailed = true;
                                }, payload);

                        /*      restservice
                         .put(
                         envconfig.get('host')
                         + "/bookings/bookingrequest/updateRetailerAdd",
                         '',
                         // "http://localhost/BookingModule/services/bookings",'',
                         // envconfig.get('host')+"/retailer/getretailers",
                         // '',
                         function(data, status)
                         {
                         payload = data;
                         // add extra fields required for
                         // booking
                         payload.accountnumber = $scope.bookingTableData.accountnumber;
                         payload.brjobnumber = $scope.bookingTableData.brjobnumber;
                         payload.username = "ageeshkg@aditi.com";
                         payload.subscriptionservicecode = "WO";
                         payload.createdate = $scope.bookingTableData.createdate;
                         // the user has subscription and
                         // console.log("save it");
                         }, function (data, status)
                         {
                         // failure
                         }, payload);*/



                    };

                    $scope.collectionDeliveryGoBack = function ()
                    {
                        $location.path('/my-deliveries');
                    };


                    $scope.recCheck = function (recieptNo, index) {
                        $scope.iSvalueR = true;
                        if (index != 0) {
                            for (var i = 0; i < $scope.itemsArray.length; i++) {
                                if ($scope.itemsArray[i].recieptNo == recieptNo && i != index) {
                                    $scope.Rindex = index;
                                    $scope.itemsArray[index].recieptNo = "";
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
                            for (var i = 0; i < $scope.itemsArray.length; i++) {
                                if ($scope.itemsArray[i].recieptNo == recieptNo && i != index) {
                                    $scope.Rindex = index;
                                    $scope.itemsArray[index].recieptNo = "";
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
