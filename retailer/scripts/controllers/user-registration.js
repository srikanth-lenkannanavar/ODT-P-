'use strict';

angular.module('app')
    .controller('UserRegistrationCtrl', function ($scope,restservice,$timeout,envconfig,$http) {

				$scope.registerUser = function(isValid)
					{
						if (!isValid)
							return;

						$scope.UserRegSuccess = false;
						$scope.UserRegFailed = false;
						var userData =
						{
							"firstName" : $scope.firstName,
							"lastName" : $scope.secondName,
							"email" : $scope.email,
							"password" : $scope.password,
							"telephoneNumber" : $scope.phoneNo
						};
						var token;
						restservice
								.post(
										envconfig.get('host') + "/registerUser",
										"",
										function(data, status)
										{
											$scope.UserRegSuccess = true;
											token = data.token;
											/*
											 * $timeout(function() {
											 * $scope.UserRegSuccess = false; },
											 * 3000);
											 */
											var rplogin = document
													.getElementById('loginlink').href
													+ "&token=" + token;
											document
													.getElementById('rploginlink').href = rplogin;
											/*document.getElementById(
													'rploginlink').click(); */
											window.location.href = document.getElementById('rploginlink').href;
										}, function(data, status)
										{
											$scope.UserRegFailed = true;
											/*
											 * $timeout(function() {
											 * $scope.UserRegFailed = false; },
											 * 3000);
											 */
										}, userData);

					};

					$scope.verifyEmail = function()
					{

						if ($scope.userRegister.email.$valid)
						{
							// restservice.get(envconfig.get('host')
							// + "/getUserProfile?userName="
							// + $scope.email, '', function(data, status)
							var userExistsUrl = envconfig.get('host')
									+ "/user-exists?userId="+$scope.email;

							restservice.get(userExistsUrl, '', function(data,
									status)
							{
								$scope.invalidEmail = true;
							}, function(data, status)
							{
								if (status == '404')
								{
									// $scope.validEmail=true;
									$scope.invalidEmail = false;
								}

							});

						}

					};

					$scope.clearErrorMsg = function()
					{
						$scope.invalidEmail = false;
					}

				});
