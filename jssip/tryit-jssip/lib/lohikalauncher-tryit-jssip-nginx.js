'use strict';

var debug = require('debug')('launchers::tryit-jssip-nginx');
var path = require('path');
var options =  { type : 'nginx' };
var Launcher = require('lohikalauncher');
var configuratorFactory = require('configurator');

var launcher = new Launcher();
var myConfigurator = configuratorFactory.create(options);

// get the parameters
var program = require('commander');

program
  .version('0.0.1')
  .option('-i, --input-file <file>', 'Input File')
  .option('-o, --output-file <file>', 'Output File')
  .parse(process.argv);

var DEFAULT_INPUT_FILE = path.join(__dirname,'conf/tryit-jssip-nginx.conf.json');
// default kurento installation config
var DEFAULT_OUTPUT_FILE = path.join(__dirname,'/conf/tryit-jssip-nginx.conf');

var fileIn = DEFAULT_INPUT_FILE;
var fileOut = DEFAULT_OUTPUT_FILE;

if (program.inputFile) {
  fileIn = program.inputFile;
}

if (program.outputFile) {
  fileOut = program.outputFile;
}

launcher.generateConfig(fileIn, fileOut, options, function (err, data) {
  debug('generating configuration...');
  if (err) {
    console.log(err);
    return;
  }
  debug('Got data: ' + JSON.stringify(data));
  debug('Got params: ' + data.params);

  launcher.setExecutable(data.executablePrefix + data.executable);
  launcher.setArguments(['-c', fileOut]);

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
