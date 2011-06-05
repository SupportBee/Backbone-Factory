describe("Backbone Factory", function() {

  beforeEach(function() {
    var postFactory = BackboneFactory.define('post', Post);
    var userFactory = BackboneFactory.define('user', User);

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
});        

