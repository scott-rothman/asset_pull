var fs = require('fs'), 
  request = require('request'),
  cheerio = require('cheerio'),
  prompt = require('prompt'),
  readline = require('readline'),
  colors = require('colors'),
  rl = readline.createInterface(process.stdin, process.stdout),
  url = '';
  
  //Build initial directory
  try {
    fs.mkdirSync('../live_assets/');  
  }
  catch(err) {
    if (err.code != 'EEXIST') {
      console.log(err.bold.red);
    }
  }

  //Display prompt for user, accept input
  console.log('\r\r****************************************************\r\r'.cyan);
  console.log('* Asset Pull\r'.cyan);
  console.log('****************************************************\r\r'.cyan);
  rl.setPrompt('Please enter URL: '.blue);
  rl.prompt();
  rl.on('line', function(line) {
    url = line;
    base_url = url.substring(0, url.indexOf('.com')+4);
    console.log('Base URL: '+base_url);
    rl.close();
  }).on('close', function(){
    console.log('\r\r');
    console.log('Parsing files from:\r'.cyan);
    console.log(url);
    console.log('****************************************************\r\r'.cyan);
    request(url, function (error, response, body) {
      if (!error) {
        var $ = cheerio.load(body),
        page_content = $("html").html(),
        js_files = [],
        css_files = [];
        console.log(base_url);
        js_files = parseForTags(page_content, 'js');
        css_files = parseForTags(page_content, 'css');
        img_files = parseForTags(page_content, 'img');
        cycleArray(js_files, 'js', base_url);
        cycleArray(css_files, 'css', base_url);
        cycleArray(img_files, 'img', base_url);

        downloadCSSImages(css_files, base_url);

      } else {
        console.log("We’ve encountered an error: " + error.bold.red);
      }
    });
});

function parseForTags(html_content, type) {
  //Accepts type as 'js' or 'css'
  var matches = [],
    files_to_return = [],
    regex_js = /<script\b[^>]*>([\s\S]*?)<\/script>/gm,
    regex_css = /<link\b[^>]*>([\s\S]*?)/gm,
    regex_img = /<img\b[^>]*>([\s\S]*?)/gm;

  if (typeof html_content != 'string' || typeof type != 'string') {
    console.log('Parsing error.'.bold.red)
    return false;
  }

  if (type == 'js') {
    console.log('Parsing for javascript tags \r\r'.cyan);
    while (matches = regex_js.exec(html_content)) {
      files_to_return.push(matches[0]);
    }
  } else if (type == 'css') {
    console.log('Parsing for CSS tags \r\r'.cyan);
    while (matches = regex_css.exec(html_content)) {
      files_to_return.push(matches[0]);
    }
  } else if (type == 'img') {
    console.log('Parsing for IMG tags \r\r'.cyan);
    while (matches = regex_img.exec(html_content)) {
      files_to_return.push(matches[0]);
    }
  }
  console.log(files_to_return.length + " tags found.".blue);

  if (files_to_return.length > 0) {
    return files_to_return;  
  } else {
    return 0;
  }
  
}

function buildDirectoryStructure(file_path) {
  var folders = file_path.split('/'),
  newFolder = '';
  for (var i = 0; i < folders.length; i++) {
    if (folders[i].indexOf('.js') < 0 && 
        folders[i].indexOf('.css') < 0 && 
        folders[i].indexOf('.jpg') < 0 &&
        folders[i].indexOf('.png') < 0 &&
        folders[i].indexOf('.gif') < 0) {
      newFolder += folders[i] + '/';
    }
    if (newFolder.charAt(0) == '/') {
      newFolder.slice(1);
    }
    try {
      fs.mkdirSync('../live_assets/'+newFolder);
    }
    catch(err) {
      if(err.code != 'EEXIST') {
        console.log(err.red);
        return false;
      }
    }
  }
  return true;
}

function cycleArray(file_list, type, url) {
  var num_files = file_list.length,
  x=0,
  testString = '',
  startPos = 0,
  endPos = 0,
  source = '',
  destination = '',
  file_contents = '';

  while (x < num_files) {
    if (type == 'js') {
      if (typeof file_list[x] !== 'undefined' && typeof file_list[x] !== undefined) {
        if (file_list[x].indexOf('<script>') < 0 && file_list[x].indexOf('//') < 0 && file_list[x].indexOf(' src=') >= 0 && file_list[x].indexOf('.js') >= 0) {
          try {
            //Account for src= and quote mark prefix
            startPos = file_list[x].indexOf('src=') + 5;
            //Account for .js and quote suffix
            endPos = file_list[x].indexOf('.js') + 3;
            source = url + file_list[x].substring(startPos,endPos);
            destination = file_list[x].substring(startPos,endPos);
            if (destination.charAt(0) == '/') {
              destination.slice(1);
            }  
          }
          catch(err) {
            console.log(err);
            return false;
          }
          finally {
            downloadFile(source, destination);  
          }
        }
      }
    } else if (type == 'css') {
      if (typeof file_list[x] !== 'undefined' && typeof file_list[x] !== undefined) {
        if (file_list[x].indexOf('<link>') < 0 && file_list[x].indexOf(' href=') >= 0 && file_list[x].indexOf('.css') >= 0) {
          try {
            //Account for href= and quote mark prefix
            startPos = file_list[x].indexOf('href=') + 6;
            //Account for .css and quote suffix
            endPos = file_list[x].indexOf('.css') + 4;
            source = url + file_list[x].substring(startPos,endPos);
            destination = file_list[x].substring(startPos,endPos);
            if (destination.charAt(0) == '/') {
              destination.slice(1);
            }  
          }
          catch(err) {
            console.log(err);
            return false;
          }
          finally {
            downloadFile(source, destination);  
          }
        }    
      }
    } else if (type == 'img') {
      if (typeof file_list[x] !== 'undefined' && typeof file_list[x] !== undefined) {
        if (file_list[x].indexOf('//') < 0 ) {
          try {
            //Account for href= and quote mark prefix
            startPos = file_list[x].indexOf('src=') + 5;
            //Account for .css and quote suffix
            if (file_list[x].indexOf('.jpg') >= 0) {
              endPos = file_list[x].indexOf('.jpg') + 4;  
            } else if (file_list[x].indexOf('.png') >= 0) {
              endPos = file_list[x].indexOf('.png') + 4;  
            } else if (file_list[x].indexOf('.gif') >= 0) {
              endPos = file_list[x].indexOf('.gif') + 4;  
            } else {
              return false;
            }
            source = url + '/' + file_list[x].substring(startPos,endPos);
            destination = file_list[x].substring(startPos,endPos);
            if (destination.charAt(0) == '/') {
              destination.slice(1);
            }
          }
          catch(err) {
            console.log(err);
            return false;
          }
          finally {
            downloadImageFile(source, destination);
          }
        }
      }
    }
    x++;
  }
  return true;
}

function downloadFile(source, destination) {
  var file_contents = '';
  var request = require('request');
  buildDirectoryStructure(destination);
  request(source, function(error, response, body){
    if (!error && response.statusCode == 200) {
      file_contents = body;
      if (destination.charAt(0) == '/') {
        destination = '../live_assets'+destination;  
      } else {
        destination = '../live_assets/'+destination;
      }
      try {
        console.log('Writing to: ' + destination.cyan);
        fs.writeFileSync(destination, file_contents);
        return true;
      }
      catch(err) {
        if (err.code != 'EEXIST') {
          console.log('Error writing file'.bold.red); 
          console.log('Trying to write to: '+destination);
          console.log(err);
          return false;
        }
      }
    } else {
      console.log(error);
      return false;
    }
  });
  return true;
}

function downloadImageFile(source, destination) {
  if (destination.charAt(0) == '/') {
      destination = '../live_assets'+destination;  
    } else {
      destination = '../live_assets/'+destination;
    }
  buildDirectoryStructure(destination);
  try {
    request(source).pipe(fs.createWriteStream(destination));
    console.log('Writing to: ' + destination.cyan);
  }
  catch(err) {
    console.log(err);
  }
}

function downloadCSSImages(cssFiles, base_url) {
  var regex_img = /url\('(.*)[^');]/ig,
    image_path = '',
    remote_path = '',
    local_path = '';
  for (var i = 0; i < cssFiles.length; i++) {
    request(url, function (error, response, body) {
      if (!error) {
        //Ensure that CSS is using single quotes for parsing reasons
        body = body.replace('"', '\'');
        while (matches = regex_img.exec(body)) {
          //This ugly mess of a line removes all other CSS associated with the background-image declaration, leaivng only the URL
          image_path = matches[0].split('\')')[0].replace('url(\'','');
          local_path = image_path;
          remote_path = base_url + image_path;
          downloadImageFile(remote_path, local_path);
        }
      } else {
        console.log("We’ve encountered an error: " + error.bold.red);
      }
    });
  }
}