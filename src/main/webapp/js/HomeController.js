/**
 * Created by anteastra on 10.11.2015.
 */
angular.module('webmanager')
    .controller('HomeController', function ($scope, $http, $location) {
        $http.get('/resource/').success(function (data) {
            $scope.greeting = data;
        })

        $scope.refresh = function () {
            console.log("refresh");
            $scope.items = [{ id: 0, name: "Encoder 1", URL: "localhost:8090" }, { id: 1, name: "Encoder 2", URL: "localhost:8091" }, { id: 1, name: "Encoder 3", URL: "localhost:8092" }];
        }

        $scope.create = function (item) {
            $scope.items.push(item);
            $location.path("/home");
        }

        $scope.update = function (item) {
            for (var i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].id == item.id) {
                    $scope.items[i] = item;
                    break;
                }
            }
            $location.path("/home");
        }

        $scope.delete = function (item) {
            console.log(item);
            $scope.items.splice($scope.items.indexOf(item), 1);
            $location.path("/home");
        }

        $scope.editOrCreate = function (item) {
            $scope.currentItem = item ? angular.copy(item) : {};
            $location.path("/editEncoder");
        }

        $scope.saveEdit = function (item) {
            if (angular.isDefined(item.id)) {
                $scope.update(item);
            } else {
                $scope.create(item);
            }
        }

        $scope.cancelEdit = function () {
            $scope.currentItem = {};
            $location.path("/home");
        }

        $scope.refresh();
    });