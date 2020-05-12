<?php

declare(strict_types=1);

namespace App\Handlers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ResponseFactoryInterface;

final class Responder
{
    private ResponseFactoryInterface $factory;

    private int $options;

    private int $depth;

    public function __construct(ResponseFactoryInterface $factory, int $options = 0, int $depth = 512)
    {
        $this->factory = $factory;
        $this->options = $options;
        $this->depth = $depth;
    }

    /**
     * @param int       $code
     * @param mixed     $body
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function __invoke(int $code, $body = ''): ResponseInterface
    {
        if ($code == 301 || $code == 302) {
            if (is_string($body)) {
                return $this->factory->createResponse($code)
                    ->withHeader('Location', $body);
            }

            throw new \InvalidArgumentException('Redirect responses musth have an url as body');
        }

        if (is_string($body)) {
            return $this->response($code, $body, 'text/html');
        }

        $body = json_encode($body, $this->options | JSON_THROW_ON_ERROR, $this->depth);

        if ($body === false) throw new \Exception;

        return $this->response($code, $body, 'application/json');
    }

    private function response(int $code, string $body, string $type): ResponseInterface
    {
        $response = $this->factory->createResponse($code);

        if (!empty($body)) {
            $response = $response->withHeader('Content-type', $type);

            $response->getBody()->write($body);
        }

        return $response;
    }
}
