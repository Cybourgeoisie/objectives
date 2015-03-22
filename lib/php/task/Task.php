<?php

class Task extends ObjectiveModel
{
	public function create($objective_id, $name, $description = '')
	{
		$objective_obj = \Objective::find($objective_id);
		if (!$objective_obj)
		{
			throw new Exception('Could not find objective');
		}

		// Create the new task
		$this->task_type_id = \TaskType::getIdByName('goal');
		$this->name         = $name;
		$this->objective_id = $objective_obj->objective_id;
		$this->save();

		return true;
	}

	private function checkTaskExists($name, $objective_id)
	{
		$sql = 'SELECT task_id FROM task WHERE name = $1 AND objective_id = $2 AND status;';
		$res = \Utility::pgQueryParams($sql, array($name, $objective_id));
		return !!($res && $res[0] && $res[0]['task_id']);
	}
}
