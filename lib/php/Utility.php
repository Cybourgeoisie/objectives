<?php

class Utility
{
	/**
	 * Throw exception
	 */
	public static function throwException($msg = null)
	{
		// Get the backtrace from the previous function call
		$backtrace = debug_backtrace();

		// Get the error line
		$backtrace_info = array_shift($backtrace);
		$line = $backtrace_info['line'];

		// Get the class / function info
		$backtrace_info = array_shift($backtrace);
		$class  = $backtrace_info['class'];
		$method = $backtrace_info['function'];

		throw new Exception($class . '::' . $method . '@' . $line . ' - ' . $msg);
	}

	/**
	 * Run a PostgreSQL statement with given parameters
	 */
	public static function pgQueryParams($sql, $params, $suppress = false)
	{
		$postgres_handler = new PostgreSqlHandler();
		return $postgres_handler->pgQueryParams($sql, $params, $suppress);
	}

	/**
	 * Return a formatted result
	 */
	public static function result($success, $message, $data = null)
	{
		return array(
			'success' => !!$success,
			'message' => $msg,
			'data'    => $data
		);
	}
}
