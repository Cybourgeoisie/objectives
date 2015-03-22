(function() {
	angular.module('services').factory('taskFactory', [
	'$http', 'notifications', '$rootScope',
	function($http, notifications, $rootScope)
	{
		var Task = function(obj)
		{
			var data = {
				'objective_id' : null,
				'name'         : '',
				'description'  : '',
				'complete'     : false
			};

			if (obj)
			{
				var newTask = createTask(obj);

				for (var prop in newTask)
				{
					if (obj.hasOwnProperty(prop) && data.hasOwnProperty(prop))
					{
						data[prop] = obj[prop];
					}
				}
			}

			function createTask(obj)
			{
				// Format the input
				var inputData = {};
				if (obj instanceof Object)
				{
					for (var prop in obj)
					{
						if (obj.hasOwnProperty(prop))
						{
							inputData[prop] = obj[prop];
						}
					}
				}

				if (!inputData.objective_id)
				{
					notifications.error(
						'Failed to Add Goal', 
						'Your goal was not attached to an objective',
						{ duration: -1 }
					);
					return;
				}

				// Submit the creation request
				$http.post('./api/task/create', inputData).
					success(createTaskSuccess).
					error(function(data, status, headers, config)
					{
						notifications.error(
							'Failed to Create Goal', 
							'Your goal could not be created.',
							{ duration: -1 }
						);
					});

				return inputData;

				function createTaskSuccess(data, status, headers, config)
				{
					// Validate outcome
					if (data.success && data.task)
					{
						notifications.success(
							'Goal Created', 
							'Your goal has been created!',
							{ duration: 4000 }
						);

						// Add the goal to the UI
						$rootScope.$emit('new_task', data.task.task_id);
					}
					else
					{
						notifications.error(
							'Failed to Create Goal', 
							'Your goal could not be created.',
							{ duration: -1 }
						);
					}
				}
			}

			function set(key, value)
			{
				if (data.hasOwnProperty(key))
				{
					data[key] = value;
				}
			}

			function get(key)
			{
				if (data.hasOwnProperty(key))
				{
					return data[key];
				}
			}

			function isComplete()
			{
				return get('complete');
			}

			return {
				'get'        : get,
				'set'        : set,
				'isComplete' : isComplete
			};
		};

		return {
			create: function(data) { return new Task(data); }
		};
	}]);
})();
