casper.options.clientScripts = ['../script/js/lib/jquery-2.0.3.min.js']


casper.test.begin 'top', ->
    casper.start 'http://0.0.0.0:9000', ->
        @test.assertTitle('evil')
        @test.assertExists('#wrapper', 'main wrapper found')

        ctrl = @evaluate(-> $('#control'))
        @echo ctrl.find
        @test.assert(ctrl.find('[name=key]').val() == 144)

    casper.then ->
        @test.assertTitle('evil')
        @test.assertExists('#wrapper', 'main wrapper found')


casper.run ->
    @test.done()
