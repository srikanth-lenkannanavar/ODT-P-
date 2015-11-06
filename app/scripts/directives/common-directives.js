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
        }).directive('retailerAccordion', function () {
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
//        .directive('bindManualAddress', function () {
//            return {
//                restrict: 'A',
//                require: ['ngModel', '^form'],
//                scope: {
//                    add1: "=add1",
//                    add2: "=add2",
//                    city: "=city",
//                    postcode: "=postcode",
//                    company: "=company",
//                    bindAdd: "=bindManualAddress",
//                },
//                link: function (scope, element, attributes, ctrls) {
//                    var ngModel = ctrls[0];
//                    var form = ctrls[1];
//                    function bindAdd(add1, add2, city, postcode, company) {
//                        var addArr = [];
//                        var add = "";
//                        if (add1) {
//                            addArr.push(add1);
//                        }
//                        if (add2) {
//                            addArr.push(add2);
//                        }
//                        if (city) {
//                            addArr.push(city);
//                        }
//                        if (postcode) {
//                            addArr.push(postcode);
//                        }
//                        if (company) {
//                            addArr.push(company);
//                        }
//                        if (addArr.length > 0) {
//                            add = addArr.join(" ");
//                        }
//                        return add;
//                    }
//                    /*
//                    scope.$watch("add1", function () {
//                        if (scope.add1) {
//                            scope.bindAdd = bindAdd(scope.add1, scope.add2, scope.city, scope.postcode, scope.company);
//                        }
//                    });
//                    scope.$watch("add2", function () {
//                        if (scope.add2) {
//                            scope.bindAdd = bindAdd(scope.add1, scope.add2, scope.city, scope.postcode, scope.company);
//                        }
//                    });
//                    scope.$watch("city", function () {
//                        if (scope.city) {
//                            scope.bindAdd = bindAdd(scope.add1, scope.add2, scope.city, scope.postcode, scope.company);
//                        }
//                    });
//                    scope.$watch("postcode", function () {
//                        if (scope.postcode) {
//                            scope.bindAdd = bindAdd(scope.add1, scope.add2, scope.city, scope.postcode, scope.company);
//                        }
//                    });
//                    scope.$watch("company", function () {
//                        if (scope.company) {
//                            scope.bindAdd = bindAdd(scope.add1, scope.add2, scope.city, scope.postcode, scope.company);
//                        }
//                    });
//                    */
//                }
//            };
//        })
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

            }
        })

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
        .filter('codeFilter', function () {
            return function (input, optional1, optional2) {
                if (input) {
                    input = input.substring(0, input.length - 3) + " " + input.substring(input.length - 3, input.length);
                    input = input.toLocaleUpperCase();
                    return input;
                }
                else {
                }
            };
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
                            $('html, body').animate({scrollTop: $('input.ng-invalid').first().offset().top - 100}, "slow");
                        }
                    });
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
        });

