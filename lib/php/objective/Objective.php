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
				description
			FROM
				task
			WHERE
				objective_id = $1 AND status
		';
		$res = \Utility::pgQueryParams($sql, array($this->objective_id));
		return $res;
	}

	private function checkObjectiveExists($name, $user_id)
	{
		$sql = 'SELECT objective_id FROM objective WHERE name = $1 AND status;';
		$res = \Utility::pgQueryParams($sql, array($name));
		return !!($res && $res[0] && $res[0]['objective_id']);
	}
}
