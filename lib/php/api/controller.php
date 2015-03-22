<?php

require_once(dirname(realpath(__FILE__)) . '/../../../config/config.php');
require_once(GATEWAY_PATH);

// Requests from the same server don't have a HTTP_ORIGIN header
if (!array_key_exists('HTTP_ORIGIN', $_SERVER))
{
	$_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
}

try
{
	// Handle sessions as needed
	SessionManager::start();

	$api = new RestApi($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
	echo json_encode($api->processRequest());
}
catch (Exception $e)
{
	echo json_encode(array(
		'success' => false, 
		'error'   => $e->getMessage()
	));
}
