import SpellSorcDataModel from "./base-model.mjs";

export default class SpellSorcActorBase extends SpellSorcDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.health = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 9, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 9 })
    });
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields
    
    return schema;
  }

}