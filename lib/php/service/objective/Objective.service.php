<?php

namespace Service;

class Objective extends ServiceClass
{
	/** 
	 * Create a new objective
	 */
	public function create($name, $description = '')
	{
		$objective_obj = new \Objective();
		$result = $objective_obj->create($name, $description);

		if (!$result)
		{
			throw new Exception('Could not create objective');
		}

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

	public function delete($objective_id)
	{
		// Ensure we have an active user
		$user_obj = \SessionManager::getUser();
		if (!$user_obj)
		{
			throw new Exception('Can\'t delete an objective - not logged in.');
		}

		// Get objective, determine that user can delete it
		$objective_obj = \Objective::find($objective_id);

		if ($objective_obj->user_id == $user_obj->user_id)
		{
			$objective_obj->delete();
			return true;
		}

		return false;
	}
}
