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


var Comment = Backbone.Model.extend({

  schema: {
    msg: {
      type: 'string',
      default: 'Default comment msg'
    },
    author: {
      type: 'related',
      related_to: User
    }
  }

});


var Comments = Backbone.Collection.extend({

  model: Comment

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
      constructor: UserWithSchema
    },
    author_without_schema: {
      type: 'related',
      constructor: User
    },
    comments: {
      type: 'related',
      constructor: Comments
    }
  }

});
