
(function () {
    'use strict';

    angular
        .module('shlink')
        .factory('ServerService', [
            'localStorageService',
            'UuidGenerator',
            ServerService
        ]);

    function ServerService (localStorageService, UuidGenerator) {
        return {
            createFromForm: createFromForm,
            list: list,
            getById: getById,
            deleteById: deleteById,

            getCurrent: getCurrent,
            setCurrent: setCurrent
        };

        /**
         *
         * @param $form
         * @returns {{id: string, name: *, url: *, apiKey: *}}
         */
        function createFromForm ($form) {
            var servers = localStorageService.get('servers') || {},
                id = UuidGenerator.generateV4Uuid(),
                newServer = {
                    id: id,
                    name: $form.find('[name=name]').val(),
                    url: $form.find('[name=url]').val(),
                    apiKey: $form.find('[name=apiKey]').val()
                };

            servers[id] = newServer;
            localStorageService.set('servers', servers);

            return newServer;
        }

        /**
         *
         * @returns {{}}
         */
        function list () {
            return localStorageService.get('servers') || {};
        }

        /**
         *
         * @param serverId
         * @returns {null}
         */
        function getById (serverId) {
            var servers = list();
            return typeof servers[serverId] !== 'undefined' ? servers[serverId] : null;
        }

        /**
         *
         * @param serverId
         */
        function deleteById (serverId) {
            var servers = list();
            if (typeof servers[serverId] !== 'undefined') {
                delete servers[serverId];
                localStorageService.set('servers', servers);
            }
        }


        function getCurrent () {
            return localStorageService.get('current_server');
        }

        function setCurrent (server) {
            var theServer;

            theServer = typeof server !== 'object' ? getById(server) : server;
            localStorageService.set('current_server', theServer);
            localStorageService.set('token', null);
        }
    }
})();
