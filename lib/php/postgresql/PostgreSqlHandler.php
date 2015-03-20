<?php

class PostgreSqlHandler
{
	protected $conn;

	public function __construct()
	{
		$conn_string = 'host=' . DB_HOST . 
			' port=' . DB_PORT . 
			' dbname=' . DB_NAME . 
			' user=' . DB_USER . 
			' password=' . DB_PASS;

		$this->conn = pg_connect($conn_string);
	}

	public function pgQueryParams($sql, $params, $suppress = false)
	{
		// Rewrite query with WHERE INs made happy
		$new_params = array();

		foreach ($params as $index => $param)
		{
			$param_index = count($new_params) + 1;

			if(var_export($param, true) == 'true')
			{
				$param = 'true';
			}
			else if(var_export($param, true) == 'false')
			{
				$param = 'false';
			}

			if (is_array($param) && strpos($sql, '($'.$param_index.')') !== false)
			{
				$sql = str_replace('($'.$param_index.')', '('.implode(', ', $param).')', $sql);

				// Decrement any params in the sql whose index is greater than the current param
				for ($i = $param_index + 1; $i <= count($params) + 1; $i++)
				{
					$sql = str_replace('$'.$i, '$'.($i-1), $sql);
				}
			}
			else
			{
				$new_params[] = $param;
			}
		}

		$params = $new_params;

		// Execute query
		$sqh = pg_query_params($this->conn, $sql, $params);

		if ($sqh)
		{
			$rows = pg_fetch_all($sqh);
			return ($rows ? $rows : array());
		}
		else if (!$suppress)
		{
			$error = pg_last_error($this->conn);
			throw new Exception("Encountered error while executing SQL ($sql): $error");
		}
	}
}
