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
}
