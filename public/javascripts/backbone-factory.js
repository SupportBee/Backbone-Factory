// Backbone Factory JS
//

(function(){
  window.BackboneFactory = {

    factories: {},

    define: function(factory_name, klass, defaults){
      console.log('define');
      console.log(klass);
      this.factories[factory_name] = {};
      this.factories[factory_name]['klass'] = klass;
      this.factories[factory_name]['defaults'] = defaults;
    },

    create: function(factory_name){
              console.log('create');
              console.log(this.factories[factory_name]['klass']);
      return (new (this.factories[factory_name]['klass']));        
    }

  }
})();
