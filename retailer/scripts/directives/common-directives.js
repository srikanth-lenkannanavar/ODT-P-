/**
 * It contains common angular directives of My Delivery App
 */
angular.module('app')
        .directive('body', function () {
            return {
                restrict: 'E',
                link: function (scope, element, attr) {
                    /*console.log(element);*/
                    //$(element).("body");
                    $(element).closest("body").removeClass("bg-container");
                }
            }
        })
        .directive('applyBg', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    /*console.log(element);*/
                    $(element).closest("body").addClass("bg-container");
                }
            }
        })
        .directive('retailerAccordion', function () {
            return {
                restrict: 'C',
                link: function (scope, element, attr) {
                    /*console.log(element);*/
                    //$(element).closest("body").addClass("bg-container");
                }
            }
        })
        .directive('cc', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    element.parent().css('border-bottom', ' 1px solid #ccc');
                    element.click(function () {
                        var cid = element.data("cid");
                        var rowindex = element.data("rowid");
                        var flipPanel = cid.split("-")[0];
                        $("#flip" + rowindex + "-panel").html("");
                        $("#flip" + rowindex + "-panel").append($("#" + cid).find("ul").clone(true));
                        $("#flip" + rowindex + "-panel")
                        $("#flip" + rowindex + "-panel div")
                        $(".show-panel").hide();
                        $(".retailer-logo img").removeClass("active");
                        $(this).addClass("active");
                        $("#flip" + rowindex + "-panel").slideDown("slow");
                        $(".retailer-logo div").css(
                                {
                                    'border-bottom': '1px solid #ccc',
                                    'background-color': 'white'
                                }
                        );
                        if ($(this).hasClass("active")) {
                            $(this).parent().css({'border-bottom': '1px solid #f7f7f7',
                                'background-color': '#f7f7f7'
                            });
                        }
                        ;
                    });
                    /*console.log(element);*/
                    //$(element).closest("body").addClass("bg-container");
                }
            }
        })
        .directive('compareTo', function () {
            return {
                restrict: 'A',
                require: "ngModel",
                scope: {
                    otherModelValue: "=compareTo"
                },
                link: function (scope, element, attributes, ngModel) {
                    ngModel.$validators.compareTo = function (modelValue) {
                        return modelValue == scope.otherModelValue;
                    };
                    scope.$watch("otherModelValue", function () {
                        ngModel.$validate();
                    });
                }
            };
        })
        .directive('checkStoreCloseTime', function (YourQuoteService) {
            return {
                restrict: 'A',
                require: "ngModel",
                scope: {
                    openTime: "=openTime"
                },
                link: function (scope, element, attributes, ngModel) {
                    ngModel.$validators.checkStoreCloseTime = function (modelValue) {
                        // console.log(modelValue);
                        // console.log(scope.openTime);
                        if(!modelValue) { //if select value is null
                            modelValue = "00:00";
                        }
                        return YourQuoteService.getDurationDiff(scope.openTime, modelValue);
                    };
                    scope.$watch("openTime", function () {
                        ngModel.$validate();
                    });
                }
            }
        })
        .directive('dateDob', function () {
            return {
                restrict: 'A',
                scope: {},
                link: function (scope, element, attr) {
                    var dob = $('#datetimepickerdob');
                    dob.datetimepicker({
                        pickTime: false,
                        format: 'DD/MM/YYYY',
                        viewMode: 'years',
                        useCurrent: false
                    });
                }
            };
        })
        .directive('timeslotDate', function (CommonService) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, element, attr, ctrl) {
                    var cd = $('#collectionDate');
                    var prevFlag = false;
                    var nextFlag = false;
                    var curDate = moment().format('DD-MM-YYYY');
                    if (cd.length) {
                        var ts = $('#timeslotDate');
                        ts.datetimepicker({
                            pickTime: false,
                            format: 'DD-MM-YYYY',
                            minDate: moment().format('DD-MM-YYYY'),
                            maxDate: moment().add(6, 'days').format('DD-MM-YYYY')
                        });
                        //var curDate = moment().format('DD-MM-YYYY');
                        //scope.timeslotDate = collectionDate;

                        ts.off("dp.change").on("dp.change", function (e) {
                            var curDate = moment().format('DD-MM-YYYY');
                            scope.timeslotDate = e.date.format('DD-MM-YYYY');
                            ts.data("DateTimePicker").setMinDate(curDate);
                            ts.data("DateTimePicker").setMaxDate(moment(curDate, 'DD-MM-YYYY').add(6, 'days').format('DD-MM-YYYY'));
                            var curDate = moment(curDate, 'DD-MM-YYYY');
                            var timeslotDate = moment(scope.timeslotDate, 'DD-MM-YYYY');
                            var calendarConfiguration = CommonService.setCalendarConfiguration(curDate, timeslotDate);

                            scope.updateTimeslotDate(e.date, calendarConfiguration.prevFlag, calendarConfiguration.nextFlag);
                        });
                        if (scope.persistTs) {
                            ts.data("DateTimePicker").setDate(scope.persistTsDeliveryDate);
                        }




                        if (!scope.isEditBooking && !scope.persistTs) {
                            var collectionDate = $('#collectionDate').data("DateTimePicker").getDate().format('DD-MM-YYYY');
                            ts.data("DateTimePicker").setDate(collectionDate);
                            /*
                             var curDate = moment(curDate, 'DD-MM-YYYY');
                             var timeslotDate = ts.data("DateTimePicker").getDate().format('DD-MM-YYYY');
                             var timeslotDate = moment(scope.timeslotDate, 'DD-MM-YYYY');
                             var calendarConfiguration = CommonService.setCalendarConfiguration(curDate, timeslotDate);
                             */
                            //scope.updateTimeslotDate(collectionDate,calendarConfiguration.prevFlag,calendarConfiguration.nextFlag);

                        }

                    }
                }
            };
        })
        .directive('dateClickArrow', function (CommonService) {
            return {
                restrict: 'A',
                scope: {
                    wen: '@dateWen'
                },
                link: function (scope, element, attr) {
                    element.on('click', function () {
                        scope.$apply(function () {
                            var cd = $('#collectionDate');
                            var ts = $('#timeslotDate');
                            var collectionDate = cd.data("DateTimePicker").getDate().format('DD-MM-YYYY');
                            var timeslotDate = ts.data("DateTimePicker").getDate().format('DD-MM-YYYY');
                            var updatedTimeslotDate = (scope.wen == "next") ? moment(timeslotDate, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY') : moment(timeslotDate, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY');
                            ts.data("DateTimePicker").setDate(updatedTimeslotDate);
                        });
                    });
                }
            };
        })
        .directive('collectionReadyDate', function () {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, element, attr) {
                    var cd = $('#collectionDate');
                    cd.datetimepicker({
                        pickTime: false,
                        format: 'DD-MM-YYYY',
                        minDate: moment().format('DD-MM-YYYY'),
                        maxDate: moment().add(6, 'days').format('DD-MM-YYYY')
                    });

                    if (!scope.isEditBooking || !scope.persistTs) {
                        var curDate = moment().format('DD-MM-YYYY');
                        scope.mydeliveryuser.deliverydate = curDate;
                    }


                    cd.off("dp.change").on("dp.change", function (e) {
                        scope.updateDeliveryDate(e.date);
                        //debugger;
                        if ($('#timeslotDate').length) {
                            $('#timeslotDate').data("DateTimePicker").setDate(e.date.format('DD-MM-YYYY'));
                        }
                    });

                    /*
                     if(scope.persistTs){
                     scope.isDeliveryPostcodeComplete = true;
                     var  persistDate = moment(scope.persistTsPackageCollectionDate).format('DD-MM-YYYY');
                     cd.data("DateTimePicker").setDate(persistDate);
                     //debugger;
                     //$('#collectionDate').data("DateTimePicker").getDate();
                     //scope.mydeliveryuser.deliverydate = persistDate;
                     //scope.updateDeliveryDate(persistDate);
                     }
                     */
                    if (!scope.isEditBooking || !scope.persistTs) {
                        cd.data("DateTimePicker").setDate(curDate);
                    }


                }
            };
        })
//        .directive('collectionReadyDate', function (CommonService) {
//            return {
//                restrict: 'A',
//                scope: true,
//                link: function (scope, element, attr) {
//                    var cd = $('#collectionDate');
//
//                    if (!scope.isEditBooking || !scope.persistTs) {
//                        CommonService.getServerTime().then(function (data) {
//                                //debugger;
//                                //var curDate = moment().format('DD-MM-YYYY');
//                                var curDate = moment(data.serverTime.split("T")[0]).format('DD-MM-YYYY');
//                                cd.datetimepicker({
//                                    pickTime: false,
//                                    format: 'DD-MM-YYYY',
//                                    minDate: curDate,
//                                    maxDate: moment(data.serverTime.split("T")[0]).add(6, 'days').format('DD-MM-YYYY'),
//                                    //defaultDate: curDate,
//                                    //useCurrent: false
//
//                                });
//
//                                cd.data("DateTimePicker").setDate(curDate);
//                                scope.mydeliveryuser.deliverydate = curDate;
//                        },
//                        function (err) {
//                            $scope.errFlag = true;
//                            $scope.errStatusCode = err.status;
//                        });
//
//                    }
//
//
//                    cd.off("dp.change").on("dp.change", function (e) {
//                        scope.updateDeliveryDate(e.date);
//                        //debugger;
//                        if ($('#timeslotDate').length) {
//                            $('#timeslotDate').data("DateTimePicker").setDate(e.date.format('DD-MM-YYYY'));
//                        }
//                    });

                    /*
                    if(scope.persistTs){
                        scope.isDeliveryPostcodeComplete = true;
                        var  persistDate = moment(scope.persistTsPackageCollectionDate).format('DD-MM-YYYY');
                        cd.data("DateTimePicker").setDate(persistDate);
                        //debugger;
                        //$('#collectionDate').data("DateTimePicker").getDate();
                        //scope.mydeliveryuser.deliverydate = persistDate;
                        //scope.updateDeliveryDate(persistDate);
                    }
                    */
//                    if (!scope.isEditBooking || !scope.persistTs) {
//                        //cd.data("DateTimePicker").setDate(curDate);
//                    }
//
//
//                }
//            };
//        })
        .directive('restrictQuickValidation', function () {
            return {
                restrict: 'A',
                require: "ngModel",
                link: function (scope, element, attributes, ngModel) {
                    ngModel.$validators.resetTouch = function (modelValue) {
                        if (!modelValue) {
                            ngModel.$touched = false;
                            return false;
                        } else {
                            return true;
                        }
                    };
                }
            }
        })
        .directive('goForward', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    $timeout(function ()
                    {
                        window.location.href = scope.go;
                        console.log("done");
                    }, 50);
                }
            }
        })
        .directive('chromeScrollFix', function () {
            return {
                restrict: 'A',
                require: "ngModel",
                scope: true,
                link: function (scope, element, attributes, ngModel) {
                    var documentElement = document.documentElement;
                    var focusedElementTop = (window.pageYOffset || documentElement.scrollTop) - (documentElement.clientTop || 0);
                    $(":input").focusin(function () {
                        focusedElementTop = (window.pageYOffset || documentElement.scrollTop) - (documentElement.clientTop || 0);
                    }).on('keyup', function (e)
                    {
                        var keyCode = e.keyCode || e.which;
                        if (keyCode == 9) {
                            $('body').scrollTop(focusedElementTop);
                        }
                    }
                    );
                }
            }
        })
        .directive('checkPostcodeHome', function (postcodeService) {
            return {
                restrict: 'A',
                //require: "ngModel",
                require: ['ngModel', '^form'],
                scope: true,
                link: function (scope, element, attributes, ctrls) {
                    var ngModel = ctrls[0];
                    var form = ctrls[1];
                    ngModel.$validators.checkPostcode = function (modelValue) {
                        //console.log(postcodeService.validate(modelValue));
                        if (modelValue && modelValue.length > 0) {
                            return postcodeService.validate(modelValue) ? true : false;
                        } else {
                            form.$submitted = false;
                            ngModel.$touched = false;
                        }
                    };
                }
            }
        })
        .directive('checkPostcode', function (postcodeService) {
            return {
                restrict: 'A',
                require: "ngModel",
                scope: true,
                link: function (scope, element, attributes, ngModel) {
                    //console.log(ngModel);
                    //alert('test');
                    ngModel.$validators.checkPostcode = function (modelValue) {
                        //console.log(postcodeService.validate(modelValue));
                        return postcodeService.validate(modelValue) ? true : false;
                    };
                }
            }
        })
        .directive('smMybilling', function () {
            return {
                restrict: 'C',
                link: function (scope, element, attributes) {
                    element.click(function () {
                        $(".sm-mybilling-open-close").slideUp(5);
                        $(this).closest("tr").next("tr").slideToggle();
                    });
                    $(".sm-mybilling-close").click(function () {
                        $(".sm-mybilling-open-close").hide();
                    })
                }
            }
        })
        .directive('smMyDelOrd', function () {
            return {
                restrict: 'C',
                link: function (scope, element, attributes) {
                    element.click(function () {
                        $(".my-del-sm-info").slideUp(5);
                        $(this).closest("tr").next("tr").slideToggle();
                    });
                    $(".sm-mybilling-close").click(function () {
                        $(".my-del-sm-info").hide();
                    });
                }
            }
        })
        .directive('convertNumber', function (postcodeService) {
            return {
                restrict: 'A',
                require: "ngModel",
                link: function (scope, element, attributes, ngModel) {
                    ngModel.$formatters.push(
                            function (value) {
                                //postcodeService.validate(modelValue) ? true: false
                                return Number(value) ? Number(value) : 00;
                                //console.log('this only gets called on page load');
                                //debugger;
                            }
                    );
                }
            }
        })
        .directive('collectionUpload', function (postcodeService) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    element.click(function () {
                        element.closest(".row").find(".browse-collection").trigger("click");
                    });
                }
            }
        })
        .directive('highlightMenu', function (postcodeService) {
            return {
                restrict: 'C',
                link: function (scope, element, attributes) {
                    element.click(function () {
                        if ($(document).width() >= 768) {
                            var elWidth = $(this).width() + 2;
                            $(this).find(".dropdown-menu").css("width", elWidth);
                        }
                    });
                }
            }
        })
        .directive('quantity', function (postcodeService) {
            return {
                restrict: 'C',
                link: function (scope, element, attributes) {
                    element.keypress(function (eve) {
                        if (eve.keyCode === 8 || eve.keyCode === 46
                                || eve.keyCode === 37 || eve.keyCode === 39 || eve.keyCode === 9) {
                            return true;
                        }
                        else
                        if ((eve.which !== 46 || $(this).val().indexOf('.') !== -1) && (eve.which < 48 || eve.which > 57) || (eve.which === 46 && $(this).caret().start === 0)) {
                            return false;
                        }
                    });
                }
            };
        })
        .directive('playVideo', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    $('#video1').get(0).play();
                    //Pause video on close of popin

                    $('.close').click(function () {
                        $('#video1').get(0).pause();
                    });
                }
            }
        })
        // creates a tooltip depends browser's location share option
        .directive('tooltip', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (data) {
                            //alert();
                        }, function () {
                            $('[data-toggle="popover"]').popover();
                        });
                    } else {
                        $('[data-toggle="popover"]').popover();
                    }
                }
            }
        })
        .directive('cardString', function (postcodeService) {
            return {
                restrict: 'C',
                link: function (scope, element, attributes) {
                    element.keypress(function (eve) {
                        try {
                            if (window.event) {
                                var charCode = window.event.keyCode;
                            }
                            else if (eve) {
                                var charCode = eve.which;
                            }
                            else {
                                return true;
                            }
                            if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode === 32) || (charCode === 46)
                                    || (charCode === 8) || (charCode === 37) || (charCode === 39) || (charCode === 0))
                                return true;
                            else
                                return false;
                        }
                        catch (err) {
                            alert(err.Description);
                        }
                    });
                }
            };
        })
        //JO'n has added in order to have tweet button on payment success page
        .directive('tweet', ['$window', function ($window) {
                return {
                    restrict: 'A',
                    template: '<a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-url="' + $window.location.origin + '" data-text="Amazing! I have just used @onthedotuk for a delivery in the 1 hour timeslot of my choice!\n">Tweet</a>',
                    link: function (scope, element, attrs) {
                        scope.$watch(function () {
                            return !!$window.twttr;
                        },
                                function (twttrIsReady) {
                                    if (twttrIsReady) {
                                        $window.twttr.widgets.load(element.parent()[0]);
                                    }
                                });
                    }
                };
            }])
        .directive('scrolltoFirst', function () {
            return {
                restrict: 'A',
                require: "^form",
                link: function (scope, element, attributes, ngModel) {
                    element.bind('submit', function (event) {
                        if (ngModel.$invalid) {
                           if($('input.ng-invalid').length){
                                $('html, body').animate({scrollTop: $('input.ng-invalid').first().offset().top - 100}, "slow");
                            }else if(($('textarea.ng-invalid').length == 0) && ($('input.ng-invalid').length == 0) && ($('select.ng-invalid').length)) {
                                $('html, body').animate({scrollTop: $('select.ng-invalid').first().offset().top - 100}, "slow");
                            }else {
                                $('html, body').animate({scrollTop: $('textarea.ng-invalid').first().offset().top - 100}, "slow");
                            }
                        }
                    });
                }
            };
        })
        .directive('scrollToGlobalError', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes, ngModel) {
                    $('html, body').animate({scrollTop: $('.global-msg').offset().top - ($('.global-msg').offset().top - 100)}, "slow");
                }
            };
        })
        .directive('otdScrollTo', function ($rootScope) {
            return {
                restrict: 'A',
                scope: {
                    whereToScroll: "@otdScrollTo"
                },
                link: function (scope, element, attributes) {
                    element.on("click", function () {
                        $rootScope.whereToScroll = scope.whereToScroll;
                    });
                }
            };
        })
        .directive('otdScrollToPartial', function ($rootScope) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    if ($rootScope.whereToScroll) {
                        var unbindViewContentLoaded = scope.$watch('$viewContentLoaded', function () {
                            var offsetValue = $('#' + $rootScope.whereToScroll).offset().top;
                            //console.log(offsetValue);
                            $('html, body').animate({scrollTop: offsetValue}, 'slow');
                            $rootScope.whereToScroll = undefined;
                            unbindViewContentLoaded();
                        });
                    }
                }
            };
        })
        .directive('dropzone', function ($rootScope) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    var myDropzone = new Dropzone('.dropzone', {url: "/MyDeliveryPortal/retailerLogo",
                        addRemoveLinks: true,
                        maxFilesize: 1,
                        maxFiles: 1,
                        resize: function (file) {
                            //debugger;
                            var info;

                            // drawImage(image, srcX, srcY, srcWidth, srcHeight, trgX, trgY, trgWidth, trgHeight) takes an image, clips it to
                            // the rectangle (srcX, srcY, srcWidth, srcHeight), scales it to dimensions (trgWidth, trgHeight), and draws it
                            // on the canvas at coordinates (trgX, trgY).
                            info = {
                                srcX: 0,
                                srcY: 0,
                                srcWidth: file.width,
                                srcHeight: file.height,
                                trgX: 0,
                                trgY: 0,
                                trgWidth: this.options.thumbnailWidth,
                                trgHeight: parseInt(this.options.thumbnailWidth * file.height / file.width)
                            }

                            return info;
                        },
//                        thumbnailWidth: info.srcHeight,
//                        thumbnailHeight: info.srcWidth,
                          acceptedFiles: "image/*"/*,
                         clickable: ['.dropzone', '.dz-edit']*/
                    });
                    myDropzone.on("removedfile", function (file) {
                        //$('.dz-edit').hide();
                        $rootScope.isImageAdded = false;
                        $rootScope.isImageRemoved = true;
                    });
                    myDropzone.on("drop", function (event) {
                        $rootScope.isImageAdded = true;
                        if (this.files.length > 0) {
                            event.preventDefault();
                            event.currentTarget.dropzone.removeFile();
                        }
                    });
                    myDropzone.on("maxfilesreached", function (file) {
                        if (file.length >= 2) {
                            file[1].status = "success";
                            myDropzone.removeFile(file[0]);
                            $('.dz-preview').removeClass('dz-error');
                        }
                        //debugger;
                        //myDropzone.removeFile(file);
                    });
                    myDropzone.on("addedfile", function (file) {
                        $('.dz-edit').show();
                        file.previewElement.parentElement.addEventListener("click", function () {
                            event.preventDefault();
                            event.stopPropagation();
                            //myDropzone.removeFile(file);
                        });
                        $rootScope.isImageAdded = true;

                    });


                    /*
                     myDropzone.on("thumbnail", function(file, url) {
                     //debugger;
                     });
                     myDropzone.on("maxfilesexceeded", function(file) {
                     debugger;
                     file.previewElement.remove()
                     Maybe display some more file information on your page
                     });*/
                }
            }
        })
        .directive('otdStaticMenu', function () {
            return {
                restrict: 'E',
                templateUrl: 'views/template/menu/static-tpl.html',
                replace: 'true'
            }
        })
        .directive('otdTransactionalMenu', function () {
            return {
                restrict: 'E',
                templateUrl: 'views/template/menu/transactional-tpl.html',
                replace: 'true'
            }
        })
        .directive('otdLogoHamburger', function () {
            return {
                restrict: 'E',
                templateUrl: 'views/template/menu/logo-hamburger-tpl.html',
                replace: 'true'
            }
        })
        .directive('otdGetStartedPostcode', function () {
            return {
                restrict: 'E',
                templateUrl: 'views/template/get-started-postcode-tpl.html',
                replace: 'true'
            }
        })
        .directive('otdStandaloneMapHeader', function () {
            return {
                restrict: 'E',
                templateUrl: 'views/template/standalone-map-header-tpl.html',
                replace: 'true'
            }
        })
        .directive('otdMyDeliveryCollapse', function () {
            return {
                restrict: 'E',
                scope: {
                    aaa: '=',
                    indexNo: '@index',
                    toggle: '@toggle',
                    target: '@target',
                    isOpen: '=isOpen'
                },
                transclude: true,
                templateUrl: 'views/template/my-delivery/order-no-tpl.html',
                link: function (scope, element, attributes) {

                    element.on("click", function () {
                        var collapseIn = $(this).closest("tr").next("tr").hasClass("in");
                        scope.$apply(function () {
                            if (!collapseIn) {
                                scope.isOpen = true;
                            } else {
                                scope.isOpen = false;
                            }
                        });
                    });
                    $('.collapse').on('show.bs.collapse', function () {
                        $('.collapse.in').collapse('hide');
                        scope.isOpen = false;
                    });
                }
            }
        })
        .directive('itemValue', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    element.numeric({decimal: ".", negative: false, scale: 2});
                }
            }
        })
        /*.directive('restrictSpecCharacters1', function (postcodeService) {  // restricts special characters
         return {
         restrict: 'A',
         link: function (scope, element, attributes) {
         element.keypress(function (event) {
         var regex = new RegExp("^[a-zA-Z0-9]+$");
         var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
         if (!regex.test(key)) {
         event.preventDefault();
         return false;
         }
         });
         }
         };
         })*/
        /*.directive('restrictSpecCharacters', function (postcodeService) {  // restricts alphabets characters
         return {
         restrict: 'A',
         require: 'ngModel',
         link: function (scope, element, attributes, ngModelCtrl) {
         function fromUser(text) {
         var transformedInput = text.replace(/[$&+,:;=?@#|'<>.^*()%!-]/g, '');
         if (transformedInput !== text) {
         ngModelCtrl.$setViewValue(transformedInput);
         ngModelCtrl.$render();
         }
         return transformedInput;
         }
         ngModelCtrl.$parsers.push(fromUser);
         }
         };
         })*/
        .directive('restrictAlphabets', function (postcodeService) {  // restricts alphabets characters
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attributes, ngModelCtrl) {
                    function fromUser(text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
        .directive('restrictSpecCharacters', function (postcodeService) {  // restricts alphabets characters
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attributes, ngModelCtrl) {
                    function fromUser(text) {
                        var transformedInput = text.replace(/[^0-9A-Za-z-]/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
        .directive('elemReady', function ($parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    var elem = element.children();
                    element.ready(function () {
                        scope.$watch('$viewContentLoaded', function () {
                            elem.focus();
                        });
                    })
                }
            }
        })
        .directive('otdPagination', function ($compile, CommonService) {
            return {
                restrict: 'E',
                scope: true,
                templateUrl: 'views/template/pagination/pagination.html',
                link: function (scope, element, attributes) {

                    scope.$watch('page.currentPage', function (newValue, oldValue) {
                        if ((Number(scope.page.currentPage) === Number(scope.totalRecord)) || (Number(scope.page.currentPage) > Number(scope.totalRecord))) {
                            scope.next = true;
                        } else {
                            if(Number(scope.page.currentPage)==0){
                                scope.prev = true;
                            }
                            scope.next = false;
                        }

                        if (Number(scope.page.currentPage) <= 1) {
                            scope.prev = true;
                        } else {
                            scope.prev = false;
                        }

                    });


                }
            };
        })
        /*.directive('focus', function($timeout) {
         return {
         scope:{
         trigger : '@focus'
         },
         link : function(scope, element) {
         scope.$watch('trigger', function(value) {
         if (value === "true") {
         element[0].focus();
         $timeout(function() {
         element[0].focus();
         });
         }
         });
         }

         };

         })*/;
