// Backbone Factory JS
//

(function(){
  window.BackboneFactory = {

    factories: {},
    sequences: {},

    define: function(factory_name, klass, defaults){
      if(defaults === undefined) defaults = function(){return {}};
      //this.factories[factory_name] = {};
      this.factories[factory_name] = function(options){
        if(options === undefined) options = function(){return {}};
        arguments =  _.extend({}, {id: BackboneFactory.next("_" + factory_name + "_id")}, defaults.call(), options.call());
        return new klass(arguments);
      };

      // Lets define a sequence for id
      BackboneFactory.define_sequence("_"+ factory_name +"_id", function(n){
        return n
      });
      //this.factories[factory_name]['defaults'] = defaults;
    },

    create: function(factory_name, options){
      if(this.factories[factory_name] === undefined){
        throw "Factory with name " + factory_name + " does not exist";
      }
      return this.factories[factory_name].apply(null, [options]);        
    },

    define_sequence: function(sequence_name, callback){
      this.sequences[sequence_name] = {}
      this.sequences[sequence_name]['counter'] = 0;
      this.sequences[sequence_name]['callback'] = callback; 
    },

    next: function(sequence_name){
      this.sequences[sequence_name]['counter'] += 1;
      return this.sequences[sequence_name]['callback'].apply(null, [this.sequences[sequence_name]['counter']]); //= callback; 
    }
  }
})();
