//Models for testing out Backbone Factory

var User = Backbone.Model.extend({

  name: null,
  email: null

});

var Post = Backbone.Model.extend({

  defaults: {
    title: 'Default Title'
  }

});
