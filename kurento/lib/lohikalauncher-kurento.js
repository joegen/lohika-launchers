'use strict';

var debug = require('debug')('launchers::kurento');
var path = require('path');

var Launcher = require('lohikalauncher');
var configuratorFactory = require('configurator');
var async = require('async');
var launcher = new Launcher();

// get the parameters
var program = require('commander');

function list(val) {
  return val.split(",");
}

program
  .version('0.1.0')
  .usage('[options] <fileIn,fileOut>')
  .option('-m, --maincfg <value>', 'Main KMS Config File', list)
  .option('-e, --mediacfg <value>', 'Media Elements Config File', list)
  .option('-s, --sdpcfg <value>', 'Audio/Video SdpEndpoints Config File', list)
  .option('-t, --httpcfg <value>', 'HttpEndpoint Config File', list)
  .option('-w, --webrtccfg <value>', 'WebRtcEndpoint Config File', list)
  .parse(process.argv);

var DEFAULT_MAINCFG_INPUT_FILE = path.join(__dirname,'../../test/kurento/files/input/kurento.conf.json');
// default kurento installation config
var DEFAULT_MAINCFG_OUTPUT_FILE = '/etc/kurento/kurento.conf.json';
var DEFAULT_MEDIAELEMENTCFG_OUTPUT_FILE = '/etc/kurento/modules/kurento/MediaElement.conf.ini';
var DEFAULT_SDPENDPOINTS_OUTPUT_FILE = '/etc/kurento/modules/kurento/SdpEndpoint.conf.ini';
var DEFAULT_HTTPENDPOINT_OUTPUT_FILE = '/etc/kurento/modules/kurento/HttpEndpoint.conf.ini';
var DEFAULT_WEBRTCENDPOINT_OUTPUT_FILE = '/etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini';

function getDefaultOutputFile(option) {
  if (option == 'maincfg') {
    return DEFAULT_MAINCFG_OUTPUT_FILE;
  } else if (option == 'mediacfg') {
    return DEFAULT_MEDIAELEMENTCFG_OUTPUT_FILE;
  } else if (option == 'sdpcfg') {
    return DEFAULT_SDPENDPOINTS_OUTPUT_FILE;
  } else if (option == 'httpcfg') {
    return DEFAULT_HTTPENDPOINT_OUTPUT_FILE;
  } else if (option == 'webrtccfg') {
    return DEFAULT_WEBRTCENDPOINT_OUTPUT_FILE;
  } else {
    return '';
  }
}

function generateModuleConfig(option, defaultFile, configuratorType, callback) {
  debug('generateModuleConfig(' + option + ',' + defaultFile + ',' + configuratorType + ', callback)');
  // get program args for this submodule
  var fileIn = false;
  var fileOut = defaultFile;
  debug('generateModuleConfig program[option]: [' + program[option] + '] length: [' + program[option].length +']');
  if (program[option]) {
    fileIn = program[option][0];
    if (program[option].length > 1) {
      fileOut = program[option][1];
    }
  }
  debug('Got fileIn: ' + fileIn + ', fileOut: ' + fileOut);
  if (fileIn == false) {
    return callback(null);
  }
  // run generate config
  var options = { type : configuratorType };
  launcher.generateConfig(fileIn, fileOut, options, callback);
}

var programOptions = Object.keys(program.opts());
var len = programOptions.length;
debug ('programOptions: ' + JSON.stringify(programOptions) + ' size: ' + len);

async.each(programOptions, function(element, callback) {
  debug('async-'+ element);
  if (element === 'maincfg'
    || element === 'version'
    || !program[element]) {
    callback();
    return;
  }

  var defaultOutputFile = getDefaultOutputFile(element);
  generateModuleConfig(element, defaultOutputFile, 'ini', callback);

}, function (err) {
  if (err) {
    console.error(' A file failed to process due to ' + err + '.');
    return;
  }
  console.log('All files have been processed succesfully.');
  processMainConfig();
});

var processMainConfig = function() {
  var fileIn = DEFAULT_MAINCFG_INPUT_FILE;
  var fileOut = DEFAULT_MAINCFG_OUTPUT_FILE;

  if (program.maincfg) {
    fileIn = program.maincfg[0];
    if (program.maincfg.length > 1) {
      fileOut = program.maincfg[1];
    }
  }

  var options =  { type : 'json' };
  launcher.generateConfig(fileIn, fileOut, options, function (err, data) {
    debug('generating configuration...');
    if (err) {
      console.log(err);
      return;
    }
    debug('Got data: ' + JSON.stringify(data));
    debug('Got params: ' + data.params);

    launcher.setExecutable(data.executablePrefix + data.executable);

    launcher.start();

    launcher.getEventEmitter().on('stdout_data', function(data) {
      console.log(data.toString());
    });

    launcher.getEventEmitter().on('stderr_data', function(data) {
      console.error(data.toString());
    });

    launcher.getEventEmitter().on('exit', function (code) {
      console.log('Child exited with code', code);
      // process.exit(code);
    });

    launcher.getEventEmitter().on('error', function (error, code) {
      debug('ON ERROR SIGTERM');
      launcher.stop('SIGTERM');
      console.log('Parent exited with code', code, ', Error ', error);
    });

    launcher.getEventEmitter().on('SIGINT', function() {
      debug('on SIGINT');
      launcher.stop('SIGINT');
    });

    process.on('exit', function () {
      debug('Killing process... pid ' + launcher.getPid());
      launcher.stop();
      console.log('done');
    });

  });
}
