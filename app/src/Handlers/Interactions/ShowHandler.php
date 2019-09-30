<?php

declare(strict_types=1);

namespace App\Http\Handlers\Interactions;

use Psr\Http\Server\RequestHandlerInterface;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Domain\Input\StrCollection;
use Domain\Input\QueryValidation;
use Domain\ReadModel\InteractionViewInterface;

final class ShowHandler implements RequestHandlerInterface
{
    const INCOMPLETE = 'incomplete';
    const SUCCESS = 'success';
    const FAILURE = 'failure';

    private $factory;

    private $validation;

    private $interactions;

    public function __construct(
        ResponseFactoryInterface $factory,
        QueryValidation $validation,
        InteractionViewInterface $interactions
    ) {
        $this->factory = $factory;
        $this->validation = $validation;
        $this->interactions = $interactions;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $body = (array) $request->getParsedBody();

        $result = $this->validation->result($body);

        if ($result->isFailure()) {
            return $this->response(422, self::FAILURE, $result->errors());
        }

        ['hh' => $hh, 'vh' => $vh] = $result->data();
        ['human' => $human, 'virus' => $virus] = $result->data();
        ['publications' => $publications, 'methods' => $methods] = $result->data();

        if (count($human['accessions']) == 0 && ($virus['left'] == 0 || $virus['right'] == 0)) {
            return $this->response(200, self::INCOMPLETE);
        }

        $sths = [];

        if ($hh['show'] && $hh['network'] && count($human['accessions']) > 0) {
            $sths[] = $this->interactions->HHNetwork(
                new StrCollection(...$human['accessions']),
                $publications['threshold'],
                $methods['threshold'],
            );
        }

        if ($hh['show'] && ! $hh['network'] && count($human['accessions']) > 0) {
            $sths[] = $this->interactions->HHInteractions(
                new StrCollection(...$human['accessions']),
                $publications['threshold'],
                $methods['threshold'],
            );
        }

        if ($vh['show']) {
            $sths[] = $this->interactions->VHInteractions(
                new StrCollection(...$human['accessions']),
                $virus['left'],
                $virus['right'],
                new StrCollection(...$virus['names']),
                $publications['threshold'],
                $methods['threshold'],
            );
        }

        $interactions = array_merge(...array_map(fn ($sth) => $sth->fetchAll(), $sths));

        return $this->response(200, self::SUCCESS, $interactions);
    }

    private function response(int $code, string $status, array $data = []): ResponseInterface
    {
        $response = $this->factory->createResponse($code);

        $response->getBody()->write(json_encode([
            'success' => $code >= 200 && $code < 300,
            'code' => $code,
            'status' => $status,
            'data' => $data,
        ]));

        return $response->withHeader('content-type', 'application/json');
    }
}
