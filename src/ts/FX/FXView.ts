import type FX from "./FX";
import $ from "jquery";

export default class FXView {
  model: FX;
  dom: JQuery;
  dom_side: JQuery;
  minus_side: JQuery;

  constructor(model: FX, dom_side: JQuery) {
    this.model = model;
    this.dom = dom_side;
    this.dom_side = dom_side;
    this.minus_side = this.dom_side.find(".sidebar-effect-minus");
  }

  initEvent() {
    return this.minus_side.on("click", () => {
      this.model.remove();
      return $(this.dom_side).remove();
    });
  }
}
