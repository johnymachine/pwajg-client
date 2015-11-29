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
