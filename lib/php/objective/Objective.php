<?php

class Objective extends ObjectiveModel
{
	public function create($name, $description = '')
	{
		// Get the user
		$user_id  = null;
		$user_obj = \User::getLoggedIn();
		if ($user_obj)
		{
			$user_id = $user_obj->user_id;
		}

		// Create the new objective
		$this->objective_type_id = \ObjectiveType::getIdByName('objective');
		$this->user_id           = $user_id;
		$this->name              = $name;
		$this->save();

		return true;
	}

	public function getTask($task_id)
	{
		if (!$this->objective_id)
		{
			throw new Exception('No objective ID set to object - can\'t retrieve task');
		}

		$sql = '
			SELECT
				task_id,
				objective_id,
				name,
				description,
				parent_id
			FROM
				task
			WHERE
				objective_id = $1 AND task_id = $2 AND status
		';
		$res = \Utility::pgQueryParams($sql, array($this->objective_id, $task_id));
		return $res;
	}

	public function getTasks()
	{
		if (!$this->objective_id)
		{
			throw new Exception('No objective ID set to object - can\'t retrieve tasks');
		}

		$sql = '
			SELECT
				task_id,
				objective_id,
				name,
				description,
				parent_id
			FROM
				task
			WHERE
				objective_id = $1 AND status
			ORDER BY
				"order" ASC, task_id ASC
		';
		$res = \Utility::pgQueryParams($sql, array($this->objective_id));
		if (!$res)
		{
			return array();
		}

		// Collect all subtasks and top-level tasks
		$tasks = array();
		$subtasks = array();
		foreach ($res as $row)
		{
			if ($row['parent_id'])
			{
				$subtasks[$row['parent_id']][] = $row;
			}
			else
			{
				$tasks[$row['task_id']] = $row;
				$tasks[$row['task_id']]['subtasks'] = array();
			}
		}

		// Now iterate through all subtasks and assign to tasks
		foreach ($subtasks as $parent_id => $subtask_array)
		{
			if (!array_key_exists($parent_id, $tasks))
			{
				continue;
			}

			$tasks[$parent_id]['subtasks'] = $subtask_array;
		}

		return array_values($tasks);
	}

	private function checkObjectiveExists($name, $user_id)
	{
		$sql = 'SELECT objective_id FROM objective WHERE name = $1 AND status;';
		$res = \Utility::pgQueryParams($sql, array($name));
		return !!($res && $res[0] && $res[0]['objective_id']);
	}
}
