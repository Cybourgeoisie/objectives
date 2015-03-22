<?php

/**
 * Gateway - contains all of the necessary files
 */

// Utility
require_once(PHP_PATH . 'Utility.php');

// Sessions
require_once(PHP_PATH . 'session/SessionManager.php');

// API
require_once(PHP_PATH . 'api/Api.php');
require_once(PHP_PATH . 'api/RestApi.php');

// SQL
require_once(PHP_PATH . 'postgresql/PostgreSqlHandler.php');

// Geppetto
require_once(PHP_PATH . 'geppetto/Geppetto.php');

// Models
require_once(PHP_PATH . 'user/User.php');
require_once(PHP_PATH . 'objective/Objective.php');
require_once(PHP_PATH . 'objective/ObjectiveType.php');
require_once(PHP_PATH . 'task/Task.php');
require_once(PHP_PATH . 'task/TaskType.php');

// Services
require_once(PHP_PATH . 'service/Service.interface.php');
require_once(PHP_PATH . 'service/ServiceClass.php');
require_once(PHP_PATH . 'service/user/User.service.php');
require_once(PHP_PATH . 'service/objective/Objective.service.php');
require_once(PHP_PATH . 'service/task/Task.service.php');
