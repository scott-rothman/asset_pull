# asset_pull

asset_pull is a node module that accepts a remote live URL and will download any associated CSS, JS, and image assets linked to the page.

The module is run without arguments.  Once run, it will prompt the user for a full remote URL (eg. http://google.com)

Upon successful completion, the module will dump the assets into a 'live_assets' folder, one directory level above where the module lives.
