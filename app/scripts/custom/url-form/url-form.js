/* global Tc,NProgress */
(function ($) {
    'use strict';
    Tc.Module.Url = Tc.Module.extend({
        on: function (callback) {
            var $ctx = this.$ctx,
                mod = this,
                $url = $ctx.find('#url'),
                lastUrl;
            $ctx.on('submit auto', function (e) {
                var data,
                    eventType = e.type,
                    url = $.trim($url.val());
                e.preventDefault();
                if (url === lastUrl) {
                    return;
                }
                if (!mod.validateInput($url, url)) {
                    $url.focus();
                    mod.fire('Track', {
                        'data': ['send', 'event', 'map', 'error', url, eventType]
                    });
                    return;
                }
                lastUrl = url;
                data = {
                    'url': url
                };
                NProgress.start();
                $.ajax({
                    data: data,
                    method: 'POST',
                    dataType: 'json',
                    url: $ctx.attr('action')
                }).error(function (response) {
                    // kaputt
                    NProgress.done();
                    mod.fire('Error', response);
                    mod.fire('ShowAlert', response);
                    mod.fire('Track', {
                        'data': ['send', 'event', 'map', 'error', url, eventType]
                    });
                }).success(function (response) {
                    NProgress.done();
                    mod.fire('RemoveAlert');
                    mod.fire('Track', {
                        'data': ['send', 'event', 'map', 'success', url, eventType]
                    });
                    response.url = data.url;
                    mod.fire('DataReceived', response);
                });
            });

            this.sandbox.subscribe('Tracking', this);
            callback();
        },
        after: function () {
            var $ctx = this.$ctx,
                $url = $ctx.find('#url');
            if (window.location.search.indexOf('?url=') === 0) {
                $url = $ctx.find('#url');
                $url.val(window.location.search.substring(5));
                $ctx.trigger('auto');
            }
        },
        validateInput: function ($url, url) {
            var config = this.sandbox.getConfig();
            if (this.isUrlValid(url)) {
                $url.removeClass(config.classNames.error).addClass(config.classNames.success);
                return true;
            } else {
                $url.addClass(config.classNames.error).removeClass(config.classNames.success);
                return false;
            }
        },
        isUrlValid: function (url) {
            var re = new RegExp("^(http|https)://www.tripadvisor.", "i");
            return re.test(url);
        }
    });
})(Tc.$);