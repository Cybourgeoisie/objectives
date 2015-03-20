<?php

namespace Service;

abstract class ServiceClass implements Service
{
	public function call($method, $args)
	{
		$uncallable_methods = array('call');

		// Route the call as necessary
		if (method_exists($this, $method) && !in_array($method, $uncallable_methods))
		{
			return $this->$method($args);
		}
		else
		{
			throw new \Exception('Method (' . $method . ') does not exist');
		}
	}
}
