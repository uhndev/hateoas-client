
angular.module('dados.common.services.error', [])
.service('ErrorService', ErrorService);

function ErrorService() {

    this.getInfo = function() {
        var error = {};

        error.hostname = window.location.href;
        error.browser = navigator.userAgent;
        error.currentUser = window.currentUser;

        // tracking you down
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                error.accuracy = position.coords.accuracy;
                error.geolocation = position.coords.latitude+', '+position.coords.longitude;
            });
        }

        // chrome only (so far)
        var mem = window.performance.memory;
        if (mem) {
            mem.usage = Math.ceil((mem.usedJSHeapSize/mem.totalJSHeapSize) * 100).toString() + '%';
            error.memoryDump = mem;
        }

        html2canvas(document.body, {
            onrendered: function(canvas) {
                var ctx = canvas.getContext('2d');
                error.screenshot = canvas.toDataURL("image/png");
            }
        });

        return error;
    };

    this.getScreenshot = function() {
        html2canvas(document.body, {
            onrendered: function(canvas) {
                var ctx = canvas.getContext('2d');
                window.open(canvas.toDataURL("image/png"));
            }
        });
    };
}