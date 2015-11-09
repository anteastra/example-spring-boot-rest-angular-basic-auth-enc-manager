/**
 * Created by anteastra on 10.11.2015.
 */
angular.module('webmanager')
    .controller('LoginController', function ($scope, loginService) {
        $scope.rememberMe = false;
        $scope.login = function () {
            console.log("Login with credentials " + $scope.username + ":" + $scope.password);
            var headerAuthData = {
                authorization: "Basic "
                + btoa($scope.username + ":" + $scope.password)
            };

            loginService.login(headerAuthData, "/home", $scope.rememberMe);
        };
    });