casper.test.begin('Successful Submit', 1, function suite(test) {
  casper.start('index.js', function() {
    console.log('test started');
  });
  casper.run(function() {
    test.done();
  });
});