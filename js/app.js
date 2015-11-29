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
        thread.$save();
        $scope.title = '';
        $scope.body = '';
        $scope.threads = Thread.query();
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
        post.$delete();
        $scope.refreshPosts();
    };

    $scope.newPost = function() {
        var post = new Post();
        post.body = $scope.body;
        post.$save({
            thread_id: $routeParams.thread_id
        });
        $scope.body = '';
        $scope.refreshPosts();
    };

    $scope.deleteThread = function(thread) {
        thread.$delete();
        $location.path('/');
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
