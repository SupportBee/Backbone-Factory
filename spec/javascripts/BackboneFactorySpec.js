/*global sinon, describe, beforeEach, afterEach, it, expect, BackboneFactory, User, UserWithSchema, Post, PostWithSchema, Comments */
describe("Backbone Factory", function() {

  beforeEach(function() {
    this.addMatchers({
      toBeInstanceOf: function(expected) {
        return this.actual instanceof expected;
      }
    });
  });

  describe("Defining and using Sequences", function(){

    beforeEach(function() {
      this.emailSequence = BackboneFactory.define_sequence('email', function(n){
        return "person"+n+"@example.com";
      });
    });

    it("should increment the sequence on successive calls", function(){
      expect(BackboneFactory.next('email')).toBe('person1@example.com');
      expect(BackboneFactory.next('email')).toBe('person2@example.com');
    });

  });

  describe("Defining and using Factories", function(){

    beforeEach(function() {
      var emailSequence = BackboneFactory.define_sequence('person_email', function(n){
        return "person"+n+"@example.com";
      });
      var postFactory = BackboneFactory.define('post', Post, function(){
                                          return {
                                            author: BackboneFactory.create('user')
                                          };
                                          }
        );
      var userFactory = BackboneFactory.define('user', User, function(){
                                   return {
                                     name : 'Backbone User',
                                     email: BackboneFactory.next('person_email')
                                      };
                                    }
                                   );

      this.postObject = BackboneFactory.create('post');
      this.userObject = BackboneFactory.create('user');
    });


    it("return an instance of the Backbone Object requested", function() {
      expect(this.postObject).toBeInstanceOf(Post);
      expect(this.userObject).toBeInstanceOf(User);
    });

    // Not sure if this test is needed. But what the hell!
    it("should preserve the defaults if not overriden", function() {
      expect(this.postObject.get('title')).toBe('Default Title');
    });



    it("should use the defaults supplied when creating objects", function() {
      expect(this.userObject.get('name')).toBe('Backbone User');
    });

    it("should work with sequences", function(){
      expect(this.userObject.get('email')).toBe('person2@example.com');
      var anotherUser = BackboneFactory.create('user');
      expect(anotherUser.get('email')).toBe('person3@example.com');
    });

    it("should work if other factories are passed", function(){
      expect(this.postObject.get('author')).toBeInstanceOf(User);
    });

    it("should override defaults if arguments are passed on creation", function(){
      var userWithEmail = BackboneFactory.create('user', function(){
                                             return {
                                                email: 'overriden@example.com'
                                              };
                            });
      expect(userWithEmail.get('email')).toBe('overriden@example.com');
    });

    it("should have an id", function() {
      expect(this.userObject.id).toBeDefined();
    });

    it("should have an id that increments on creation", function(){
      var firstID = BackboneFactory.create('user').id;
      var secondID = BackboneFactory.create('user').id;
      expect(secondID).toBe(firstID + 1);
    });

    describe("Error Messages", function() {

      it("should throw an error if factory_name is not proper", function() {
        expect(function(){BackboneFactory.define('wrong name', Post)}).toThrow("Factory name should not contain spaces or other funky characters");
      });

      it("should not throw an error if factory_name has a hyphen", function() {
        expect(function(){BackboneFactory.define('okay-name', Post)}).not.toThrow();
      });

      it("should throw an error if you try to use an undefined factory", function() {
        expect(function(){BackboneFactory.create('undefined_factory')}).toThrow("Factory with name undefined_factory does not exist");
      });

      it("should throw an error if you try to use an undefined sequence", function() {
        expect(function(){BackboneFactory.next('undefined_sequence')}).toThrow("Sequence with name undefined_sequence does not exist");
      });

    });

  });

  describe("Defining and using Factories with Schema", function() {

    beforeEach(function() {
      BackboneFactory.define_sequence('person_email', function(n){
        return "person"+n+"@example.com";
      });
      BackboneFactory.define_collection('comments', Comments, 3);
      BackboneFactory.define('post_with_schema', PostWithSchema);
      BackboneFactory.define('user_with_schema', UserWithSchema, function() {
        return {
          email: BackboneFactory.next('person_email')
        };
      });
      BackboneFactory.define('comment', Comment );
    });


    it("should create model using schema if present", function() {
      var user = BackboneFactory.create('user_with_schema');
      expect(user.get('name')).toEqual('Backbone User');
    });

    it("should get email using sequence", function() {
      var user = BackboneFactory.create('user_with_schema');
      expect(user.get('email')).toEqual('person1@example.com');
    });

    it("defaults option should override default from schema", function() {
      var post = BackboneFactory.create('post_with_schema');
      expect(post.get('title')).toEqual('Default Title');
    });

    it("should fallback to schema.default", function() {
      var post = BackboneFactory.create('post_with_schema');
      expect(post.get('body')).toEqual('Default body');
    });

    it("should fallback to schema.default", function() {
      var post = BackboneFactory.create('post_with_schema');
      expect(post.get('body')).toEqual('Default body');
    });

    describe("Related Model", function(){
      it("should be created from schema if exists", function() {
        var post = BackboneFactory.create('post_with_schema');
        expect(post.get('author')).toBeInstanceOf(UserWithSchema);
      });

      it("should be created from schema even the related model has no schema", function() {
        var post = BackboneFactory.create('post_with_schema');
        expect(post.get('author_without_schema')).toBeInstanceOf(User);
      });

      it("should work even when there are multiple factories for the same constructor", function(){
        BackboneFactory.define('another_user_with_schema', UserWithSchema);
        var post = BackboneFactory.create('post_with_schema');
        expect(post.get('author')).toBeInstanceOf(UserWithSchema);
      });

      it("should be created even if there is no factory", function() {
        var CommentCopy = Comment.extend({
          schema: _.extend({}, Comment.prototype.schema, {
            author: {
              type: 'related',
              _constructor: Backbone.Model
            }
          })
        });
        BackboneFactory.define('comment_copy', CommentCopy);
        var comment = BackboneFactory.create('comment_copy');
        expect(comment.get('author')).toBeInstanceOf(Backbone.Model);
        expect(comment.get('author')).not.toBeInstanceOf(User);
      });

    });

    describe("Related Collection", function() {

      it("should be created from schema", function() {
        var post = BackboneFactory.create('post_with_schema');
        expect(post.get('comments')).toBeInstanceOf(Comments);
      });

      it("should be of default size if size not given", function() {
        var post = BackboneFactory.create('post_with_schema');
        expect(post.get('comments').size()).toEqual(3);
      });

      it("should be of default size if size is not valid number", function() {
        var post = BackboneFactory.create('post_with_schema', function(){
          return { comments: BackboneFactory.create_collection('comments', null) };
        });
        expect(post.get('comments').size()).toEqual(3);
      });

      it("should be of given size", function() {
        var post = BackboneFactory.create('post_with_schema', function(){
          return { comments: BackboneFactory.create_collection('comments', 4) };
        });
        expect(post.get('comments').size()).toEqual(4);
      });

      it("should contain models with given attributes", function() {
        BackboneFactory.define_collection('comments', Comments, 3);
        var user = BackboneFactory.create('user_with_schema');
        var post = BackboneFactory.create('post_with_schema', function(){
          return { comments: BackboneFactory.create_collection('comments', null, function() {
            return { author: user };
          }) };
        });
        expect(_.every(post.get('comments').pluck('author'), function(val) {
          return val === user;
        })).toBeTruthy();
      });

      it("should be created even if there is no factory", function() {
        var PostCopy = PostWithSchema;
        PostCopy.prototype.schema = _.extend(PostWithSchema.prototype.schema, {
          comments: {
            type: 'related',
            _constructor: Backbone.Collection
          }
        });
        BackboneFactory.define('post', PostCopy);
        var post = BackboneFactory.create('post');
        expect(post.get('comments')).toBeInstanceOf(Backbone.Collection);
        expect(post.get('comments')).not.toBeInstanceOf(Comments);
      });

    });

  });

});
