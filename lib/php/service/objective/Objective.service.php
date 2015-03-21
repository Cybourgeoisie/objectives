<?php

namespace Service;

class Objective extends ServiceClass
{
	/** 
	 * Create a new objective
	 */
	public function create($name, $description = '')
	{
		// Get the user
		//$user_obj = \User::getLoggedIn();

		// Validate that the username doesn't already exist
		//if ($this->checkObjectiveExists($name, $user_obj->user_id))
		//{
		//	throw new \Exception('Objective already exists');
		//}

		// Create the new objective
		$objective_obj                    = new \Objective();
		$objective_obj->objective_type_id = \ObjectiveType::getIdByName('objective');
		//$objective_obj->user_id           = $user_obj->user_id;
		$objective_obj->name              = $name;
		$objective_obj->save();

		return array('objective' => $objective_obj->toArray());
	}

	public function get($objective_id)
	{
		// Get the objective
		$objective_obj = \Objective::find($objective_id);

		if (!$objective_obj)
		{
			throw new Exception('Could not find objective');
		}

		return $objective->toArray();
	}

	private function checkObjectiveExists($name, $user_id)
	{
		$sql = 'SELECT objective_id FROM objective WHERE name = $1 AND status;';
		$res = \Utility::pgQueryParams($sql, array($name));
		return !!($res && $res[0] && $res[0]['objective_id']);
	}
}
