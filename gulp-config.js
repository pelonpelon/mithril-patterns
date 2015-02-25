'use strict';

var version = 'app'; // or basename
var build = './build';
var dest = build + '/' + version;
var src = './src';
var dist = './dist';
var styles = src + '/styles/' + version + '.styl';
var remoteHost = 'sf-eagle.com';
var remotePath = '/var/chroot/home/content/20/9803620/html/';
var remoteUser = 'sfeagleftp';

module.exports = {

  dest: dest,
  src: src,
  dist: dist,
  version: version,
  styles: styles,
  remoteHost: remoteHost,
  remotePath: remotePath,
  remoteUser: remoteUser,

  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [build, src]
    },
    files: [
      build + '/**',
      // Exclude Map files
      '!' + build + '/**.map'
    ]
  },
  jade: {
    // src: src + '/jade/*.jade',
    // dest: dest
  },
  stylus: {
    // src: src + '/styles/' + version + '.styl',
    // dest: dest + '/css'
  },
  sass: {
    // src: src + '/sass/' + version + '.scss',
    // dest: dest
  },
  images: {
    // src: src + '/assets/images/**',
    // dest: dest + '/images'
  },
  markup: {
    // src: src + '/htdocs/**',
    // dest: dest
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    extensions: ['.coffee'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/coffee/' + version + '.coffee',
      dest: dest,
      outputName: 'main.js'
    }]
  },
  rsync: {
    src: dist,
    dest: remoteUser + '@' + remoteHost + ':' + remotePath
  }
};
