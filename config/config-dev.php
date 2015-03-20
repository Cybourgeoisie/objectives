<?php

// Dev only - print all errors
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Database Connection
define('DB_HOST', 'localhost');
define('DB_PORT', 5432);
define('DB_NAME', 'objectives');
define('DB_USER', 'objectives_user');
define('DB_PASS', 'objpass');

// Deployment Password Salt
define('PASSWORD_SALT', 'development-objectives-salt');

// Paths
define('ROOT_PATH', dirname(realpath(__FILE__)) . '/../');
define('PHP_PATH', ROOT_PATH . 'lib/php/');

// Common Files
define('GATEWAY_PATH', PHP_PATH . 'gateway.php');
