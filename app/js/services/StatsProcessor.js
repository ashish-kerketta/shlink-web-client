
(function () {
    'use strict';

    angular
        .module('shlink')
        .factory('StatsProcessor', [
            StatsProcessor
        ]);

    function StatsProcessor () {
        return {
            processOsStats: processOsStats,
            processBrowserStats: processBrowserStats,
            processReferrersStats: processReferrersStats,
            processCountriesStats: processCountriesStats
        };

        function processOsStats (visits) {
            var stats = {},
                data;

            angular.forEach(visits, function (visit) {
                var userAgent = visit.userAgent,
                    os = typeof userAgent === 'undefined' || userAgent === null ? 'Others' : osFromUserAgent(userAgent);

                stats[os] = typeof stats[os] === 'undefined' ? 1 : stats[os] + 1;
            });

            data = [];
            angular.forEach(stats, function (value) {
                data.push(value);
            });

            return {
                labels: Object.keys(stats),
                data: data
            };
        }

        function processBrowserStats (visits) {
            var stats = {},
                data;

            angular.forEach(visits, function (visit) {
                var userAgent = visit.userAgent,
                    browser = typeof userAgent === 'undefined' || userAgent === null ?
                        'Others' :
                        browserFromUserAgent(userAgent);

                stats[browser] = typeof stats[browser] === 'undefined' ? 1 : stats[browser] + 1;
            });

            data = [];
            angular.forEach(stats, function (value) {
                data.push(value);
            });

            return {
                labels: Object.keys(stats),
                data: data
            };
        }

        function processReferrersStats (visits) {
            var stats = {},
                data;

            angular.forEach(visits, function (visit) {
                var referer;

                if (typeof visit.referer === 'undefined' || visit.referer === null) {
                    if (typeof stats['Unknown'] === 'undefined') {
                        stats['Unknown'] = 1;
                    } else {
                        stats['Unknown'] += 1;
                    }
                    return;
                }

                referer = extractDomain(visit.referer);
                if (typeof stats[referer] === 'undefined') {
                    stats[referer] = 1;
                } else {
                    stats[referer] += 1;
                }
            });

            data = [];
            angular.forEach(stats, function (value) {
                data.push(value);
            });

            return {
                labels: Object.keys(stats),
                data: data
            };
        }

        function processCountriesStats (visits) {
            var stats = {},
                data;

            angular.forEach(visits, function (visit) {
                var country;

                if (typeof visit.visitLocation === 'undefined' || visit.visitLocation === null) {
                    if (typeof stats['Unknown'] === 'undefined') {
                        stats['Unknown'] = 1;
                    } else {
                        stats['Unknown'] += 1;
                    }
                    return;
                }

                country = visit.visitLocation.countryName;
                if (typeof stats[country] === 'undefined') {
                    stats[country] = 1;
                } else {
                    stats[country] += 1;
                }
            });

            data = [];
            angular.forEach(stats, function (value) {
                data.push(value);
            });

            return {
                labels: Object.keys(stats),
                data: data
            };
        }
    }

    /**
     *
     * @param {String} userAgent
     * @returns {String}
     */
    function osFromUserAgent (userAgent) {
        userAgent = userAgent.toLowerCase();

        switch (true) {
            case (userAgent.indexOf('linux') >= 0):
                return 'Linux';
            case (userAgent.indexOf('windows') >= 0):
                return 'Windows';
            case (userAgent.indexOf('mac') >= 0):
                return 'MacOS';
            case (userAgent.indexOf('mobi') >= 0):
                return 'Mobile';
            default:
                return 'Others';
        }
    }

    /**
     *
     * @param {String} userAgent
     * @returns {String}
     */
    function browserFromUserAgent (userAgent) {
        userAgent = userAgent.toLowerCase();

        switch (true) {
            case (userAgent.indexOf('firefox') >= 0):
                return 'Firefox';
            case (userAgent.indexOf('chrome') >= 0):
                return 'Chrome';
            case (userAgent.indexOf('safari') >= 0):
                return 'Safari';
            case (userAgent.indexOf('opera') >= 0):
                return 'Opera';
            case (userAgent.indexOf('msie') >= 0):
                return 'Internet Explorer';
            default:
                return 'Others';
        }
    }

    /**
     *
     * @param {String} url
     * @returns {String}
     */
    function extractDomain (url) {
        // Find & remove protocol (http, ftp, etc.) and get domain
        var domain = url.indexOf('://') > -1 ? url.split('/')[2] : url.split('/')[0];
        // Find & remove port number
        domain = domain.split(':')[0];

        return domain;
    }
})();
