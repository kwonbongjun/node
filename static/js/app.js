angular.module("home", []).controller("HomeCtrl", function($scope,$http) {
	  $scope.fn_btn = function(url) {
				location.href = url;
		}
}).directive('hd', ['$compile', function () {
	    return {
	        templateUrl: './html/header.html',
	        restrict: 'E'
	    }
}]).directive('contents', ['$compile', function () {
	    return {
	        templateUrl: './html/contents.html',
	        restrict: 'E'
	    }
}]).directive('ft', ['$compile', function () {
	    return {
	        templateUrl: './html/footer.html',
	        restrict: 'E'
	    }
}]);
