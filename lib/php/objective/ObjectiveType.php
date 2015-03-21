<?php

class ObjectiveType extends Geppetto\GeppettoObject
{
	public static function getIdByName($name)
	{
		$sql = 'SELECT objective_type_id FROM objective_type WHERE name = $1';
		$res = Utility::pgQueryParams($sql, array($name));
		if (!$res || !$res[0] || !$res[0]['objective_type_id'])
		{
			throw new Exception('Could not retrieve objective type ID by name');
		}

		return $res[0]['objective_type_id'];
	}
}
