/** Message System ************************************************************
 * This code allows for messages to be passed from DADOS prototype code to 
 * jQuery. Here the messages are then converted to AngularJS code. Directives
 * can observe the event and execute the necessary methods.
 ******************************************************************************/
$(document).ready(function() {
	/** Auto Save *************************************************************
	 * Auto Save fired by the Encounter will trigger a save on the child plugin
	 * This requires that a scope be accessible by the body.
	 **************************************************************************/
    $('body').on('autoSave', function(e) {
    	var scope = $('body').scope();
    	if (typeof scope !== 'undefined') {
    		scope.$root.$broadcast('autoSave');
    	}
    });
});