var Fiware = Fiware || {};

Fiware.signOut = (function($, undefined) {
  var portals = {
    account: {
      name:      'Account',
      verb:      'GET',
      protocol:  'http',
      path:      '/auth/logout'
    }
  };

  //var match = window.location.hostname.match(/\.(.*)/);

  // If domain exists, we are in production environment,
  // such as account.testbed.fi-ware.org
  var productionCall = function(currentPortal) {
    portalCalls = $.map(portals, function(portal) {
      url = portal.protocol + '://localhost:8000'+ portal.path;

      return $.ajax(url, {
        type: portal.verb,
        crossDomain: true,
        xhrFields: { withCredentials: true },
        error: function() { console.error("Error signing out " + portal.name); }
      });
    });

    deferredCall(portalCalls);
  };

  var deferredCall = function(calls) {
    $.when.apply($, calls).then(
      // success
      finish,
      // fail
      function() {
        if (calls.length === 1) {
          finish();
        } else {
          var unfinished = $.grep(calls, function(call) {
            return call.state() === "pending";
          });

          deferredCall(unfinished);
        }
      });
  };

  var finish = function() {
    // Use window.debugSignOut to debug
    if (window.debugSignOut === undefined) {
      window.location.replace('http://localhost:1028/logout');
    }
  };

  var call = function(currentPortal) {
      productionCall(currentPortal);
  };

  return call;

})(jQuery);