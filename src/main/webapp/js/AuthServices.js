/**
 * Created by anteastra on 10.11.2015.
 */

var module = angular.module("authServices", []);
module.factory("loginService", function ($rootScope, $http, $cookieStore, $location) {
    return {
        login: function (headerAuthData, successLocation, isForCookies) {
            $http.get('/user', {headers: headerAuthData}).success(function (data) {
                if (data.name) {
                    $rootScope.authenticated = true;
                    $rootScope.user = data;
                    $rootScope.headerAuthData = headerAuthData;
                    console.log("User object recieved:");
                    console.log($rootScope.user);
                    if (isForCookies) {
                        $cookieStore.put('headerAuthData', headerAuthData);
                    }
                    $location.path(successLocation);
                } else {
                    $rootScope.authenticated = false;
                }
            }).error(function () {
                $rootScope.authenticated = false;
            });
        }
    };
});
