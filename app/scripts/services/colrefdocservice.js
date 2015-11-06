'use strict';

app
        .service(
                'colrefdocservice',
                function ($http, envconfig) {
                    var colrefdocservice = {};

                    var maxFileSize = 1048576;
                    var aryPermittedFileExtensions = null;

                    $http.get(envconfig.get('host') + '/document-validator').
                            success(function (data, status, headers, config)
                            {
                                var objDocValidator = angular.fromJson(data);
                                maxFileSize = objDocValidator.maxFileSize;
                                aryPermittedFileExtensions = objDocValidator.permittedExtensionList;
                            }).
                            error(function (data, status, headers, config)
                            {
                            });

                    var validateFileExtension = function(strFileName)
                    {

                        if (aryPermittedFileExtensions == null || aryPermittedFileExtensions.length <= 0)
                            return true;

                        var aryFileParts = strFileName.split(".");
                        if (aryFileParts.length <= 1)
                            return false;

                        var fileExtension = aryFileParts[aryFileParts.length - 1].toUpperCase();

                        for (var i = 0; i < aryPermittedFileExtensions.length; i++)
                        {
                            if (fileExtension === aryPermittedFileExtensions[i].toUpperCase())
                                return true;
                        }

                        return false;
                    };

                    colrefdocservice.uploadDoc = function ($files, index,
                            $scope, restservice, $upload, envconfig,
                            arrayItems, uuid) {

                        if (uuid) {
                            uuid = uuid.trim();

                            if (uuid == '') {
                                alert("Cannot upload file. UUID not found.");
                                return;
                            }
                        } else {
                            alert("Cannot upload file. UUID not found.");
                            return;
                        }

                        var objCollectionReference = arrayItems[index];


                        var docId = "ID" + (new Date()).getTime();

                        for (var i = 0; i < $files.length; i++) {

                            var file = $files[i];
                            //
                            if (file.size > maxFileSize)//1MB MAX
                            {
                                objCollectionReference.fileUploadErrorMessage = "Sorry! The file size is too big (more than 1MB). File: " + file.name;
                                $("input#browseCollection"+index).val("");
                                return;
                            }

                            if (!validateFileExtension(file.name))
                            {
                                objCollectionReference.fileUploadErrorMessage = "Sorry! The file is an invalid format. File: " + file.name;
                                $("input#browseCollection"+index).val("");
                                return;
                            }


                            objCollectionReference.fileUploadErrorMessage = "";
                            objCollectionReference.progressMessage = "Uploading. Please wait. File: " + file.name;
                            objCollectionReference.isWorking = true;

                            $scope.upload = $upload
                                    .upload(
                                            {
                                                url: envconfig.get('host')
                                                        + '/document/' + uuid
                                                        + '/' + docId,
                                                method: 'POST',
                                                data: {
                                                    myObj: $scope.myModelObj
                                                },
                                                file: file
                                            })
                                    .progress(
                                            function (evt) {
                                                // Multiplied by a fraction
                                                // because of two pass upload.
                                                var progress = parseInt(((evt.loaded / evt.total) * 100) * 0.8);
                                                objCollectionReference.progressMessage = "Uploading. Please wait. "
                                                        + progress + "%. File: " + file.name;
                                            })
                                    .success(
                                            function (data, status, headers,
                                                    config) {

                                                objCollectionReference.isWorking = false;
                                                objCollectionReference.progressMessage = "";

                                                $("input#browseCollection"+index).val("");

                                                if (status == 401 || status == 403)
                                                {
                                                    var cle = document
                                                            .createEvent("MouseEvent");
                                                    cle.initEvent("click",
                                                            true, true);
                                                    var elem = document
                                                            .getElementById('rploginlink');
                                                    elem.dispatchEvent(cle);
                                                    return;
                                                }


                                                if (!data) {
                                                    alert("Unable to upload file. Please try later.");
                                                    return;
                                                }

                                                // console.log(data);

                                                var objData = angular
                                                        .fromJson(data);

                                                // console.log(arrayItems[index]);

                                                objCollectionReference.s3FileName = objData.s3FileName;
                                                objCollectionReference.fileName = objData.fileName;
                                                objCollectionReference.browseCollection = objData.fileName;
                                                objCollectionReference.docId = objData.docId;

                                            })
                                    .error(
                                            function (data, status, headers,
                                                    config) {
                                                        
                                                objCollectionReference.isWorking = false;
                                                objCollectionReference.progressMessage = "";
                                                objCollectionReference.fileUploadErrorMessage = "";

                                                $("input#browseCollection"+index).val("");

                                                if (status == 401 || status == 403)
                                                {
                                                    var cle = document
                                                            .createEvent("MouseEvent");
                                                    cle.initEvent("click",
                                                            true, true);
                                                    var elem = document
                                                            .getElementById('rploginlink');
                                                    elem.dispatchEvent(cle);
                                                    return;
                                                }


                                                // file failed to upload
                                                var message = "Oops! It appears there was a problem uploading your file. Please try again.";

                                                if (data
                                                        && data
                                                        .hasOwnProperty('message')) {
                                                    message = data.message;

                                                    if (data
                                                            .hasOwnProperty('enclosedObject')) {
                                                        message = message
                                                                + " "
                                                                + data.enclosedObject;
                                                    }

                                                }

                                                objCollectionReference.fileUploadErrorMessage = message;
                                                // alert(message);

                                            });

                        }
                    };

                    colrefdocservice.deleteDoc = function (index, $scope,
                            restservice, envconfig, interactive, arrayItems,
                            uuid) {
                        // MRS: Delete file can be called on two events:
                        // 1. When the user deletes the file.
                        // 2. When the user deletes the whole collection
                        // reference.
                        // For case 2, we don't want to show pop up message
                        // boxes.
                        // Surely not elegant, but works with time crunch!

                        var blnInteractive = (interactive && interactive === true);

                        if (blnInteractive) {
                            var r = true;
                            if (r != true)
                                return;
                        }

                        if (uuid) {
                            uuid = uuid.trim();

                            if (uuid == '') {
                                alert("Cannot upload file. UUID not found.");
                                return;
                            }
                        } else {
                            alert("Cannot upload file. UUID not found.");
                            return;
                        }

                        var objCollectionReference = arrayItems[index];

                        var docId = null;

                        if (arrayItems && objCollectionReference.docId
                                && objCollectionReference.docId != '') {
                            docId = objCollectionReference.docId;
                        } else {
                            if (blnInteractive)
                                alert("Cannot delete file. Doc Id not found.");
                            return;
                        }

                        var userData = {
                            "fileName": objCollectionReference.fileName
                        };

                        objCollectionReference.fileUploadErrorMessage = "";
                        objCollectionReference.isWorking = true;
                        objCollectionReference.progressMessage = "";

                        restservice
                                .put(
                                        envconfig.get('host')
                                        + "/delete-document/" + uuid
                                        + "/" + docId,
                                        '',
                                        function (data, status) {

                                            objCollectionReference.isWorking = false;

                                            if (status == 401 || status == 403)
                                            {
                                                var cle = document
                                                        .createEvent("MouseEvent");
                                                cle.initEvent("click",
                                                        true, true);
                                                var elem = document
                                                        .getElementById('rploginlink');
                                                elem.dispatchEvent(cle);
                                                return;
                                            }

                                            objCollectionReference.s3FileName = "";
                                            objCollectionReference.fileName = "";
                                            objCollectionReference.browseCollection = "";
                                        },
                                        function (data, status) {
                                            objCollectionReference.isWorking = false;

                                            if (status == 401 || status == 403)
                                            {
                                                var cle = document
                                                        .createEvent("MouseEvent");
                                                cle.initEvent("click",
                                                        true, true);
                                                var elem = document
                                                        .getElementById('rploginlink');
                                                elem.dispatchEvent(cle);
                                                return;
                                            }

                                            var message = "Oops! It appears there was a problem deleting your file. Please try again.";

                                            if (blnInteractive) {
                                                // alert(message);
                                                objCollectionReference.fileUploadErrorMessage = message;
                                            }
                                        }, userData);
                    };

                    return colrefdocservice;
                });
