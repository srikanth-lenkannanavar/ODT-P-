angular.module('app')
        .filter('propsFilter', function () {
            return function (items, props) {
                var out = [];
                if (angular.isArray(items)) {
                    items.forEach(function (item) {
                        var itemMatches = false;
                        var keys = Object.keys(props);
                        for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if(item[prop] !== undefined){
                                if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                    itemMatches = true;
                                    break;
                                }
                            }
                        }
                        if (itemMatches) {
                            out.push(item);
                        }
                    });
                } else {
                    // Let the output be the input untouched
                    out = items;
                }
                return out;
            }
        })
        .filter('noSort', function () {
            return function (input) {
                if (!input) {
                    return [];
                }
                return Object.keys(input);
            }
        })
        .filter('codeFilter', function () {
            return function (input, optional1, optional2) {
                if (input) {
                    input = input.substring(0, input.length - 3) + " " + input.substring(input.length - 3, input.length);
                    input = input.toUpperCase();
                    return input;
                }
                else {
                }
            };
        })
        .filter('dateFilterISO8601', function () {
            return function (input, format) {
                var res = input;
                if (input) {
                    if (input.indexOf("'T'") && input.indexOf(":")) {
                        if (format === "HH:MM") {
                            var timeArr = input.split("'T'")[1];
                            var HourMinArr = timeArr.split(":");
                            var HH = HourMinArr[0];
                            var MM = HourMinArr[1];
                            res = HH + ":" + MM;
                        }
                    } else {
                        res = input;
                    }
                } else {
                    res = input;
                }
                return res;
            };
        })
        .filter('ISO8601Parse', function () {
            return function (input, tzFormat, dateFormat) {
                var res = input;
                if (input) {
                    if (input.indexOf("T") && input.indexOf(":")) {
                        if (tzFormat.toLowerCase() === "uk") {
                            var timeZone = "Europe/London";
                        } else {
                            var timeZone = tzFormat;
                        }
                        if (input.indexOf('z') > -1) {
                            input = input.replace("z", "Z");
                        }
                        //var dateTimeStr = moment("2015-07-16T09:22:30Z").tz(timeZone).format();
                        //moment("2015-10-24T24:00").tz("Europe/London").format('Z')
                        //2015-08-31T13:00:00Z
                        //moment("2015-08-31T14:00:01Z").tz("Europe/London");
                        //
                        /**
                         var input = "2015-08-31T14:00";
                         if(moment(input).tz("Europe/London").format('z') === 'BST'){
                         input+":01Z";
                         }
                         input+moment(input).tz("Europe/London");
                         var ukDate = moment.tz(input, "Europe/London").format();
                         moment.tz("ukDate", "UTC").format();
                         **/
                        if (dateFormat === "DD-MM-YYYY" || dateFormat === "DD-MM-YYYY HH:mm" || dateFormat === "HH:mm") {
                            res = moment(input).tz(timeZone).format(dateFormat);

                        }
                    }
                } else {
                    res = input;
                }
                return res;
            };
        })
    .filter('ISO8601ParseII', function () {
        return function (input, tzFormat, dateFormat ,time ) {
            var res = input;
            if (input) {
                //console.log(time);
                if(time){
                    //console.log(input);
                   var input =  input.split("T")[0]+"T"+time+":00Z";
                }
                if (input.indexOf("T") && input.indexOf(":")) {
                    if (tzFormat.toLowerCase() === "uk") {
                        var timeZone = "Europe/London";
                    } else {
                        var timeZone = tzFormat;
                    }
                    if (input.indexOf('z') > -1) {
                        input = input.replace("z", "Z");
                    }

                    if (dateFormat === "DD-MM-YYYY" || dateFormat === "DD-MM-YYYY HH:mm" || dateFormat === "HH:mm") {
                        res = moment(input).tz(timeZone).format(dateFormat);

                    }
                }
            } else {
                res = input;
            }
            return res;
        };
    })

        .filter('UTCISOParse', function () {
            return function (input) {
                var date = input.split('-')[0];
                var month = input.split('-')[1];
                var year = input.split('-')[2];
                var dareParam = year + "-" + month + "-" + date;
                //"2015-08-04T18:30:00+00:00".substring(0, 19);//moment("2015-07-16").tz("utc").format();
                return moment(dareParam).tz("utc").format().substring(0, 19) + "Z";
            };
        })
        .filter('UkToUtc', function () {
            return function (input) {
                var ukDate = moment.tz(input, "Europe/London").format();
                return moment.tz(ukDate, "UTC").format().substring(0, 19) + "Z";
            };
        })
        .filter('DATEFormat', function () {
            return function (input) {
                var day = input.split('-')[0];
                var month = input.split('-')[1];
                var year = input.split('-')[2];
                var dareParam = year + "-" + month + "-" + day;
                return dareParam;
            };
        })
        .filter('HHMM', function () {
            return function (input) {
                return input.split(":")[0] + ":" + input.split(":")[1];
            };
        });
