/*global BackboneFactory */

// Backbone Factory JS
// https://github.com/SupportBee/Backbone-Factory

(function(){

  function getFactoryName( constructor ) {
    var keys = _.keys( BackboneFactory.klasses ),
        values = _.values( BackboneFactory.klasses );
    return keys[ values.indexOf( constructor ) ];
  }

  window.BackboneFactory = {

    factories: {},
    sequences: {},
    klasses: {},

    define: function(factory_name, klass, defaults){

      // Check for arguments' sanity
      if(factory_name.match(/[^\w-_]+/)){
        throw "Factory name should not contain spaces or other funky characters";
      }

      if(defaults === undefined) defaults = function(){return {};}

      // The object creator
      this.klasses[factory_name] = klass;
      this.factories[factory_name] = function(options){
        if(options === undefined) options = function(){return {};};

        var schema = klass.prototype.schema,
            schema_defaults = {},
            model_defaults,
            related_attrs = {};

        model_defaults = _.result(klass.prototype, 'defaults');

        if ( schema ) {
          schema_defaults = _.object(
            _( schema ).keys(),
            _( schema ).chain()
              .values()
              .pluck( 'default' )
              .value()
          );

          _(schema).each(function(attr, key) {
            if(attr.type == 'related' && attr.related_to) {
              related_attrs[key] = BackboneFactory.create(
                getFactoryName(attr.related_to)
              );
            }
          });
        }

        var attributes =  _.extend(
          { id: BackboneFactory.next("_" + factory_name + "_id") },
          schema_defaults,
          related_attrs,
          model_defaults,
          defaults.call(),
          options.call()
        );
        return new klass(attributes);
      };

      // Lets define a sequence for id
      BackboneFactory.define_sequence("_"+ factory_name +"_id", function(n){
        return n;
      });
    },

    create: function(factory_name, options){
      if(this.factories[factory_name] === undefined){
        throw "Factory with name " + factory_name + " does not exist";
      }
      return this.factories[factory_name].apply(null, [options]);
    },

    define_sequence: function(sequence_name, callback){
      this.sequences[sequence_name] = {};
      this.sequences[sequence_name]['counter'] = 0;
      this.sequences[sequence_name]['callback'] = callback;
    },

    next: function(sequence_name){
      if(this.sequences[sequence_name] === undefined){
        throw "Sequence with name " + sequence_name + " does not exist";
      }
      this.sequences[sequence_name]['counter'] += 1;
      return this.sequences[sequence_name]['callback'].apply(null, [this.sequences[sequence_name]['counter']]); //= callback;
    }
  };
})();
