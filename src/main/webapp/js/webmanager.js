angular.module('webmanager', ['ngRoute', 'ngCookies', 'authServices'])
    .run(function ($rootScope, $location, $cookieStore, $http, loginService) {

        /* Try getting valid user from cookie or go to login page */
        var originalPath = $location.path();
        var headerAuthData = $cookieStore.get('headerAuthData');
        if (headerAuthData === undefined) {
            $location.path("/login");
        } else {
            loginService.login(headerAuthData, "/home", false);
            console.log(headerAuthData);
        }

        $rootScope.logout = function() {
            loginService.logout("/login");
        }

    });