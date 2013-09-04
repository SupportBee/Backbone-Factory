//Models for testing out Backbone Factory

var User = Backbone.Model.extend({

  name: null,
  email: null

});

var UserWithSchema = Backbone.Model.extend({

  name: null,
  email: null,

  schema: {
    name: {
      type: 'string',
      default: 'Backbone User'
    },
    email: {
      type: 'string',
      default: ''
    }
  }

});

var Post = Backbone.Model.extend({

  defaults: {
    title: 'Default Title'
  }

});


var PostWithSchema = Backbone.Model.extend({

  defaults: {
    title: 'Default Title'
  },

  schema: {
    title: {
      type: 'string',
      default: 'Default value from schema'
    },
    body: {
      type: 'string',
      default: 'Default body'
    },
    author: {
      type: 'related',
      related_to: UserWithSchema
    }
  }

});
