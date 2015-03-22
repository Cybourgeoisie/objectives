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
}
