 
var socket=io.connect('http://localhost:3000');

angular.module('gangsTown')
           .factory('ioFactory',function(){
    
    console.log('io factory ready');
   
    return{test:'test'}
 });
                    
  angular.module('gangsTown')
           .controller('masterScreen',function($scope, ioFactory){
               
               
    $scope.places={};
               
     $scope.teams={
    Delfini:{name:'Delfini', cash:200, respect:10, members:[], upgrades:{Radar:true, Spying:true}},
    Svinuchy:{name:'Svinuchy', cash:100, respect:20, members:[], upgrades:{Dog:true}},
         Mafia:{name:'Mafia', cash:100, respect:20, members:[], upgrades:{Dog:true}}
   
};
               
    $scope.upgrades=[];           
               
$scope.yourTeam='Mafia'; 
               
 $scope.icons={flatCash:'attach_money', flowingCash:'hourglass_empty', respect:'flag'};
      
      
      socket.on('start',function(data){
         
         $scope.places=data.places;
          $scope.upgrades=data.upgrades;
          
          $scope.$apply();
          console.log($scope.places); 
      });
      
        socket.on('updInterval',function(data){
         
         $scope.places=data;
        
          $scope.$apply();
          
      });
      
               
           });