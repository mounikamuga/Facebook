var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('myCtrl', function($scope,$http,$window) {
 	
 	
 	$scope.searchUsers = function(val){
	    return $http.get('/getallusers', {
	      params: {
	        search: val
	      }
	    }).then(function(response){
	      return response.data.map(function(user){
	        return user;
	      });
	      
	    });
 	};
 	
   $scope.onSelect = function(user){
	   $window.location.href= "/profile/"+user.userid;
   };
   	getfriends();
	
	function getfriends(){
			   var request = $http({
		           method: "get",
		           url: "/getfriends"
		          
		       });
		       
				request.success(
				function(response) {
					$scope.friends= response;
				}); 
	};
	
	$scope.unfriend = function(userid){
		    var request = $http({
		                    method: "post",
		                    url: "/frndaction",
		                    data: {
		                        action : 2,
		                        frndid : userid
		                    }
		                });
		                
	       request.success(
	           function(response) {
	           		$window.location.reload();
	           });   
		};
		
 
})