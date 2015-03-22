<?php

class TaskType extends Geppetto\GeppettoObject
{
	public static function getIdByName($name)
	{
		$sql = 'SELECT task_type_id FROM task_type WHERE name = $1';
		$res = Utility::pgQueryParams($sql, array($name));
		if (!$res || !$res[0] || !$res[0]['task_type_id'])
		{
			throw new Exception('Could not retrieve task type ID by name');
		}

		return $res[0]['task_type_id'];
	}
}
