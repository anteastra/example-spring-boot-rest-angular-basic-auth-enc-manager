/**
 * Created by anteastra on 10.11.2015.
 */
angular.module('webmanager')
    .controller('HomeController', function ($scope, $http) {
        $http.get('/resource/').success(function (data) {
            $scope.greeting = data;
        })
    });