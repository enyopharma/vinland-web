<?php

declare(strict_types=1);

namespace App\Http\Handlers\Taxa\Names;

use Psr\Http\Server\RequestHandlerInterface;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseFactoryInterface;

use Quanta\Validation\ErrorInterface;

use Domain\Input\TaxonInput;
use Domain\ReadModel\TaxonNamesViewInterface;

use App\Http\Validations\RequestToTaxon;

final class IndexHandler implements RequestHandlerInterface
{
    private ResponseFactoryInterface $factory;

    private TaxonNamesViewInterface $names;

    public function __construct(
        ResponseFactoryInterface $factory,
        TaxonNamesViewInterface $names,
        RequestToTaxon $validation
    ) {
        $this->factory = $factory;
        $this->names = $names;
        $this->validation = $validation;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return $this->validation->input($request)->extract(
            fn (...$xs) => $this->success(...$xs),
            fn (...$xs) => $this->failure(...$xs),
        );
    }

    private function success(TaxonInput $taxon): ResponseInterface
    {
        $names = $this->names->all($taxon)->fetchAll();

        return $this->response(200, $names);
    }

    private function failure(ErrorInterface ...$errors): ResponseInterface
    {
        return $this->response(422, array_map([$this, 'message'], $errors));
    }

    private function message(ErrorInterface $error): string
    {
        $name = $error->name();

        return $name == ''
            ? $error->message()
            : sprintf('%s => %s', $error->name(), $error->message());
    }

    private function response(int $code, array $data = []): ResponseInterface
    {
        $response = $this->factory->createResponse($code);

        $response->getBody()->write((string) json_encode([
            'success' => $code >= 200 && $code < 300,
            'code' => $code,
            'data' => $data,
        ]));

        return $response->withHeader('content-type', 'application/json');
    }
}
