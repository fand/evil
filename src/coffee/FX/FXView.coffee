class FXView
    constructor: (@model, @dom_side) ->
        @minus_side = @dom_side.find('.sidebar-effect-minus')

    initEvent: ->
        @minus_side.on('click', ()=>
            @model.remove()
            $(@dom_side).remove()
        )


module.exports = FXView
