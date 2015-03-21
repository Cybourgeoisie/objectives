<?php

namespace Service;

interface Service
{
	public function call($method, $request, $args);
}
