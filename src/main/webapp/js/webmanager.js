angular.module('webmanager', ['ngRoute', 'ngCookies', 'authServices'])
    .run(function ($rootScope, $location, $cookieStore, $http, loginService) {

        /* Try getting valid user from cookie or go to login page */
        var originalPath = $location.path();
        var headerAuthData = $cookieStore.get('headerAuthData');
        if (headerAuthData === undefined) {
            $location.path("/login");
        } else {
            loginService.login(headerAuthData, "/home", false);
            /*
            $http.get('/user', {headers: headerAuthData}).success(function (data) {
                if (data.name) {
                    $rootScope.authenticated = true;
                    $rootScope.user = data;
                    console.log("User object recieved:");
                    console.log($rootScope.user);
                    $rootScope.headerAuthData = headerAuthData;
                    $location.path("/home");
                } else {
                    $rootScope.authenticated = false;
                }
            }).error(function () {
                $rootScope.authenticated = false;
            });*/
            console.log(headerAuthData);
        }

        $rootScope.logout = function () {
            $rootScope.authenticated = false;
            $cookieStore.remove('headerAuthData');
            delete $rootScope.user;
            delete $rootScope.headerAuthData;
            $location.path("/login");

            $http.post('logout', {}).success(function () {
                $rootScope.authenticated = false;
            }).error(function (data) {
                $rootScope.authenticated = false;
            });
        }

    });