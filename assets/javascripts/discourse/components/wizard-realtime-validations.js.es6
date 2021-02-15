import Component from "@ember/component";
import EmberObject from "@ember/object";
import { cloneJSON } from "discourse-common/lib/object";
import Category from "discourse/models/category";

export default Component.extend({
  classNames: ["realtime-validations"],

  init() {
    this._super(...arguments);
    if (!this.validations) return;

    if (!this.field.validations) {
      const validations = {};
      this.validations.forEach((validation) => {
        validations[validation] = {};
      });

      this.set("field.validations", EmberObject.create(validations));
    }

    const validationBuffer = cloneJSON(this.get("field.validations"));
    let bufferCategories;
    if (
      validationBuffer.similar_topics &&
      (bufferCategories = validationBuffer.similar_topics.categories)
    ) {
      const categories = Category.findByIds(bufferCategories);
      validationBuffer.similar_topics.categories = categories;
    }
    this.set("validationBuffer", validationBuffer);
  },

  actions: {
    updateValidationCategories(name, validation, categories) {
      this.set(`validationBuffer.${name}.categories`, categories);
      this.set(
        `field.validations.${name}.categories`,
        categories.map((category) => category.id)
      );
    },
  },
});
