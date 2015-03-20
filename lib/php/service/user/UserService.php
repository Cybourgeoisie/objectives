<?php

class UserService implements Service
{
	public function call($method, $args)
	{
		print "User called " . $method . " with args " . json_encode($args);
	}
}
