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

var discussionBoardControllers = angular.module('discussionBoardControllers', ['discussionBoardServices']);

discussionBoardControllers.controller('mainController', function($scope, $location, Thread) {
    $scope.page = 1;
    $scope.pages = [];

    $scope.refreshThreads = function() {
        Thread.query({
            page: $scope.page
        }, function success(data, headers) {
            $scope.threads = data;
            $scope.page = headers('page');
            $scope.pages = [];
            for (var i = 1; i <= headers('pages'); i++) {
                $scope.pages.push(i);
            }
        });
    };

    $scope.visitThread = function(thread) {
        $location.path("/thread/" + thread._id);
    };

    $scope.newThread = function() {
        var thread = new Thread();
        thread.title = $scope.title;
        thread.body = $scope.body;
        thread.$save(
            function success(data, headers) {
                $scope.title = '';
                $scope.body = '';
                $location.path("/thread/" + data._id);
            });
    };

    $scope.goToPage = function(page) {
        console.log(page);
        $scope.page = page;
        $scope.refreshThreads();
    };

    $scope.refreshThreads();
});

discussionBoardControllers.controller('threadController', function($scope, $routeParams, $location, Thread, Post) {
    $scope.page = 1;
    $scope.pages = [];

    $scope.thread = Thread.get({
        id: $routeParams.thread_id
    });

    $scope.refreshPosts = function() {
        Post.query({
            thread_id: $routeParams.thread_id,
            page: $scope.page,
            order: 'asc'
        }, function success(data, headers) {
            $scope.posts = data;
            $scope.page = headers('page');
            $scope.pages = [];
            for (var i = 1; i <= headers('pages'); i++) {
                $scope.pages.push(i);
            }
        });
    };

    $scope.deletePost = function(post) {
        post.$delete(function success(data, headers) {
            $scope.refreshPosts();
        });
    };

    $scope.newPost = function() {
        var post = new Post();
        post.body = $scope.body;
        post.$save({
            thread_id: $routeParams.thread_id
        }, function success(data, headers) {
            $scope.body = '';
            $scope.refreshPosts();
        });
    };

    $scope.deleteThread = function(thread) {
        thread.$delete(function success(data, headers) {
            $location.path('/');
        });
    };

    $scope.refreshPosts();
});

discussionBoardControllers.controller('authController', function($scope, Auth) {
    $scope.auth = Auth.get();
});

var discussionBoardServices = angular.module('discussionBoardServices', ['ngResource']);

//http://pwajg-server.herokuapp.com/apiv1
discussionBoardServices.factory('Thread', function($resource) {
    return $resource('http://pwajg-server.herokuapp.com/apiv1/threads/:id/', {
        id: '@_id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            param: {
                page: 1
            }
        }
    });
});

discussionBoardServices.factory('Post', function($resource) {
    return $resource('http://pwajg-server.herokuapp.com/apiv1/posts/:id/', {
        id: '@_id'
    }, {
        query: {
            url: 'http://pwajg-server.herokuapp.com/apiv1/threads/:thread_id/posts',
            method: 'GET',
            isArray: true,
            param: {
                thread_id: '@_thread',
                page: 1,
                order: 'desc'
            }
        },
        save: {
            url: 'http://pwajg-server.herokuapp.com/apiv1/threads/:thread_id/posts',
            method: 'POST',
            param: {
                thread_id: '@_thread'
            }
        },
    });
});

discussionBoardServices.factory('Auth', function($resource) {
    return $resource('http://pwajg-server.herokuapp.com/apiv1/auth/');
});
