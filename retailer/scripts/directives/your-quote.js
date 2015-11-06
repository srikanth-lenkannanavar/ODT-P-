angular.module('app')
   .directive('dateCollection',  function(){
    return {
          restrict: 'A',
          scope: {},
          link: function(scope, element ,attr) {

                var dp2 = $('#datetimepicker2');
                dp2.datetimepicker({
                    pickTime: false,
                    format: 'DD-MM-YYYY',
                    minDate : moment().format('DD-MM-YYYY'),
                    maxDate : moment().add(7, 'days').format('DD-MM-YYYY')
                });
                // dp2.on('changeDate', function(ev){
                // alert("hai");
                // dp2.val(ev.target.value);
                // });
            }
     
      }
    })
    .directive('dateCollectionMr',  function(){
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, element ,attr) {
                //alert("hai")

                var dp3 = $('#datetimepicker3');
                dp3.datetimepicker({
                    pickTime: false,
                    format: 'YYYY-MM-DD',
                    minDate : moment().format('YYYY-MM-DD'),
                    maxDate : moment().add(7, 'days').format('YYYY-MM-DD')
                });

                // dp2.on('changeDate', function(ev){
                // alert("hai");
                // dp2.val(ev.target.value);
                // });
            }

        }
    })
    .directive('timeSlotList',  function(){
        return {
            restrict: "C",
            link: function(){

//                var timeslotLi = $(".time-slot-list li");

                $(".time-slot-list ").on("click",function(){
              //   console.log($(this));
               });

            }

        }
    });