<?php

class User extends Geppetto\GeppettoObject
{
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
}
