<?php

namespace Service;

class User extends ServiceClass
{
	public function funky($args)
	{
		print "User called funky method with args " . json_encode($args) . "\r\n\r\n";

		$user = new \User();
		//print $user->hashPassword_v1('bheidorn', 'password');

		return array('psych!');
	}
}
