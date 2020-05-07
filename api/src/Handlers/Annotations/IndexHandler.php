<?php

declare(strict_types=1);

namespace App\Handlers\Annotations;

use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use App\Responders\JsonResponder;
use App\ReadModel\AnnotationViewInterface;

final class IndexHandler implements RequestHandlerInterface
{
    private JsonResponder $responder;

    private AnnotationViewInterface $annotations;

    public function __construct(JsonResponder $responder, AnnotationViewInterface $annotations)
    {
        $this->responder = $responder;
        $this->annotations = $annotations;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $params = (array) $request->getQueryParams();

        $source = (string) ($params['source'] ?? '');
        $query = (string) ($params['query'] ?? '');
        $limit = (int) ($params['limit'] ?? 5);

        $annotations = $this->annotations->all($source, $query, $limit)->fetchAll();

        return $this->responder->success($annotations);
    }
}
