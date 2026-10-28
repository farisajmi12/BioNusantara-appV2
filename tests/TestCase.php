<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        if (isset($_SERVER['DB_CONNECTION']) && $_SERVER['DB_CONNECTION'] === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');
        }

        parent::setUp();
    }
}
