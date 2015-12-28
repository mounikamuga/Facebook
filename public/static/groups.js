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
   
    $scope.searchGroups = function(val){
	    return $http.get('/getallgroups', {
	      params: {
	        gname: val
	      }
	    }).then(function(response){
	      return response.data.map(function(user){
	        return user;
	      });
	      
	    });
 	};
 	
 	$scope.onSelectGroup = function(group){
 		$('#selectedGroupol').show();
 	   $scope.selectedGroup = group
    };
   
   
   
   getgroups();
   function getgroups(){
	   var request = $http({
          method: "get",
          url: "/getgroups"
         
      });
      
		request.success(
		function(response) {
			$scope.mygroups = response
		});  
   };
   
   $scope.joingroup = function(groupid){
	   var request = $http({
          method: "post",
          url: "/joingroup",
          data:{
        	 groupid:groupid 
          }
         
         
      });
      
		request.success(
		function(response) {
			$('#selectedGroupol').hide();
			getgroups();
			
		});  
   };
   
   $scope.deletegroup = function(groupid){
	   var request = $http({
          method: "post",
          url: "/deletegroup",
          data:{
        	  groupid:groupid
          }
         
      });
      
		request.success(
		function(response) {
			getgroups();
			
		});  
   };
   
   $scope.creategroup = function(){
	   var request = $http({
          method: "post",
          url: "/creategroup",
          data:{
         	 groupname:$scope.cgroupname 
           }
         
      });
      
		request.success(
		function(response) {
			getgroups();
			
		});  
   };
   
   $scope.exitgroup = function(groupid){
	   var request = $http({
          method: "post",
          url: "/exitgroup",
          data:{
        	 groupid:groupid 
          }     
      });
      
		request.success(
		function(response) {
			getgroups();
			
		});  
   };
   
})