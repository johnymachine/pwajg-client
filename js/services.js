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
