describe('#parseForTags', function(){
  it('it should accept two strings', function() {
    var test_html_content = '<html><head><script src="path/to/file.js"></script></head></html>';
    var test_type = 'js';
    parseForTags(test_html_content, test_type).should.be.Array;
  });

  it('it should return 0 if nothing found', function() {
    var test_html_content = '<html><head><script src="path/to/file.js"></script></head></html>';
    var test_type = 'css';
    parseForTags(test_html_content, test_type).should.be.Number.and.equal(0);
  });  
})
