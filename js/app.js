var discussionBoardApp = angular.module('discussionBoardApp', ['ngRoute', 'discussionBoardControllers', 'discussionBoardServices']);

discussionBoardApp.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['Token'] = '089036ca24923721ef5d339e59504370006691dc11de19d6219b46579e68bc8879f8041f4bb1474907586424540b3e101a678846c5405efa313dcce21ba15347';
});

discussionBoardApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'html/main.html',
            controller: 'mainController'
        })
        .when('/thread/:thread_id', {
            templateUrl: 'html/thread.html',
            controller: 'threadController'
        });
});
