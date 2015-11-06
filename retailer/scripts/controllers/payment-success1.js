angular
    .module('app')
    .controller('PaymentSuccessCtrl1',
    function ($scope, $upload, $rootScope, $location, envconfig, $modal,$routeParams)
    {

        $scope.homeUrl = envconfig.get("home");

        $scope.brJobNumber = $location.search().brJobNumber;

        $scope.uuid=  $routeParams.uuid;

//http://ec2-54-154-162-107.eu-west-1.compute.amazonaws.com/MyDeliveryApp/052c48b0-6b7b-4141-be5b-7c6324089946/payment-success?brJobNumber=MTczNTYwNjE=
				// use this to avoid redirects when a user clicks "back" in their browser
		//window.location.replace($scope.homeUrl+"/"+$scope.uuid+"/payment-success?brJobNumber="+$scope.brJobNumber);

		// use this to redirect, a back button call will trigger the redirection again
		$scope.go  = $scope.homeUrl+"/"+$scope.uuid+"/payment-success?brJobNumber="+$scope.brJobNumber;

		// given for completeness, essentially an alias to window.location.href
		//window.location = $scope.homeUrl+"/"+$scope.uuid+"/payment-success?brJobNumber="+$scope.brJobNumber;

    });
