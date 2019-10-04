<?php $this->layout('layout') ?>
<?php $this->push('scripts'); ?>
<script type="text/javascript" src="<?= $this->asset('form.js') ?>"></script>
<script type="text/javascript">
    form.init('interactions');
</script>
<?php $this->end() ?>
<div class="jumbotron">
    <h1>Welcome to Vinland!</h1>
    <p class="lead">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus porta eros est, ac varius nulla rutrum ac. Sed lectus ipsum, pharetra vel sodales sit amet, iaculis eu diam.
    </p>
    <hr>
    <p>
        Phasellus euismod dictum ante nec congue. Nam libero velit, accumsan fermentum finibus at, iaculis non lectus. Fusce id consectetur sapien. Sed eleifend metus id mattis vehicula. Ut aliquam eros sit amet risus accumsan sollicitudin. Fusce interdum tortor at semper egestas. Curabitur consequat est mauris, vitae tempus justo rutrum at. Integer in mauris vel dui iaculis suscipit quis dignissim lacus. Donec id erat ornare, euismod ex hendrerit, bibendum felis. In imperdiet nulla sed urna pulvinar blandit. Mauris consequat maximus dapibus. Morbi blandit eu odio a blandit. Nulla facilisi. Morbi id tempor sapien.
    </p>
</div>
<div id="content">
    <h1>Search for interactions</h1>
    <div id="interactions"></div>
</div>
