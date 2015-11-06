'use strict';

/**
* @ngdoc function
* @name app.controller:MainCtrl
* @description # MainCtrl Controller of the app
*/
app.controller('MyProfileCtrl', function($rootScope, $scope, $location,
                                $timeout, $modal, $routeParams, $upload, postcodeService,
                                geocodeservice, restservice, modalservice, envconfig, $window,
                                photourlservice, $cookies, $interval, $route)
{

    $scope.showBrowse = true;
    $scope.profilePreview = false;
    $scope.progress = false;
    $scope.errMesFlag = false;
    $scope.showMes = false;
    $scope.updateSuccess = false;
    $scope.updateFailed = false;
    $scope.getFailed = false;
    $scope.changePasswordSaved = false;
    $scope.changePasswordfailed = false;
    $scope.phoneNoValidatedStatus = true;
    $scope.isPinDisable = true;
    $scope.optNewsLetter = true;
    $scope.title = "";

    $scope.loadImage = function (imageURL)
    {
        // if(!imageURL) return;
        // console.log(imageURL);
        $scope.progress = false;
        $scope.showMes = true;
        $scope.img_url = imageURL;
        $scope.showBrowse = false;

        var headerPhoto = document.getElementById("idHeaderPhoto");
        if (headerPhoto)
            headerPhoto.src = imageURL;

    };

    $scope.onFileSelect = function ($files)
    {

        // $files: an array of files selected, each file has name, size, and
        // type.

        var file = $files[0];
        $scope.upload = $upload.upload(
                {
                    url: '/MyDeliveryPortal/photo',
                    method: 'POST',
                    headers:
                            {
                                'accept': 'application/json'
                            },
                    // withCredentials: true,
                    data:
                            {
                                myObj: $scope.myModelObj
                            },
                    file: file, // or list of files ($files) for html5 only
                    // fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name
                    // of the file(s)
                    // customize file formData name ('Content-Disposition'), server side
                    // file variable name.
                    // fileFormDataName: myFile, //or a list of names for multiple files
                    // (html5). Default is 'file'
                    // customize how data is added to formData. See
                    // #40#issuecomment-28612000 for sample code
                    // formDataAppender: function(formData, key, val){}
                }).progress(function (evt)
        {
            // console.log('percent: ' + parseInt(100.0 * evt.loaded /
            // evt.total));
            $scope.progress = true;
            $scope.showMes = true;
            $scope.errMesFlag = false;
        }).success(function (data, status, headers, config)
        {
            // file is uploaded successfully
            $scope.loadImage(data.enclosedObject);
            // debugger;
        }).error(function (data, status, headers, config)
        {
            // file failed to upload

            // $scope = data.message;
            $scope.errMes = data.message;
            $scope.errMesFlag = true;
            $scope.progress = false;
            $scope.showMes = false;
            // debugger;

            // console.log(data);

        });
        // .then(success, error, progress);
        // access or attach event listeners to the underlying XMLHttpRequest.
        // .xhr(function(xhr){xhr.upload.addEventListener(...)})

        /*
         * alternative way of uploading, send the file binary with the file's
         * content-type. Could be used to upload files to CouchDB, imgur, etc...
         * html5 FileReader is needed. It could also be used to monitor the
         * progress of a normal http post/put request with large data
         */
        // $scope.upload = $upload.http({...}) see 88#issuecomment-31366487 for
        // sample code.
    };

    // /////////////////////////////////////////////////////////////////////////////////
    /**
     * Delete Photo
     */
    $scope.deletePhoto = function ()
    {

        console.log('In delete photo');
        // URL 'Kludge' because Apache does not accept DELETE method.
        // "/photo" with DELETE method is better.
        // restservice.delete("/delete-photo",'',
        restservice.put(envconfig.get('host') + "/delete-photo", '', function (
                data, status)
        {
            // success
            console.log("Success");
            console.log(data);
            $scope.loadImage(data.enclosedObject);
        }, function (data, status)
        {
            // fail
            console.log("Fail");
            console.log(data);
        }, '');

    };
    // /////////////////////////////////////////////////////////////////////////////////

    $scope.updateUserProfile = function ()
    {

        $scope.updateFailed = false;
        $scope.updateSuccess = false;
        $scope.getFailed = false;
        $scope.changePasswordSaved = false;
        $scope.changePasswordfailed = false;
        var phoneNoValidatedStatus = "TRUE";
        if ($scope.phoneNo != $scope.currentPhoneNumber)
        {
            phoneNoValidatedStatus = "FALSE";
        }

        $scope.dob = $("#datetimepickerdob input").val();
        var userData =
                {
                    "title": $scope.title,
                    "firstName": $scope.firstName,
                    "lastName": $scope.lastName,
                    "email": $scope.regEmail,
                    "telephoneNumber": $scope.phoneNo,
                    "dateOfBirth": $scope.dob,
                    "id": $scope.scimId,
                    "optNewsLetter": $scope.optNewsLetter,
                    "userName": $rootScope.loggedUser,
                    "phoneNoValidatedStatus": phoneNoValidatedStatus,
                    "appName": "app"
                };

        restservice.put(envconfig.get('host') + "/updateUserProfile", '',
                function (data, status)
                {
                    if ($scope.reload == undefined)
                    {
                        $scope.updateSuccess = true;
                        /*$scope.phoneNoValidatedStatus = false;
                         if (data.phoneNoValidatedStatus == "TRUE")
                         {
                         $scope.phoneNoValidatedStatus = true;
                         }*/
                        $timeout(function ()
                        {
                            // $scope.updateSuccess = false;
                            $location.path('/myprofile');
                            $route.reload();
                        }, 3000);
                    }
                }, function (data, status)
        {
            $scope.updateFailed = true;
            /*
             * $timeout(function() { $scope.updateFailed = false; },
             * 3000);
             */
        }, userData);
    };

    // restservice.get(envconfig.get('host')+"/getUserProfile?userName="+$rootScope.loggedUser,
    // '', function(data, status)
    var userProfileUrl = envconfig.get('host') + "/user-profile";

    restservice.get(userProfileUrl, '', function (data, status)
    {
        $scope.updateFailed = false;
        $scope.updateSuccess = false;
        $scope.getFailed = false;
        $scope.changePasswordSaved = false;
        $scope.changePasswordfailed = false;
        $scope.title = data.title;
        $scope.firstName = data.firstName;
        $scope.lastName = data.lastName;
        $scope.regEmail = data.email;
        $scope.phoneNo = data.telephoneNumber;
        $scope.currentPhoneNumber = data.telephoneNumber;
        $scope.dob = data.dateOfBirth;
        $scope.scimId = data.id;
        $scope.userName = $rootScope.loggedUser;
        $scope.UserTypeLogin = data.userType;
        $scope.optNewsLetter = data.optNewsLetter;
        $scope.optNewsLetter = false;

        $scope.isRegistration  = data.isRegistration;
        if (data.title == null)
            $scope.title = "";
        if (data.optNewsLetter == null || data.optNewsLetter == "" || data.optNewsLetter === "true")
            $scope.optNewsLetter = true;
        $scope.phoneNoValidatedStatus = false;
        if (data.phoneNoValidatedStatus == "TRUE" || data.phoneNoValidatedStatus == "true")
        {
            $scope.phoneNoValidatedStatus = true;
        }
        if($scope.isRegistration!=null) {
            dataLayer.push({'event': 'signup'});
        }

        // Photo URL

        $scope.loadImage(photourlservice.resolvePhotoUrl(data.profileURL,
                data.defaultProfileURL));

    }, function (data, status)
    {
        // failure
        $scope.getFailed = true;
        /*
         * $timeout(function() { $scope.getFailed = false; }, 3000);
         */
    });

    $scope.changePassword = function ()
    {

        $scope.updateFailed = false;
        $scope.updateSuccess = false;
        $scope.getFailed = false;
        $scope.changePasswordSaved = false;
        $scope.changePasswordfailed = false;
        var userData =
                {
                    "password": document.getElementById('cur-password').value,
                    "newPassword": document.getElementById('new-password').value
                };

        document.getElementById('cur-password').value = "";
        document.getElementById('new-password').value = "";
        document.getElementById('con-password').value = "";
//                                document.getElementById('cur-password').focus();

        restservice.post(envconfig.get('host') + "/changePassword", '',
                function (data, status)
                {

                    $scope.changePasswordSaved = true;
                    /*
                     * $timeout(function() { $scope.changePasswordSaved = false; },
                     * 3000);
                     */

                }, function (data, status)
        {
            // failure
            if (status == '500')
            {
                $scope.changePasswordfailed = true;
            }
            else
            {

                $scope.changePasswordfailed = true;
                /*
                 * $timeout(function() { $scope.changePasswordfailed =
                 * false; }, 3000);
                 */
            }

        }

        , userData);

    };

    $scope.clearErrorMsg = function ()
    {
        $scope.passwordnotmatch = false;
    }

    $scope.validateMob = function ()
    {
        if (!$cookies.smsSentTime)
        {
            $cookies.smsSentTime = moment().unix();
        }
        if ($scope.phoneNo != $scope.currentPhoneNumber)
        {
            $scope.reload = false;
            $scope.updateUserProfile();
        }
        $scope.phoneNoValidatedStatus = false;
        $scope.requestPIN();
        modalservice.show('lg', 'views/template/modal/mobile-validate.html',
                'ModalCtrl', $scope, 'medium-dialog');
    };

    $scope.requestPIN = function ()
    {

        $scope.brandName = "";
        $scope.servicekey = "";
        restservice.get(envconfig.get('host') + "/config?key=smsbrandname", '',
                function (data, status)
                {
                    $scope.brandName = data.value;
                    restservice.get(envconfig.get('host')
                            + "/config?key=smsapiservicekey", '', function (
                                    data, status)
                            {
                                $scope.servicekey = data.value;
//                                                                                            restservice.get(envconfig.get('host')
//                                                                                                                            + "/getUserProfile?userName="
//                                                                                                                            + $rootScope.loggedUser, '', function(data,
//                                                                                                                            status)
                                var userProfileUrl = envconfig.get('host') + "/user-profile";

                                restservice.get(userProfileUrl, '', function (data, status)
                                {
                                    $scope.scimId = data.id;
                                    $scope.userName = $rootScope.loggedUser;
                                    var phoneNum = data.telephoneNumber;
                                    phoneNum = phoneNum.replace(/^(0+)/g, ''); // removing
                                    // leading
                                    // zeros
                                    //$scope.phoneNo = phoneNum;
                                    // alert(data.id);

                                    var userData =
                                            {
                                                "servicekey": $scope.servicekey,
                                                "senderid": $scope.brandName,
                                                "phonenum": phoneNum,
                                                "msgtxt": "%7Botp%7C" + $scope.brandName
                                                        + "%7C3600%7CETEN%7C4%7D",
                                                "msgclientref": $scope.userName,
                                                "scimid": $scope.scimId,
                                                "username": $scope.userName
                                            };

                                    restservice.post(envconfig.get('host')
                                            + "/requestPin", '', function (data, status)
                                            {
                                                // alert(data);
                                                /*
                                                 * $scope.updateSuccess = true;
                                                 * $timeout(function() { $scope.updateSuccess =
                                                 * false; }, 3000);
                                                 */
                                            }, function (data, status)
                                    {
                                        /*
                                         * $scope.updateFailed = true;
                                         * $timeout(function() { $scope.updateFailed =
                                         * false; }, 3000);
                                         */
                                    }, userData);

                                }, function (data, status)
                                {
                                    // error message
                                    alert("error--" + data)
                                });
                            }, function (data, status)
                    {
                        // error message
                    });
                }, function (data, status)
        {
            // error message
        });

    }

});
