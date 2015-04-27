var asset_pull = require('../../www');

describe('#parseForTags', function(){
  it('it should successfully find a script tag', function() {
    var test_html_content = '<html><head><script src="path/to/file.js"></script></head></html>';
    var test_type = 'js';
    asset_pull.parseForTags(test_html_content, test_type).should.be.Array;
    asset_pull.parseForTags(test_html_content, test_type).length.should.equal(1);
  });
  it('it should successfully find a style tag', function() {
    var test_html_content = '<html><head><link href="path/to/file.js"></head></html>';
    var test_type = 'css';
    asset_pull.parseForTags(test_html_content, test_type).should.be.Array;
    asset_pull.parseForTags(test_html_content, test_type).length.should.equal(1);
  });
  it('it should successfully find a image tag', function() {
    var test_html_content = '<html><head><script src="path/to/file.js"></script></head><img src="path/to/image.jpg"></html>';
    var test_type = 'img';
    asset_pull.parseForTags(test_html_content, test_type).should.be.Array;
    asset_pull.parseForTags(test_html_content, test_type).length.should.equal(1);

  });
  it('it should return 0 if nothing found', function() {
    var test_html_content = '<html><head><script src="path/to/file.js"></script></head></html>';
    var test_type = 'css';
    asset_pull.parseForTags(test_html_content, test_type).should.be.Number.and.equal(0);
  });  
});

describe('#buildDirectoryStructure', function(){
  it('it should successfully create a folder', function() {
    var test_file_path = 'new_folder';
    buildDirectoryStructure(test_file_path).should.equal.true;
  });

  it('it should successfully create a sequence of folders', function() {
    var test_file_path = '/path/to/the/new_folder';
    buildDirectoryStructure(test_file_path).should.equal.true;
  });
});

describe('#cycleArray', function(){
  it('it should successfully cycle through an array of javascript files', function() {
    var test_file_list = [
      '/path/to/javascript1.js', 
      '/path/to/javascript2.js', 
      '/path/to/javascript3.js'
    ];
    var test_type = 'js';
    var test_url = 'http://google.com'
    cycleArray(test_file_list, test_type, test_url).should.equal.true;
    cycleArray(test_file_list, test_type, test_url).should.not.throw();
  });
  it('it should successfully cycle through an array of css files', function() {
    var test_file_list = [
      '/path/to/stylesheet1.css', 
      '/path/to/stylesheet2.css', 
      '/path/to/stylesheet3.css'
    ];
    var test_type = 'css';
    var test_url = 'http://google.com'
    cycleArray(test_file_list, test_type, test_url).should.equal.true;
    cycleArray(test_file_list, test_type, test_url).should.not.throw();
  });
  it('it should successfully cycle through an array of image files', function() {
    var test_file_list = [
      '/path/to/image1.jpg', 
      '/path/to/image2.png', 
      '/path/to/image3.gif'
    ];
    var test_type = 'css';
    var test_url = 'http://google.com'
    cycleArray(test_file_list, test_type, test_url).should.equal.true;
    cycleArray(test_file_list, test_type, test_url).should.not.throw();
  });
});

describe('#downloadFile', function(){
  it('it should successfully download a CSS file to the given location', function() {
    var test_source = 'http://discover.com/discover/jscripts/acquisitions/mbox.js';
    var test_destination = '/discover/jscripts/acquisitions/mbox.js';
    downloadFile(test_source, test_destination).should.equal.true;
  });

  it('it should successfully download a JS file to the given location', function() {
    var test_source = 'http://discover.com/discover/jscripts/acquisitions/mbox.js';
    var test_destination = '/discover/jscripts/acquisitions/mbox.js';
    downloadFile(test_source, test_destination).should.equal.true;
  });
});

describe('#downloadImageFile', function(){
  it('it should successfully download an image file to the given location', function() {
    var test_source = 'http://discover.com/discover/jscripts/acquisitions/mbox.js';
    var test_destination = '/discover/jscripts/acquisitions/mbox.js';
    downloadFile(test_source, test_destination).should.equal.true;
  });
});