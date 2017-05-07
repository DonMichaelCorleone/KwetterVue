angular.module('ATP_TWEETS', ['ngWebSocket'])
        .factory('ATP', function ($websocket) {
            // Open a WebSocket connection
            var url = "ws://127.0.0.1:8080/Kwetter/atpendpoint";
            var ws = $websocket(url);

            var atp = [];

            ws.onMessage(function (event) {
                console.log('message: ', event.data);
                var response;
                try {
                    response = angular.fromJson(event.data);
                } catch (e) {
                    console.log('error: ', e);
                    response = {'error': e};
                }
            });
            ws.onError(function (event) {
                console.log('connection Error', event);
            });
            ws.onClose(function (event) {
                console.log('connection closed', event);
            });
            ws.onOpen(function (event) {
                console.log('connection open');
                   console.log(event);
                ws.send('HELLO SERVER');
            });

            return {
                atp: atp,
                status: function () {
                    return ws.readyState;
                },
                send: function (message) {
                    if (angular.isString(message)) {
                        ws.send(message);
                    } else if (angular.isObject(message)) {
                        ws.send(JSON.stringify(message));
                    }
                }
            };
        })
        .controller('tweetController', function ($scope, ATP) {
            $scope.ATP = ATP;

            $scope.submit = function () {
                console.log("Submit called");
                ATP.send("ATP SERVER");
            };

            $scope.submitAll = function () {
                console.log("submitAll called");
                ATP.send("HELLO TO ALL");
            };
        });