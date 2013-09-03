/*global BackboneFactory */

// Backbone Factory JS
// https://github.com/SupportBee/Backbone-Factory

(function(){
  window.BackboneFactory = {

    factories: {},
    sequences: {},

    define: function(factory_name, klass, defaults){

      var schema = klass.prototype.schema,
          schema_defaults = {},
          model_defaults;

      // Check for arguments' sanity
      if(factory_name.match(/[^\w-_]+/)){
        throw "Factory name should not contain spaces or other funky characters";
      }

      model_defaults = _.result( klass.prototype, 'defaults' );

      if(defaults === undefined) defaults = function(){return {};}

      if ( schema ) {
        schema_defaults = _.object(
          _( schema ).keys(),
          _( schema ).chain()
            .values()
            .pluck( 'default' )
            .value()
        );
      }

      // The object creator
      this.factories[factory_name] = function(options){
        if(options === undefined) options = function(){return {};};
        var attributes =  _.extend(
          {},
          { id: BackboneFactory.next("_" + factory_name + "_id") },
          schema_defaults,
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
