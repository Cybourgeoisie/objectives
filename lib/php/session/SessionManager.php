<?php

class SessionManager
{
	protected static $this_user = null;

	public static function getUser()
	{
		return self::$this_user;
	}

	public static function start()
	{
		// Initialize the session.
		session_start();

		// See if the user is logged in
		if ($_SESSION && $_SESSION['username'])
		{
			// Refresh the user credentials
			self::refresh($_SESSION['username']);
		}
	}

	public static function login($user_obj)
	{
		// Set this user
		self::$this_user = $user_obj;

		// Update the user's session ID
		$user_obj->session = session_id();
		$user_obj->save();

		// Store session data, write and close
		$_SESSION['username'] = $user_obj->name;

		self::setCookie(session_id(), 86400);

		session_write_close();
	}

	public static function refresh($username)
	{
		// Match the user to the session ID
		$user_obj = User::getByNameSession($username, session_id());

		// If not found, throw a shit fit
		if (!$user_obj)
		{
			// Assume a hijacking attempt
			self::logout();

			throw new Exception('User not found by name and session ID');
		}

		// Set the user found by name and the session ID
		self::$this_user = $user_obj;

		// TODO Security - regenerate the session id

		self::setCookie(session_id(), 86400);

		session_write_close();
	}

	public static function logout()
	{
		self::$this_user = null;

		self::destroy();
	}

	protected static function destroy()
	{
		// Unset all of the session variables.
		$_SESSION = array();

		// Reset the cookie
		self::setCookie('', -42000);

		// Finally, destroy the session.
		session_destroy();
	}

	protected static function setCookie($data, $timeout)
	{
		$params = session_get_cookie_params();

		setcookie(session_name(),
			$data,
			time() + $timeout,
			$params["path"],
			$params["domain"],
			$params["secure"],
			$params["httponly"]
		);
	}
}
