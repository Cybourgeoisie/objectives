<?php

namespace Service;

class User extends ServiceClass
{
	public function funky($args)
	{
		print "User called funky method with args " . json_encode($args) . "\r\n\r\n";

		return array('psych!');
	}

	public function create($args)
	{
		// Validate the input
		if (count($args) != 2)
		{
			throw new Exception('Invalid parameters');
		}

		return $this->createUser($args[0], $args[1]);
	}

	public function login($args)
	{
		// Validate the input
		if (count($args) != 2)
		{
			throw new Exception('Invalid parameters');
		}

		return $this->loginUser($args[0], $args[1]);
	}

	/** 
	 * Create a new user
	 */
	protected function createUser($username, $password)
	{
		// Validate that the username doesn't already exist
		if ($this->checkUsernameExists($username))
		{
			throw new \Exception('Username already exists');
		}

		// Create the new user
		$user_obj                = new \User();
		$user_obj->name          = $username;
		$user_obj->original_name = $username;
		$user_obj->password      = $user_obj->generatePassword($username, $password);
		$user_obj->save();
	}

	protected function loginUser($username, $password)
	{
		// Validate that the username doesn't already exist
		if (!$this->checkUsernameExists($username))
		{
			throw new \Exception('Username does not exist');
		}

		if (!$this->verifyUsernamePassword($username, $password))
		{
			throw new \Exception('Username and password do not match');
		}

		return true;
	}

	private function verifyUsernamePassword($username, $password)
	{
		$user_obj = $this->getUserByName($username);

		// Verify that the user's password matches the original username and entered password
		return $user_obj->password === $user_obj->generatePassword($user_obj->original_name, $password);
	}

	private function checkUsernameExists($username)
	{
		$sql = 'SELECT user_id FROM "user" WHERE name = $1 AND status;';
		$res = \Utility::pgQueryParams($sql, array($username));
		return !!($res && $res[0] && $res[0]['user_id']);
	}

	private function getUserByName($username)
	{
		$sql = 'SELECT user_id FROM "user" WHERE name = $1 AND status;';
		$res = \Utility::pgQueryParams($sql, array($username));

		if (!$res || !$res[0] || !$res[0]['user_id'])
		{
			return false;
		}

		return \User::find($res[0]['user_id']);
	}
}
