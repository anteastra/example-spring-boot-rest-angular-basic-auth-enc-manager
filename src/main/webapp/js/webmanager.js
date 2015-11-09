angular.module('webmanager', ['ngRoute', 'ngCookies'])
    .config(function ($routeProvider, $httpProvider) {

        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        }).when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        }).when('/brand', {
            templateUrl: 'partials/brand.html'
        }).otherwise('/');

        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    })
    .controller('LoginController', function ($rootScope, $scope, $http, $location, $cookieStore) {
        $scope.rememberMe = false;
        $scope.login = function () {
            console.log("Login with credentials " + $scope.username + ":" + $scope.password);
            var headerAuthData = {
                authorization: "Basic "
                + btoa($scope.username + ":" + $scope.password)
            };

            $http.get('/user', {headers: headerAuthData}).success(function (data) {
                if (data.name) {
                    $rootScope.authenticated = true;
                    $rootScope.user = data;
                    $rootScope.headerAuthData = headerAuthData;
                    console.log("User object recieved: " + $rootScope.user);
                    if ($scope.rememberMe) {
                        $cookieStore.put('headerAuthData', headerAuthData);
                    }
                    $location.path("/home");
                } else {
                    $rootScope.authenticated = false;
                }
            }).error(function () {
                $rootScope.authenticated = false;
            });
        };
    })
    .controller('HomeController', function ($scope, $http) {
        $http.get('/resource/').success(function (data) {
            $scope.greeting = data;
        })
    }).run(function ($rootScope, $location, $cookieStore, $http) {

    /* Try getting valid user from cookie or go to login page */
    var originalPath = $location.path();
    var headerAuthData = $cookieStore.get('headerAuthData');
    if (headerAuthData === undefined) {
        $location.path("/login");
    } else {
        $http.get('/user', {headers: headerAuthData}).success(function (data) {
            if (data.name) {
                $rootScope.authenticated = true;
                $rootScope.user = data;
                console.log("User object recieved: " + $rootScope.user);
                $rootScope.headerAuthData = headerAuthData;
                $location.path("/home");
            } else {
                $rootScope.authenticated = false;
            }
        }).error(function () {
            $rootScope.authenticated = false;
        });
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