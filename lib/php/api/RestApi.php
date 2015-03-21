<?php

class RestApi extends Api
{
	protected $User;

	public function __construct($request, $origin)
	{
		// Only allow requests from this server
		if ($_SERVER['SERVER_ADDR'] != $_SERVER['REMOTE_ADDR'])
		{
			throw new Exception('External requests not supported');
		}

		parent::__construct($request);

		/*
		// Abstracted out for example
		$APIKey = new Models\APIKey();
		$User = new Models\User();

		if (!array_key_exists('apiKey', $this->request))
		{
			throw new Exception('No API Key provided');
		}
		else if (!$APIKey->verifyKey($this->request['apiKey'], $origin))
		{
			throw new Exception('Invalid API Key');
		}
		else if (array_key_exists('token', $this->request) &&
			!$User->get('token', $this->request['token']))
		{

			throw new Exception('Invalid User Token');
		}

		$this->User = $User;
		*/
	}
}
