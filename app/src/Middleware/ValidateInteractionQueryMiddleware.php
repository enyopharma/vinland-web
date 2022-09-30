<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseFactoryInterface;

use App\Input\InteractionQueryInput;

final class ValidateInteractionQueryMiddleware extends AbstractValidationMiddleware
{
    public function __construct(ResponseFactoryInterface $factory)
    {
        parent::__construct(InteractionQueryInput::class, $factory);
    }
}
