<?php

declare(strict_types=1);

use Psr\Http\Server\RequestHandlerInterface;

use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7Server\ServerRequestCreator;

use function Http\Response\send;

return function (RequestHandlerInterface $app) {
    $factory = new Psr17Factory;

    $creator = new ServerRequestCreator($factory, $factory, $factory, $factory);

    $request = $creator->fromGlobals();

    $response = $app->handle($request);

    send($response);
};
