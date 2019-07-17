angular.module("home", []).controller("HomeCtrl", function($scope,$http) {
	  $scope.fn_btn = function(url) {location.href = url;}
	  //action="/m0/login" method="post"
	  $scope.fn_login = function() {
		  //console.log($scope.user);
		  $http({
			method : "POST",
			url : "/m0/login",
			data : $scope.user
		  }).then(function mySuccess(response) {
			var data = response.data;
			//console.log(data, data.rows, data.rows.length);
			if(data.rows.length > 0){
				alert("로그인 성공");
				location.href = data.url;
			} else {
				alert("로그인 실패");
			}
			$scope.user = {
				id: "",
				password : ""
			}
		  }, function myError(response) {
			console.log(response);
		  });
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
