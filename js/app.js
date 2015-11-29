var discussionBoardApp = angular.module('discussionBoardApp', ['ngRoute', 'discussionBoardControllers', 'discussionBoardServices']);

discussionBoardApp.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['Token'] = '1b51ec5674cf270ce139236516a09ea2922ab6caac3cc80a84f43006655b5f9b7b7431be33df770a27c78f9cb452bb6b2da84af2edae766f2cdb20cc87c10ea9';
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
