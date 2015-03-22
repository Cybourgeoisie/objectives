<?php

class User extends ObjectiveModel
{
	public function login($username, $password)
	{
		// Validate that the username doesn't already exist
		if (!$this->checkUsernameExists($username))
		{
			throw new \Exception('Username does not exist');
		}

		// Get the user by the name and password
		$result = $this->getByNamePassword($username, $password);
		if (!$result)
		{
			throw new \Exception('Username and password do not match');
		}

		// Login the user
		SessionManager::login($this);

		return true;
	}

	public function create($username, $password)
	{
		// Validate that the username doesn't already exist
		if ($this->checkUsernameExists($username))
		{
			throw new \Exception('Username already exists');
		}

		// Require that the password is at least 6 characters long
		if (strlen($password) < 6)
		{
			throw new \Exception('Password is too short - minimum 6 characters');
		}

		// Create the new user
		$this->name          = $username;
		$this->original_name = $username;
		$this->password      = $this->generatePassword($username, $password);
		$this->save();

		return true;
	}

	/**
	 * Get user's objectives
	 */
	public function getObjectives()
	{
		$user_obj = \SessionManager::getUser();
		if (!$user_obj) return array();

		$sql = '
			SELECT 
				objective_id, objective_id as id, name, description, created
			FROM
				objective
			WHERE
				user_id = $1 AND status;
		';
		$res = \Utility::pgQueryParams($sql, array($user_obj->user_id));
		return $res;
	}

	/** 
	 * Get currently logged in user
	 */
	public static function getLoggedIn()
	{
		return SessionManager::getUser();
	}

	/** 
	 * Check if user is logged in
	 */
	public static function isLoggedIn()
	{
		return !!SessionManager::getUser();
	}

	public static function getByNameSession($username, $session_id)
	{
		$sql = 'SELECT user_id FROM "user" WHERE name = $1 AND session = $2 AND status;';
		$res = \Utility::pgQueryParams($sql, array($username, $session_id));

		if (!$res || !$res[0] || !$res[0]['user_id'])
		{
			return false;
		}

		return \User::find($res[0]['user_id']);
	}

	/**
	 * Generate the password
	 */
	protected function generatePassword($username, $password)
	{
		return $this->hashPassword_v1($username, $password);
	}

	protected function getByNamePassword($username, $password)
	{
		$hashed_password = $this->generatePassword($this->getOriginalNameByName($username), $password);

		$sql = 'SELECT user_id FROM "user" WHERE name = $1 AND password = $2 AND status;';
		$res = \Utility::pgQueryParams($sql, array($username, $hashed_password));

		if (!$res || !$res[0] || !$res[0]['user_id'])
		{
			return false;
		}

		$this->load($res[0]['user_id']);
		return true;
	}

	/**
	 * Password Hash Generation - Version 1
	 * sha512 generates 128 characters for the password
	 * - Use a deployment-based salt from the config file
	 * - md5 hash the original username
	 */
	private function hashPassword_v1($original_username, $password)
	{
		return hash('sha512', PASSWORD_SALT . hash('md5', $original_username) . $password);
	}

	private function checkUsernameExists($username)
	{
		$sql = 'SELECT user_id FROM "user" WHERE name = $1 AND status;';
		$res = \Utility::pgQueryParams($sql, array($username));
		return !!($res && $res[0] && $res[0]['user_id']);
	}

	private function getOriginalNameByName($username)
	{
		$sql = 'SELECT original_name FROM "user" WHERE name = $1 AND status;';
		$res = \Utility::pgQueryParams($sql, array($username));

		if (!$res || !$res[0] || !$res[0]['original_name'])
		{
			return false;
		}

		return $res[0]['original_name'];
	}
}
