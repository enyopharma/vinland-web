<!DOCTYPE html>
<html>
    <head>
        <title>
            <?= isset($title) ? $this->e($title) : 'Welcome' ?>
        </title>
        <link rel="stylesheet" href="<?= $this->asset('build/app.css') ?>" />
        <?= $this->section('styles') ?>
        <script type="text/javascript" src="<?= $this->asset('build/runtime.js') ?>"></script>
        <script type="text/javascript" src="<?= $this->asset('build/app.js') ?>"></script>
        <?= $this->section('scripts') ?>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div class="container">
                <a class="navbar-brand" href="#">Vinland</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navcontent">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div id="navcontent" class="collapse navbar-collapse">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container">
            <?= $this->section('content') ?>
        </div>
    </body>
</html>
