angular.module('UserCtrl', []).controller('UserController', 
    function ($scope, $rootScope, $location, UserService, mySocket) {

        // console.log('what up');
        //   mySocket.emit('my other event', { my: 'data' });
        //   mySocket.on('news', function (data) {
        //     console.log(data);
        //     mySocket.emit('my other event', { my: 'data' });
        //   });
        $scope.init = function() {
            UserService.postData({})
            .then(
                function(response) {
                    if(response.data.message) {
                        console.log(response.data.message);
                    }
                    else {
                        mySocket.emit('log in', response.data);
                        $scope.currentUser = angular.copy(response.data);
                        $rootScope.isLoggedin = true;
                        switch($rootScope.user.role) {
                            case 1:
                                $location.path('/admin');
                                break;
                            case 2:
                                $location.path('/sales');
                                break;
                            case 3:
                                $location.path('/inventory');
                                break;
                            default:
                                $location.path('/login');
                                break;
                        }
                    }
                },
                function(response) {

                }
            );
        };
        
        $scope.submit = function(loginData) {

            UserService.postData(loginData)
            .then (
                function(r) {
                    mySocket.emit('log in', r.data);
                    //console.log("emitted");
                    $rootScope.currentUser = angular.copy(r.data);
                    $rootScope.isLoggedin = true;
                    switch($rootScope.currentUser.role) {
                        case 1:
                            $location.path('/admin');
                            break;
                        case 2:
                            $location.path('/sales');
                            break;
                        case 3:
                            $location.path('/inventory');
                    }
                },
                function () {
                    alert('failed')
                }
            );
        }

    }
);