angular.module('webmanager', ['ngRoute', 'ngCookies'])
    .config(function ($routeProvider, $httpProvider) {

        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        }).when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        }).otherwise('/');

        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    })
    .controller('LoginController', function ($rootScope, $scope, $http, $location, $cookieStore) {
        $scope.rememberMe = false;
        $scope.login = function () {
            $rootScope.credentials = {};
            $rootScope.credentials.username = $scope.username;
            $rootScope.credentials.password = $scope.password;
            console.log($scope.username + " " + $scope.password);
            var headerAuthData = {
                authorization: "Basic "
                + btoa($rootScope.credentials.username + ":" + $rootScope.credentials.password)
            };

            $http.get('/user', {headers: headerAuthData}).success(function (data) {
                if (data.name) {
                    $rootScope.authenticated = true;
                    $rootScope.user = data;
                    console.log($rootScope.user);
                    $rootScope.headerAuthData = headerAuthData;
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
    })
    .controller('navigation', function ($rootScope, $scope, $http, $location, $cookieStore) {

        var authenticate = function (credentials, callback) {

            var headers = credentials ? {
                authorization: "Basic "
                + btoa(credentials.username + ":" + credentials.password)
            } : {};

            $http.get('/user', {headers: headers}).success(function (data) {
                if (data.name) {
                    $rootScope.authenticated = true;
                } else {
                    $rootScope.authenticated = false;
                }
                callback && callback();
            }).error(function () {
                $rootScope.authenticated = false;
                callback && callback();
            });

        }

        authenticate();
        $scope.credentials = {};
        $scope.login = function () {
            authenticate($scope.credentials, function () {
                if ($rootScope.authenticated) {
                    $location.path("/");
                    $scope.error = false;
                } else {
                    $location.path("/old-login");
                    $scope.error = true;
                }
            });
        };
        $scope.logout = function () {
            $rootScope.authenticated = false;
            $cookieStore.remove('headerAuthData');
            $rootScope.user = undefined;
            $rootScope.headerAuthData = undefined;
            $location.path("/login");

            $http.post('logout', {}).success(function () {
                $rootScope.authenticated = false;
            }).error(function (data) {
                $rootScope.authenticated = false;
            });
        }
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
                console.log($rootScope.user);
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

});