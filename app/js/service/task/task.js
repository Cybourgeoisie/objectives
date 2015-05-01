(function() {
	angular.module('services').factory('taskFactory', [
		'$http', 'notifications', '$rootScope', 'ngDialog',
		function($http, notifications, $rootScope, ngDialog)
		{
			var Task = function(obj)
			{
				var data = {
					'objective_id' : null,
					'task_id'      : null,
					'name'         : '',
					'description'  : '',
					'complete'     : false,
					'subtasks'     : []
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

				function openAddTaskWindow()
				{
					ngDialog.open({
						template:   'view/task-editor/task-editor.html',
						controller: 'TaskEditorController',
						className:  'ngdialog-theme-default',
						data:       {goal: data, callback: createSubtask}
					});
				}

				function openEditTaskWindow()
				{
					ngDialog.open({
						template:   'view/task-editor/task-editor.html',
						controller: 'TaskEditorController',
						className:  'ngdialog-theme-default',
						data:       {goal: data, task: data, callback: editTask}
					});
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
							//$rootScope.$emit('new_task', data.task.task_id);
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

				function editTask(obj)
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

					if (!inputData.objective_id || !inputData.task_id || !inputData.name)
					{
						notifications.error(
							'Failed to Edit Goal', 
							'Not enough information provided to edit goal',
							{ duration: -1 }
						);
						return;
					}

					// Submit the creation request
					$http.post('./api/task/edit', inputData).
						success(editTaskSuccess).
						error(function(data, status, headers, config)
						{
							notifications.error(
								'Failed to Edit Goal', 
								'Your goal could not be edited.',
								{ duration: -1 }
							);
						});

					return inputData;

					function editTaskSuccess(data, status, headers, config)
					{
						// Validate outcome
						if (data.success)
						{
							notifications.success(
								'Goal Edited', 
								'Your goal has been edited.',
								{ duration: 4000 }
							);

							// Add the goal to the UI
							//$rootScope.$emit('new_task', data.task.task_id);
						}
						else
						{
							notifications.error(
								'Failed to Edit Goal', 
								'Your goal could not be edited.',
								{ duration: -1 }
							);
						}
					}
				}

				function createSubtask(obj, goal)
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

					// Get the objective ID and task ID from the goal
					if (!goal.objective_id || !goal.task_id)
					{
						notifications.error(
							'Failed to Add Task', 
							'Your task was not attached to an objective or goal',
							{ duration: -1 }
						);
						return;
					}
					else
					{
						inputData.objective_id = goal.objective_id;
						inputData.task_id = goal.task_id;
					}

					// Submit the creation request
					$http.post('./api/task/createSubtask', inputData).
						success(createSubtaskSuccess).
						error(function(data, status, headers, config)
						{
							notifications.error(
								'Failed to Create Task', 
								'Your task could not be created.',
								{ duration: -1 }
							);
						});

					return inputData;

					function createSubtaskSuccess(data, status, headers, config)
					{
						// Validate outcome
						if (data.success && data.task)
						{
							notifications.success(
								'Task Created', 
								'Your task has been added!',
								{ duration: 4000 }
							);

							// Add the goal to the UI
							$rootScope.$emit('reload_objective', inputData.objective_id);
						}
						else
						{
							notifications.error(
								'Failed to Create Task', 
								'Your task could not be created.',
								{ duration: -1 }
							);
						}
					}
				}

				function deleteTask()
				{
					if (!data || !data.objective_id || !data.task_id)
					{
						notifications.error(
							'Failed to Remove Goal', 
							'Could not remove the task without objective and task IDs',
							{ duration: -1 }
						);
						return;
					}

					// Format the input
					var inputData = {
						'objective_id' : data.objective_id,
						'task_id'      : data.task_id
					};

					// Submit the creation request
					$http.post('./api/task/delete', inputData).
						success(deleteTaskSuccess).
						error(function(resultData, status, headers, config)
						{
							notifications.error(
								'Failed to Remove Goal', 
								'Your goal could not be removed.',
								{ duration: -1 }
							);
						});

					return inputData;

					function deleteTaskSuccess(resultData, status, headers, config)
					{
						// Validate outcome
						if (resultData.success)
						{
							notifications.success(
								'Goal Removed', 
								'Your goal has been deleted.',
								{ duration: 4000 }
							);

							// Refresh the UI
							$rootScope.$emit('reload_objective', data.objective_id);
						}
						else
						{
							notifications.error(
								'Failed to Remove Goal', 
								'Your goal could not be removed.',
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

				function getSubtasks()
				{
					return get('subtasks');
				}

				return {
					'get'                : get,
					'set'                : set,
					'isComplete'         : isComplete,
					'delete'             : deleteTask,
					'openAddTaskWindow'  : openAddTaskWindow,
					'openEditTaskWindow' : openEditTaskWindow,
					'getSubtasks'        : getSubtasks
				};
			};

			return {
				create: function(data) { return new Task(data); }
			};
		}
	]);
})();
