'use strict';

/**
 * @ngdoc function
 * @name app.controller:MainCtrl
 * @description # MainCtrl Controller of the app
 */
app.controller('ForgotPasswordCtrl', function($rootScope,$scope, $location, $modal,$routeParams,
                                                     postcodeService, geocodeservice, restservice, modalservice,envconfig,$window) {

    $scope.alerts = [];
    //$scope.envHost = envconfig.get("host");
    $scope.sendSuccess = false;
    $scope.sendfailure = false;
	$scope.invalidEmail = false;
    $scope.socialUser = false;
    
    if($scope.userLogged == true)
        $location.path('/my-profile');

    $scope.mydelivery = {
        emailaddress : null,
        password:null,
        confirmation:null
    };

    $scope.clickback = function(){
        $window.history.back();
    };


	 $scope.forgotpassword = function(valid,path) {
        if(!valid) return;
		var userExistsUrl = envconfig.get('host')
					+ "/user-exists?userId="+$scope.mydelivery.emailaddress;
        $scope.socialUser = false;

			restservice.get(userExistsUrl, '', function(data,
					status)
			{
				if($scope.mydelivery.emailaddress!=null && data.userType!=null && data.userType != "Social"){
					restservice.post(envconfig.get('host')+"/forgotpassword", '', function(data, status) {
						//$scope.alertfunc('info',data.reason);
						$scope.sendSuccess = true;
						$scope.sendfailure = false;
					}, function(data, status) {
						//$scope.alertfunc('info',data.reason);
						$scope.sendSuccess = false;
						$scope.sendfailure = true;
					},$scope.mydelivery.emailaddress);
				}else{
                    if(data.userType == null || data.userType == "Social") {
                        $scope.socialUser = true;
                        $scope.sendfailure = false;
                        $scope.sendSuccess = false;
                    }
					$scope.alertfunc('info',"Please enter the Email Address");
				}
										
				
			}, function(data, status)
			{
				if (status == '404')
				{
					$scope.sendSuccess = false;
						$scope.sendfailure = true;
					//return false;
				}

			});
	};

    $scope.updatepassword = function(valid,path) {
        if(!valid) return;
        if($scope.mydelivery.emailaddress!=null && $scope.mydelivery.password!=null){
            $scope.mydelivery.confirmation = $routeParams.confirmation
            restservice.post(envconfig.get('host')+"/updatepassword", '', function(data, status) {
                //$scope.alertfunc('info',data.reason);
                $scope.sendSuccess = true;
                $scope.sendfailure = false;
            }, function(data, status) {
                //$scope.alertfunc('info',data.reason);
                $scope.sendSuccess = false;
                $scope.sendfailure = true;
            },$scope.mydelivery);

        }else{
            $scope.alertfunc('info',"Please enter the Email Address & Password");
        }
    };


    $scope.goHome = function(){
        window.location.href = envconfig.get("host")+'/samllogin?return=home';
    };

    // updating the ui after getting the results from service
    $scope.alertfunc = function(type,message) {
        $scope.alerts = [];
        $scope.alerts.push({
            type : type,
            msg : message
        });
    };
});
