<?php

/**
 * Gateway - contains all of the necessary files
 */

// Utility
require_once(PHP_PATH . 'Utility.php');

// API
require_once(PHP_PATH . 'api/Api.php');
require_once(PHP_PATH . 'api/RestApi.php');

// SQL
require_once(PHP_PATH . 'postgresql/PostgreSqlHandler.php');

// Geppetto
require_once(PHP_PATH . 'geppetto/Geppetto.php');

// User
require_once(PHP_PATH . 'user/User.php');

// Services
require_once(PHP_PATH . 'service/Service.interface.php');
require_once(PHP_PATH . 'service/ServiceClass.php');
require_once(PHP_PATH . 'service/user/User.service.php');
