(function() {
	var module = angular.module('querent', [
		'objective'
	]);

	module.controller('QuerentController', [
	'$rootScope', '$scope', '$location', 'objectiveService', 
	function($rootScope, $scope, $location, objectiveService)
	{
		var randomPlaceholders = [
			'learn a new language',
			'paint a mural',
			'learn an instrument',
			'perform a concert',
			'develop a videogame',
			'start a business',
			'create a resolution',
			'aspire for greatness',
			'write a novella',
			'travel the world',
			'learn quantum mechanics',
			'program a microcontroller',
			'dream big'
		];

		this.randomPlaceholder = randomPlaceholders[Math.floor(Math.random() * randomPlaceholders.length)];

		this.submitObjective = function(objective)
		{
			if (!objective) { return; }

			// Update the objective service
			var id = objectiveService.create(objective);
			$location.path('/objective/' + id);
		}
	}]);

	module.directive('querent', function()
	{
		return {
			restrict: "E",
			templateUrl: "view/querent/querent.html"
		};
	});
})();
