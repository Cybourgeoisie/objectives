(function() {
	var module = angular.module('footer', []);

	module.controller('FooterController', function() { });

	module.directive('appFooter', function()
	{
		return {
			restrict:     "E",
			templateUrl:  "view/footer/footer.html",
			controller:   "FooterController",
			controllerAs: "footerCtrl"
		};
	});
})();
