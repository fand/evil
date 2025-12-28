/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class FXView {
    constructor(model, dom_side) {
        this.model = model;
        this.dom_side = dom_side;
        this.minus_side = this.dom_side.find('.sidebar-effect-minus');
    }

    initEvent() {
        return this.minus_side.on('click', ()=> {
            this.model.remove();
            return $(this.dom_side).remove();
        });
    }
}


export default FXView;
