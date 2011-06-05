describe("Backbone Factory", function() {

  describe("Defining and using Sequences", function(){

    beforeEach(function() {
      var emailSequence = BackboneFactory.define_sequence('email', function(n){
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
      var postFactory = BackboneFactory.define('post', Post);
      var userFactory = BackboneFactory.define('user', User, {name : 'Backbone User'});

      this.postObject = BackboneFactory.create('post');
      this.userObject = BackboneFactory.create('user');
    });
    

    it("return an instance of the Backbone Object requested", function() {
      expect(this.postObject instanceof Post).toBeTruthy();
      expect(this.userObject instanceof User).toBeTruthy();
    });
          
    // Not sure if this test is needed. But what the hell!
    it("should preserve the defaults if not overriden", function() {
      expect(this.postObject.get('title')).toBe('Default Title');
    });

    it("should throw an error if you try to use an undefined factory", function() {
      expect(function(){BackboneFactory.create('undefined_factory')}).toThrow("Factory with name undefined_factory does not exist");
    });

    it("should use the defaults supplied when creating objects", function() {
      expect(this.userObject.get('name')).toBe('Backbone User');
            
    });
  });  
  
});        

