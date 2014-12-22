app.controller('profileController', ['$scope','$routeParams','$http', function($scope, $routeParams, $http){
  // $scope.tipsters = tipsters
  $scope.currentUser = currentUser
  $scope.followingDefault = false

  $http.get('/users/tipsters').success(function(data) {
    $scope.tipsters = angular.fromJson(data.data) //had to use angular.fromJson as data was coming back as a string. get the tipster information again and reassign tipsters with the updated information. will be stored as $scope.tipsters so will replace the original $scope.tipsters with the older data
  })

//getting all of the info for the users profile page, have to delve even deeper to get their tips, the predictions on the tip and the type of bet of the prediction.
  $http.get('/users/users_profile/' + $routeParams.id + '.json').success(function(data){
    $scope.userProfile = data
    $http.post('/users/profile_tips.json', 
    {
      tip:{ 
        user_id: data.data.id
      }}).success(function(data){ //tip can be anything here but has to be the same as the first params bracket in the user controller action 'profile_tips'
      console.log(data)
      $scope.userTips = data
      // $http.post('/users/profile_predictions.json', {
      //   predictions:
      //   { 
      //     tip_id: data.data.id
      //   }}).success(function(data){
      //   $scope.userPredictions = data
      //   $http.post('/users/profile_type_of_bet.json', {
      //     type:{
      //       type_of_bet_id: data.data.type_of_bet_id
      //     }}).success(function(data){
      //     $scope.userTypeOfBet = data
      //   });
      // });
    });
  });

  //gets all the tips data
  // $http.get('/tips.json').success(function(data){
  //   $scope.tips = data;
  // });

  //get method to get all of the user connections for a subscription request
  $http.get('/user_connections/subscription_requests').success(function(response){
    $scope.follower = response.data; 
  });

  //posting all of the info for a user connection
  $scope.subscribeTips = function(tipster){
    $http.post('/user_connections.json', {
      user_connection: {
        tipster_id: tipster.id, 
        tipster_name: tipster.name, 
        customer_id: $scope.currentUser.id, 
        customer_name: $scope.currentUser.name, 
        following: $scope.followingDefault
      }}).success(function(data){
      $http.post('/user_connections/followed_tipster', {
        tipster: {
          tipster_id: tipster.id
        }}).success(function(response){
        $scope.pending = response.data[0];
        $http.get('/users/tipsters').success(function(data) {
          $scope.tipsters = angular.fromJson(data.data) //now the data is objects of user connections
        })
      })
    });
  }

  //accepting the subscription request
  $scope.acceptSubscription = function(connection){
    $http.put('/user_connections/' + connection.id + '.json', {
      connection: {
        following: true
      }}).success(function(data){
      $http.get('/user_connections/subscription_requests').success(function(response){
        $scope.follower = response.data;
      });
    })
  }

  //rejecting the subscription request
  $scope.rejectSubscription = function(connection){
    $http.delete('/user_connections/' + connection.id +'.json', {
      connection:{following:false}})
      .success(function(data){ 
        $http.get('/user_connections/subscription_requests')
        .success(function(response){
          $scope.follower = response.data;          
      });
    });
  };
}]);