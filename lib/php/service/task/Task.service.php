<?php

namespace Service;

class Task extends ServiceClass
{
	/** 
	 * Create a new task
	 */
	public function create($objective_id, $name, $description = '')
	{
		$task_obj = new \Task();
		$result = $task_obj->create($objective_id, $name, $description);

		if (!$result)
		{
			throw new Exception('Could not create task');
		}

		return array('task' => $task_obj->toArray());
	}

	/** 
	 * Create a new subtask
	 */
	public function createSubtask($objective_id, $task_id, $name, $description = '')
	{
		$task_obj = new \Task();
		$result = $task_obj->createSubtask($objective_id, $task_id, $name, $description);

		if (!$result)
		{
			throw new Exception('Could not create subtask');
		}

		return array('task' => $task_obj->toArray());
	}

	public function edit($objective_id, $task_id, $name, $description = '')
	{
		// Ensure we have an active user
		$user_obj = \SessionManager::getUser();
		if (!$user_obj)
		{
			throw new Exception('Can\'t delete a task - not logged in.');
		}

		// Get objective and task, determine that the task belongs to the objective, and that the user can delete it
		$task_obj = \Task::find($task_id);
		if ($task_obj && $task_obj->objective_id && $task_obj->objective_id == $objective_id)
		{
			$objective_obj = \Objective::find($objective_id);

			// As long as the user has access to edit the task..
			if ($objective_obj->user_id == $user_obj->user_id)
			{
				// Then edit the task
				$task_obj->name = $name;
				$task_obj->description = $description;
				$task_obj->save();

				return true;
			}
		}

		return false;
	}

	public function delete($objective_id, $task_id)
	{
		// Ensure we have an active user
		$user_obj = \SessionManager::getUser();
		if (!$user_obj)
		{
			throw new Exception('Can\'t delete a task - not logged in.');
		}

		// Get objective and task, determine that the task belongs to the objective, and that the user can delete it
		$task_obj = \Task::find($task_id);
		if ($task_obj && $task_obj->objective_id && $task_obj->objective_id == $objective_id)
		{
			$objective_obj = \Objective::find($objective_id);

			if ($objective_obj->user_id == $user_obj->user_id)
			{
				$task_obj->delete();
				return true;
			}
		}

		return false;
	}

	public function complete($objective_id, $task_id)
	{
		// Ensure we have an active user
		$user_obj = \SessionManager::getUser();
		if (!$user_obj)
		{
			throw new Exception('Can\'t complete a task - not logged in.');
		}

		// Get objective and task, determine that the task belongs to the objective, and that the user can complete it
		$task_obj = \Task::find($task_id);
		if ($task_obj && $task_obj->objective_id && $task_obj->objective_id == $objective_id)
		{
			$objective_obj = \Objective::find($objective_id);

			if ($objective_obj->user_id == $user_obj->user_id)
			{
				$task_obj->complete();
				return true;
			}
		}

		return false;
	}

	public function uncomplete($objective_id, $task_id)
	{
		// Ensure we have an active user
		$user_obj = \SessionManager::getUser();
		if (!$user_obj)
		{
			throw new Exception('Can\'t revert a task - not logged in.');
		}

		// Get objective and task, determine that the task belongs to the objective, and that the user can uncomplete it
		$task_obj = \Task::find($task_id);
		if ($task_obj && $task_obj->objective_id && $task_obj->objective_id == $objective_id)
		{
			$objective_obj = \Objective::find($objective_id);

			if ($objective_obj->user_id == $user_obj->user_id)
			{
				$task_obj->uncomplete();
				return true;
			}
		}

		return false;
	}
}
