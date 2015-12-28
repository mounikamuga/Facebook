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
   
   
   $scope.edit = function(){
	  $("[name=save]").attr("disabled",false) ;
	  $("#aboutForm input").attr("readonly",false) ;
	  $("[name=edit]").attr("disabled",true) ;
   } ;
   
   $scope.save = function(){
	   var request = $http({
           method: "post",
           headers: {"enctype":"multipart/form-data"},
           url: "/postabout",
    	   data: {
               firstname : $scope.firstname,
               lastname : $scope.lastname,
               mobilenumber : $scope.mobilenumber,
               email : $scope.email,
               birthday : new Date($scope.birthday),
              description :$scope.description,
   			workex:$scope.workexperience,
   			lifeevents:$scope.lifeevents,
   			education:$scope.education
    	   	}
       });
       	 request.success(
       	function(response){
       		     $scope.msg = response;
       		  $("[name=save]").attr("disabled",true) ;
       		  $("#aboutForm input").attr("readonly",true) ;
       		  $("[name=edit]").attr("disabled",false) ;
       	});
	   
   } ;
   
   aboutme();
    function aboutme(){
	   var request = $http({
           method: "get",
           url: "/getaboutme"
          
       });
       
		request.success(
		function(response) {
			$scope.firstname = response.firstname ;
			$scope.lastname = response.lastname ;
			$scope.email = response.email ;
			$scope.mobilenumber = response.mobilenumber ;
			$scope.birthday = new Date(response.birthday) ;
			$scope.userid=response.userid;
			$scope.description = response.description;
			$scope.workexperience=response.workexperience;
			$scope.lifeevents=response.lifeevents;
			$scope.education=response.education;
		});  
	   
   };
   
   getinterests();
   function getinterests(){
	   var request = $http({
          method: "get",
          url: "/getinterests"
         
      });
      
		request.success(
		function(response) {
			$scope.myinterests = response
		});  
   };
   
   $scope.postinterests = function(){
	   var request = $http({
          method: "post",
          url: "/postinterests",
          data:{
        	  interest:$scope.myinterest 
          }
         
         
      });
      
		request.success(
		function(response) {
			getinterests();
			
		});  
   };
   
   $scope.deleteinterests = function(interestsid){
	   var request = $http({
          method: "post",
          url: "/deleteinterests",
          data:{
        	  interestsid:interestsid
          }
         
      });
      
		request.success(
		function(response) {
			getinterests();
			
		});  
   };
   
})