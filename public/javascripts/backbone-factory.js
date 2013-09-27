/*global BackboneFactory */

// Backbone Factory JS
// https://github.com/SupportBee/Backbone-Factory

(function(){

  function get_factory_name(klass){
    var keys = _.keys(BackboneFactory.model_klasses),
        values = _.values(BackboneFactory.model_klasses);
    return keys[values.indexOf(klass)];
  }

  function get_collection_name(klass){
    var keys = _.keys(BackboneFactory.collection_klasses),
        values = _.values(BackboneFactory.collection_klasses);
    return keys[values.indexOf(klass)];
  }

  window.BackboneFactory = {

    factories: {},
    model_klasses: {},

    collections: {},
    collection_klasses: {},

    sequences: {},

    define: function(factory_name, klass, defaults){

      // Check for arguments' sanity
      if(factory_name.match(/[^\w-_]+/)){
        throw "Factory name should not contain spaces or other funky characters";
      }

      if(defaults === undefined) defaults = function(){return {};}

      // The object creator
      this.model_klasses[factory_name] = klass;
      this.factories[factory_name] = function(attrs_generator, options){
        if(attrs_generator === undefined) attrs_generator = function(){return {};};

        var schema = klass.prototype.schema,
            default_vals = _.result(klass.prototype, 'defaults') || {};

        if(schema){
          default_vals = _(default_vals).clone();

          _(schema).each(function(attr, key){
            if(_(attr).has('default') && default_vals[key] === undefined) {
              default_vals[key] = attr.default;
            }
          });

          _(schema).each(function(attr, key){
            var name;
            if(attr.type == 'related' && attr._constructor && !(key in default_vals)){
              if(name = get_factory_name(attr._constructor)){
                default_vals[key] = BackboneFactory.create(name);
              }else if(name = get_collection_name(attr._constructor)){
                default_vals[key] = BackboneFactory.create_collection(name);
              }else{
                default_vals[key] = new attr._constructor();
              }
            }
          });

        }

        var attributes =  _.extend(
          { id: BackboneFactory.next("_" + factory_name + "_id") },
          default_vals,
          defaults.call(),
          attrs_generator.call()
        );
        return new klass(attributes, options);
      };

      // Lets define a sequence for id
      BackboneFactory.define_sequence("_"+ factory_name +"_id", function(n){
        return n;
      });
    },

    create: function(factory_name, attrs_generator, options){
      if(this.factories[factory_name] === undefined){
        throw "Factory with name " + factory_name + " does not exist";
      }
      return this.factories[factory_name].call(null, attrs_generator, options);
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
    },

    define_collection: function(collection_name, klass, default_size, default_options){
      var factory_name = get_factory_name(klass.prototype.model);

      this.collection_klasses[collection_name] = klass;
      this.collections[collection_name] = function(size, attrs_generator, options){
        var models = [];
        if(typeof size!='number') size = default_size;
        options = options || default_options || {};

        for(var i=0; i<size; i++){
          models.push(BackboneFactory.create(factory_name, attrs_generator));
        }
        return new klass(models, options);
      };
    },

    create_collection: function(collection_name, size, attrs_generator, options){
      if(this.collections[collection_name] === undefined){
        throw "Collection with name " + collection_name + " does not exist";
      }
      return this.collections[collection_name].call(this, size, attrs_generator, options);
    }

  };
})();
