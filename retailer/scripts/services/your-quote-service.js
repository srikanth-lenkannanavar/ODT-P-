/*
 *
 *Your Quote Service 
 * 
*/

angular.module('app').factory('YourQuoteService', function(){
   
    var QuoteService = {
      closeTimes : [
	  '00:00',
	  '00:30',
	  '01:00',
	  '01:30',
	  '02:00',
	  '02:30',
	  '03:00',
	  '03:30',
	  '04:00',
	  '04:30',
	  '05:00',
	  '05:30',
	  '06:00',
	  '06:30',
	  '07:00',
	  '07:30',
	  '08:00',
	  '08:30',
	  '09:00',
	  '09:30',
	  '10:00',
	  '10:30',
	  '11:00',
	  '11:30',
	  '12:00',
	  '12:30',
	  '13:00',
	  '13:30',
	  '14:00',
	  '14:30',
	  '15:00',
	  '15:30',
	  '16:00',
	  '16:30',
	  '17:00',
	  '17:30',
	  '18:00',
	  '18:30',
	  '19:00',
	  '19:30',
	  '20:00',
	  '20:30',
	  '21:00',
	  '21:30',
	  '22:00',
	  '22:30',
	  '23:00',
	  '23:30',
	   ],
	  shopOpenningTimes: [

	  '00:00',
	  '00:30',
	  '01:00',
	  '01:30',
	  '02:00',
	  '02:30',
	  '03:00',
	  '03:30',
	  '04:00',
	  '04:30',
	  '05:00',
	  '05:30',
	  '06:00',
	  '06:30',
	  '07:00',
	  '07:30',
	  '08:00',
	  '08:30',
	  '09:00',
	  '09:30',
	  '10:00',
	  '10:30',
	  '11:00',
	  '11:30',
	  '12:00',
	  '12:30',
	  '13:00',
	  '13:30',
	  '14:00',
	  '14:30',
	  '15:00',
	  '15:30',
	  '16:00',
	  '16:30',
	  '17:00',
	  '17:30',
	  '18:00',
	  '18:30',
	  '19:00',
	  '19:30',
	  '20:00',
	  '20:30',
	  '21:00',
	  '21:30',
	  '22:00',
	  '22:30',
	  '23:00',
	  '23:30'
		  ],
	 pickuptimeOptions:["Now","Later"],
	 getDurationDiff : function(d1,d2){
	 	var durationDiff = parseInt(moment.duration(d1) - moment.duration(d2), 10);
	 	return (durationDiff < 0) ? true : false;
	 },
     getOpenCloseTimeByDay: function(day){
            var time;
            switch (day) {
                case 'Mon':
                    time = {openTime:"mondayBranchStoreOpenTime", closeTime:"mondayBranchStoreClosingTime"};
                    break;
                case 'Tue':
                    time = {openTime:"tuesdayBranchStoreOpenTime", closeTime:"tuesdayBranchStoreClosingTime"};
                    break;
                case 'Wed':
                    time = {openTime:"wednesdayBranchStoreOpenTime", closeTime:"wednesdayBranchStoreClosingTime"};
                    break;
                case 'Thu':
                    time = {openTime:"thursdayBranchStoreOpenTime", closeTime:"thursdayBranchStoreClosingTime"};
                    break;
                case 'Fri':
                    time = {openTime:"fridayBranchStoreOpenTime", closeTime:"fridayBranchStoreClosingTime"};
                    break;
                case 'Sat':
                    time = {openTime:"saturdayBranchStoreOpenTime", closeTime:"saturdayBranchStoreClosingTime"};
                    break;
                case 'Sun':
                    time = {openTime:"sundayBranchStoreOpenTime", closeTime:"sundayBranchStoreClosingTime"};
                    break;
            }

            return time;


        },
	 getTodayDurationDiff: function(tDate,irTime){
	 		
		if( tDate == moment().format('DD-MM-YYYY')){
			return (irTime > moment().format('HH:mm')) ? false : true;
		}	 	
	 }

	}

	//console.log(QuoteService);
	//debugger;
	return QuoteService;
	
});