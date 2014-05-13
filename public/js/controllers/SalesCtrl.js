angular.module('SalesCtrl', [])
    .controller('SalesController',
        function ($scope, $http, $rootScope, $location, limitToFilter, SalesService, UserService, mySocket) {


            //mySocket.emit('my other event', { my: 'data' });
            mySocket.on('notification', function (data) {
                console.log("messageId");
                console.log(data.quantity);
                console.log("in notification:")
                console.log(data);
                $("#notifications").append('<li class="list-group-item' + ' ' + data.title + '"> <b>' + data.quantity + '</b> of a new item <b>' + data.name + '</b> was added to the inventory for: $<b>' + data.price + '</b></li>');
            });

            $scope.init = function () {
                UserService.postData({})
                    .then(
                        function (response) {
                            //console.log(response.data, "from user service post");
                            if (response.data.message) {
                                //console.log(response.data.message);
                                $location.path('/login');
                            } else {

                                $scope.currentUser = angular.copy(response.data);
                                switch (response.data.role) {

                                case 1:
                                    $location.path('/admin');
                                    break;
                                case 2:
                                    $scope.showAllPendingOrders();
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
                        function (response) {

                        }
                );

            };

            $scope.showAllPendingOrders = function () {

                $scope.showAddCustomer = false;
                $scope.showResult = false;
                $scope.showOrder = false;
                $scope.disableAddButton = false;
                $scope.showSearchProduct = false;
                $scope.showSearchCustomer = true;
                $scope.showCustomerDetails = false;
                

                SalesService.getPendingOrders()
                .then(
                    function (response) {
                        console.log('Got Pending Orders', response.data);
                        if(response.data.length !== 0) {
                            $scope.showPendingOrders = true;
                            $scope.pendingOrders = [];
                            $scope.pendingOrders = angular.copy(response.data);
                        }
                        
                    },
                    function (response) {

                    }
                );
            };
 
            $scope.getPendingOrder = function (order) {
                console.log(order.customerId,"customer id");
                SalesService.getCustomer(order.customerId)
                    .then(
                        function (response) {
                            $scope.customer = angular.copy(response.data);
                            console.log('Got Customer details', $scope.customer);

                            $scope.showSearchProduct = true;
                            $scope.showCustomerDetails = true;
                            $scope.showPendingOrders = false;
                            $scope.showAddCustomer = false;
                            $scope.showPendingOrders = false;
                            $scope.showOrder = true;
                            $scope.orderFinalized = false;
                            $scope.orders = [];
                            $scope.orders = angular.copy(order.products);
                            console.log("Got order details", $scope.orders);


                        },
                        function (response) {

                        }
                );
            };

            $scope.searchCustomers = function (customerName) {

                return SalesService.getCustomers(customerName)
                    .then(
                        function (response) {
                            if (response.data.message) {
                                //console.log(response.data.message);
                            } else {

                                if (jQuery.isEmptyObject($scope.customers)) {
                                    $scope.customers = [];
                                }
                                $scope.customers = angular.copy(jQuery.unique(response.data));
                                return $scope.customers;
                            }

                        },
                        function (response) {
                            //console.log(response.data);
                        }
                    );
            };

            $scope.initiateNewOrder = function ($item) {

                // console.log($item, "customer persumably");
                if (jQuery.isEmptyObject($scope.customer)) {
                    $scope.customer = angular.copy($item);
                    $scope.orders = [];
                    $scope.showOrder = false;
                    $scope.showSearchProduct = true;
                    $scope.showCustomerDetails = true;
                    $scope.showPendingOrders = false;
                    $scope.showAddCustomer = false;
                }
                else {
                    $scope.customer = {};
                    $scope.initiateNewOrder($item);
                }

            };
            $scope.searchCustomer = function (customerId) {
                SalesService.getCustomer(customerId)
                    .then(
                        function (response) {
                            //console.log(response.data);
                            angular.copy(response.data, $scope.customer);
                        },
                        function (response) {

                        }
                );
            };
            $scope.saveCustomer = function () {
                console.log('saving customer');
                SalesService.editCustomer($scope.customer)
                    .then(
                        function (response) {
                            if (response.data.message) {
                                console.log("Message from Server",response.data[0].message);
                                // do some alert
                                angular.copy(response.data[0].message, $scope.alert);
                                alert("customer saved");
                            }
                        },
                        function (response) {

                        }
                );
            };

            $scope.removeCustomer = function () {
                $scope.customer = {};
                //console.log($scope.customerQuery);
                // if ($scope.customerQuery.length === 0) {
                //   $scope.customer = {};
                // }
            }
            

            $scope.addCustomer = function () {
                $scope.newCustomerMaster = angular.copy($scope.newCustomer);
                //console.log($scope.newCustomerMaster);
                SalesService.addCustomer($scope.newCustomerMaster)
                    .then(
                        function (response) {
                            if (response.data.message) {
                                //alert message
                                //console.log(response.data.message);
                                $scope.showPendingOrders = true;
                                $scope.showAddCustomer = false;
                            } else {
                                $scope.newCustomerMaster = {}
                                $scope.reset();
                                //console.log("new customer added")

                            }

                        },
                        function (response) {
                            console.log("failed");
                        }
                );
            };

            $scope.reset = function () {
                $scope.newCustomer = angular.copy($scope.newCustomerMaster);
            };

            $scope.searchItem = function (query) {
                if (query.length > 0) {
                    SalesService.getProducts(query)
                        .then(
                            function (response) {

                                //console.log(response.data, "res data from search item");
                                $scope.products = [];
                                _.each(response.data, function (product) {
                                    var flag = false;
                                    for (var i = 0; i < $scope.orders.length; i++) {
                                        if ($scope.orders[i].upc === product.upc) {
                                            flag = true;
                                        }
                                    }
                                    if (!flag) {
                                        $scope.products.push(product);
                                    }
                                });
                                console.log($scope.products,"procucts updated");
                                $scope.showResult = true;

                            },
                            function () {
                                alert('failed');
                            }
                    );
                } else {
                    $scope.showResult = false;
                }
            };

            $scope.showAddCustomerForm = function () {
                $scope.showAddCustomer = !$scope.showAddCustomer;
                $scope.showOrder = false;
                $scope.showResult = false;
                $scope.showPendingOrders = false;
                $scope.showSearchProduct = false;
                $scope.showCustomerDetails = false;
            };

            $scope.addProductToOrder = function ($item) {
                $scope.orders.push($item);
                console.log($scope.grandTotal());
                var newItem = {
                    customerId: $scope.customer._id,
                    comment: "",
                    totalPrice: $scope.grandTotal(),
                    upc: $item.upc,
                    productName: $item.name,
                    quantity: $item.quantity,
                    customerName: $scope.customer.firstName + ' ' + $scope.customer.lastName,
                    price: $item.price
                };

                $scope.showOrder = true;
                

                SalesService.addToOrder(newItem)
                    .then(
                        function (response) {
                            var send = {};
                            angular.copy(newItem, send);
                            send.notifyRole = 3;
                            send.title = "inventory_sold";
                            mySocket.emit('notify', send);

                            $scope.showResult = false;
                            $scope.showOrder = true;
                            //$scope.orders.push(response.data);
                            //alert('data loaded');
                        },
                        function () {
                            alert('failed');
                        }
                );
            };
            $scope.disableButton = function () {
                return false;
            };


            $scope.checkQuantity = function (data, qty) {

                if (data > qty) {
                    return "You cannot exceed the max quantity";
                }
                if (data < 0) {
                    return "You cannot have negative values for quantity";
                }
            };



            $scope.editItem = function (item) {
                console.log("inside editItem with quantity: ", item.quantity);
                var item = {
                    customerId: $scope.customer._id,
                    comment: '',
                    totalPrice: $scope.grandTotal(),
                    upc: item.upc,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    customerName: item.firstName + ' ' + item.lastName
                };

                SalesService.editOrder(item)
                    .then(
                        function (response) {
                            console.log(response.data, "response from server");
                        },
                        function () {
                            alert('failed');
                        }
                );
            };
            // remove item
            $scope.removeItem = function (index, item) {

                $scope.orders.splice(index, 1);
                console.log($scope.orders.length, "orders length *****");
                var item = {
                    customerId: $scope.customer._id,
                    comment: '',
                    totalPrice: $scope.grandTotal(),
                    upc: item.upc,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    customerName: item.firstName + ' ' + item.lastName,
                    closeOrder: $scope.orders.length === 0 ? '1' : '0'
                };

                console.log(item.closeOrder, "close order");
                SalesService.deleteOrder(item)
                    .then(
                        function (response) {

                            if ($scope.orders.length === 0) {
                                $scope.showOrder = false;
                            }
                            // console.log(response.data);
                        },
                        function (response) {
                            console.log(response.data);
                        }
                );
            };

            // add item
            $scope.addItem = function () {
                $scope.inserted = {
                    id: $scope.users.length + 1,
                    name: '',
                    status: null,
                    group: null
                };
                $scope.users.push($scope.inserted);
            };


            $scope.grandTotal = function () {
                var total = 0;
                angular.forEach($scope.orders, function (order) {
                    total += order.quantity * order.price;
                });

                return total;
            }

            $scope.finalize = function () {
                SalesService.finalizeOrder({
                    customerId: $scope.customer._id
                })
                .then(
                    function (response) {
                        $scope.showSearchProduct = false;
                        $scope.orderFinalized = true;
                        $scope.showOrder = false;
                        $scope.showCustomerDetails = false;
                        $scope.customer = {};
                        $scope.orders = [];

                    },
                    function (response) {

                    }
                );
            };
            $scope.logOut = function () {
                UserService.logOut()
                    .then(
                        function (response) {
                            console.log(response.data);
                            $location.path('/login');
                        },
                        function (response) {
                            console.log("something wrong happened", response.data);
                        }
                )
            };

        });