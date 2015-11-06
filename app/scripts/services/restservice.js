'use strict';

app.service('restservice', function($http,$location) {

	var restservice = {};
	var defaultconfig = {
		headers : {
			"Content-Type" : "application/json"
		}
	};
	restservice.get = function(url, config, successcallback, errorcallback) {
		if (config == '') {
			config = defaultconfig;
		}
		$http.get(url, config).success(function(data, status, headers, config) {
			successcallback(data, status);
		}).error(function(data, status, headers, config) {
			if(status==401){
				//document.getElementById('rploginlink').click();
				var cle = document.createEvent("MouseEvent");
		        cle.initEvent("click", true, true);
		        var elem = document.getElementById('rploginlink');
		        elem.dispatchEvent(cle);
			}else if(status==403){
				$location.path('/myprofile');
			}else{
				errorcallback(data, status);	
			}
			
		});

	};

	restservice.post = function(url, config, successcallback, errorcallback,data) {
		if (config == '') {
			config = defaultconfig;
		}
		$http.post(url, data,config).success(function(data, status, headers, config) {
			successcallback(data, status);
		}).error(function(data, status, headers, config) {
			if(status==401){
				//document.getElementById('rploginlink').click();
				var cle = document.createEvent("MouseEvent");
		        cle.initEvent("click", true, true);
		        var elem = document.getElementById('rploginlink');
		        elem.dispatchEvent(cle);
			}else if(status==403){
				$location.path('/myprofile');
			}else{
				errorcallback(data, status);	
			}
		});

	};

  restservice.put = function(url, config, successcallback, errorcallback,data) {
		if (config == '') {
			config = defaultconfig;
		}
		$http.put(url, data,config).success(function(data, status, headers, config) {
			successcallback(data, status);
		}).error(function(data, status, headers, config) {
			if(status==401){
				//document.getElementById('rploginlink').click();
				var cle = document.createEvent("MouseEvent");
		        cle.initEvent("click", true, true);
		        var elem = document.getElementById('rploginlink');
		        elem.dispatchEvent(cle);
			}else if(status==403){
				$location.path('/myprofile');
			}else{
				errorcallback(data, status);	
			}
		});

	};

  restservice.delete = function(url, config, successcallback, errorcallback,data) {
		if (config == '') {
			config = defaultconfig;
		}
		$http.delete(url, config).success(function(data, status, headers, config) {
			successcallback(data, status);
		}).error(function(data, status, headers, config) {
			if(status==401){
				//document.getElementById('rploginlink').click();
				var cle = document.createEvent("MouseEvent");
		        cle.initEvent("click", true, true);
		        var elem = document.getElementById('rploginlink');
		        elem.dispatchEvent(cle);
			}else if(status==403){
				$location.path('/myprofile');
			}else{
				errorcallback(data, status);	
			}
		});

	};

	return restservice;
});