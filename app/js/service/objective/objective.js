(function() {
	angular.module('services').factory('objectiveFactory', [
		'taskFactory', '$http', 'notifications', '$rootScope',
		function(taskFactory, $http, notifications, $rootScope)
		{
			var Objective = function(input)
			{
				var data = {
					'id'           : 0,
					'objective_id' : 0,
					'name'         : ''
				};

				var id;
				var tasks = [];

				if (input)
				{
					load(input);
				}

				function getProgress()
				{
					var numTasks = countTasks();
					if (numTasks == 0)
					{
						return 0;
					}

					var progress = parseInt(countTasks({'complete': true}) / numTasks);

					return progress;
				}

				function set(key, value)
				{
					if (data.hasOwnProperty(key))
					{
						// Save the ID to this object as well
						if (key == 'id')
						{
							this.id = value;
						}

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

				function getTasks()
				{
					return tasks || [];
				}

				function hasTasks()
				{
					return (tasks && tasks instanceof Array && tasks.length);
				}

				function addTask(task)
				{
					// Append the objective ID to this task
					if (!task.objective_id)
					{
						task.objective_id = data.id;
					}

					var taskObj = taskFactory.create(task);
					tasks.push(taskObj);
				}

				function loadTask(taskData)
				{
					if (!taskData) return;

					var taskObj = taskFactory.create();

					for (var prop in taskData)
					{
						if (taskData.hasOwnProperty(prop))
						{
							taskObj.set(prop, taskData[prop]);
						}
					}

					tasks.push(taskObj);
				}

				function countTasks(opt)
				{
					var bComplete = false;
					if (opt && opt instanceof Object)
					{
						if (opt.hasOwnProperty('complete') && opt.complete)
						{
							bComplete = true;
						}
					}

					// If we have no tasks, return 0
					if (tasks.length == 0)
					{
						return 0;
					}

					var numComplete = 0;
					if (bComplete)
					{
						for (var i = 0; i < tasks.length; i++)
						{
							if (tasks[i].hasOwnProperty('complete') && tasks[i].complete)
							{
								numComplete++;
							}
						}

						return numComplete;
					}

					// Default case - all tasks
					return tasks.length;
				}

				function create(inputData)
				{
					// Format the input
					if (typeof inputData === "string")
					{
						inputData = {
							'name' : inputData
						};
					}

					// Submit the creation request
					$http.post('./api/objective/create', inputData).
						success(createObjectiveSuccess).
						error(function(data, status, headers, config)
						{
							notifications.error(
								'Failed to Create Objective', 
								'Your objective could not be created.',
								{ duration: -1 }
							);
						});

					function createObjectiveSuccess(data, status, headers, config)
					{
						// Validate outcome
						if (data.success && data.objective)
						{
							notifications.success(
								'Objective Created', 
								'Your objective has been created!',
								{ duration: 4000 }
							);

							// Add the objective to the UI
							$rootScope.$emit('new_objective', data.objective.objective_id);
						}
						else
						{
							notifications.error(
								'Failed to Create Objective', 
								'Your objective could not be created.',
								{ duration: -1 }
							);
						}
					}
				}

				function load(input)
				{
					set('id',   input.objective_id);
					set('name', input.name);

					// Clear out any old tasks
					tasks = [];

					if (input.tasks && input.tasks.length)
					{
						for (var j = 0; j < input.tasks.length; j++)
						{
							loadTask(input.tasks[j]);
						}
					}
				}

				function reload()
				{
					var params = {'objective_id' : data.id};

					$http.post('./api/objective/load', params).
						success(reloadCallback).
						error(function(data, status, headers, config)
						{
							notifications.error(
								'Failed to Reload Objective', 
								'Your objective could not be reloaded.',
								{ duration: -1 }
							);
						});

					function reloadCallback(result)
					{
						if (!result || !result.success)
						{
							notifications.error(
								'Failed to Reload Objective', 
								'Your objective could not be reloaded.',
								{ duration: -1 }
							);
							return;
						}

						load(result.objective);
					}
				}

				return {
					'set'         : set,
					'get'         : get,
					'getTasks'    : getTasks,
					'hasTasks'    : hasTasks,
					'addTask'     : addTask,
					'loadTask'    : loadTask,
					'countTasks'  : countTasks,
					'getProgress' : getProgress,
					'create'      : create,
					'reload'      : reload
				};
			};

			function createNewObjective(input)
			{
				return new Objective(input);
			}

			return {
				create: createNewObjective
			};
		}
	]);
})();
