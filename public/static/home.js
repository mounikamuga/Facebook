var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('myCtrl', function($scope,$http,$window,$interval) {
	
 	//$interval(getstatus,1000 * 10);
 	getstatus();
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
   
   $scope.poststatus = function(){
	    var request = $http({
	                    method: "post",
	                    url: "/poststatus",
	                    data: {
	                        status : $scope.status
	                    }
	                });
	                
       request.success(
           function(response) {
           	 getstatus() ;
           });   
	};
	
	function getstatus(){
		   var request = $http({
	           method: "get",
	           url: "/getstatus"
	          
	       });
	       
			request.success(
			function(response) {
				$scope.posts= response;
			});  
		   
	   };
	
	 $scope.frndreq = function(action){
		 var userId = $('[name=userid]').val();
		    var request = $http({
		                    method: "post",
		                    url: "/frndaction",
		                    data: {
		                        action : action,
		                        frndid : userId
		                    }
		                });
		                
	       request.success(
	           function(response) {
	           		$window.location.reload();
	           });   
		};
		
		//groups

		getfriendgroups();
		   function getfriendgroups(){
			   var userId = $('[name=userid]').val();
			   var request = $http({
		          method: "get",
		          url: "/getgroups",
		          params: {
		        	  userid:userId
		          }
		         
		      });
		      
				request.success(
				function(response) {
					$scope.friendgroups = response
				});  
		   };
		   
		 //posts
		    getfriendposts()
		    function getfriendposts(){
		    	var userId = $('[name=userid]').val();
				   var request = $http({
			           method: "get",
			           url: "/getstatus",
			           params:{
			        	   userid:userId
			           }
			          
			       });
			       
					request.success(
					function(response) {
						$scope.friendposts= response;
					});  
				   
			   };
			   
			   
		//interests
			   
			   getfriendinterests();
			   function getfriendinterests(){
				   var userId = $('[name=userid]').val();
				   var request = $http({
			          method: "get",
			          url: "/getinterests",
			           params:{
			        	   userid:userId
			           }
			         
			      });
			      
					request.success(
					function(response) {
						$scope.friendinterests = response
					});  
			   };
			   
})