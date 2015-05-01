<?php

namespace Service;

class User extends ServiceClass
{
	/** 
	 * Create a new user
	 */
	public function create($username, $password)
	{
		$user_obj = new \User();
		$result = $user_obj->create($username, $password);
		return $result;
	}

	public function login($username, $password)
	{
		$user_obj = new \User();
		$result = $user_obj->login($username, $password);

		if ($result)
		{
			return self::load();
		}

		return false;
	}

	public function logout()
	{
		\SessionManager::logout();
	
		return true;
	}

	public function load()
	{
		$user_obj = \SessionManager::getUser();
		if (!$user_obj)
		{
			return false;
		}

		// Whitelist the allowed returned parameters
		$user_data = array(
			'name' => $user_obj->name
		);

		// Get the user's objectives
		$objectives = $user_obj->getObjectives();

		// Get all tasks
		foreach ($objectives as &$objective)
		{
			$objective_obj = \Objective::find($objective['objective_id']);
			$objective['tasks'] = $objective_obj->getTasks();
		}

		return array('user' => $user_data, 'objectives' => $objectives);
	}
}
