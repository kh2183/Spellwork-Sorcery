import SpellSorcActorBase from "./base-actor.mjs";

export default class SpellSorcCharacter extends SpellSorcActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
      surgedice: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 2 })
      }),
      background: new fields.SchemaField({
        value: new fields.StringField({ initial: "None" })
      }),
      class: new fields.SchemaField({
        value: new fields.StringField({ initial: "None" })
      }),
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.SPELL_SORC.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      });
      return obj;
    }, {}));

    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor(this.abilities[key].value);
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.SPELL_SORC.abilities[key]) ?? key;
    }
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k,v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.lvl = this.attributes.level.value;
    data.sd = this.attributes.surgedice.value;
    data.bg = this.attributes.background.value;
    data.cls = this.attributes.class.value;
    

    return data
  }
}