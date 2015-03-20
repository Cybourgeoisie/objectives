<?php

/**
 * Api Class - Credit goes to Corey Maynard
 * http://coreymaynard.com/blog/creating-a-restful-api-with-php/
 */

abstract class Api
{
	protected $method = '';
	protected $endpoint_class = '';
	protected $endpoint_method = '';
	protected $args = array();
	protected $file = null;

	public function __construct($request)
	{
		header("Access-Control-Allow-Orgin: *");
		header("Access-Control-Allow-Methods: *");
		header("Content-Type: application/json");

		// Get the arguments, class and method
		$this->args = explode('/', rtrim($request, '/'));
		$this->endpoint_class  = $this->args[0] ? array_shift($this->args) : null;
		$this->endpoint_method = $this->args[0] ? array_shift($this->args) : null;

		// Get the request method
		$this->method = $_SERVER['REQUEST_METHOD'];

		// Extend POST to be more specific
		if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER))
		{
			if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE')
			{
				$this->method = 'DELETE';
			}
			else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT')
			{
				$this->method = 'PUT';
			}
			else
			{
				throw new Exception("Unexpected Header");
			}
		}

		switch($this->method)
		{
			case 'DELETE':
			case 'POST':
				$this->request = $this->_cleanInputs($_POST);
			break;
			case 'GET':
				$this->request = $this->_cleanInputs($_GET);
			  break;
			case 'PUT':
				$this->request = $this->_cleanInputs($_GET);
				$this->file = file_get_contents("php://input");
				break;
			default:
				$this->_response('Invalid Method', 405);
				break;
		}
	}

	public function processRequest()
	{
		// Call another class
		if ($this->endpoint_class && $this->endpoint_method && class_exists($this->endpoint_class))
		{
			$class = new ReflectionClass($this->endpoint_class);

			// Require that this method is a Service
			if ($class->implementsInterface('Service'))
			{
				$method = $class->getMethod('call');
				return $method->invokeArgs(new $this->endpoint_class(), array($this->endpoint_method, $this->args));
			}
			else
			{
				throw new Exception('Illegal Service Call');
			}
		}
		// Call this class
		else if (!$this->endpoint_method && method_exists($this, $this->endpoint_method))
		{
			return $this->_response($this->{$this->endpoint}($this->args));
		}

		return $this->_response("No Endpoint - " . $this->endpoint_class . '::' . $this->endpoint_method, 404);
	}

	private function _response($data, $status = 200)
	{
		header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
		return json_encode($data);
	}

	private function _cleanInputs($data)
	{
		$clean_input = Array();
		if (is_array($data))
		{
			foreach ($data as $k => $v)
			{
				$clean_input[$k] = $this->_cleanInputs($v);
			}
		}
		else
		{
			$clean_input = trim(strip_tags($data));
		}

		return $clean_input;
	}

	private function _requestStatus($code)
	{
		$status = array(  
			200 => 'OK',
			404 => 'Not Found',   
			405 => 'Method Not Allowed',
			500 => 'Internal Server Error',
		); 

		return ($status[$code]) ? $status[$code] : $status[500];
	}
}
