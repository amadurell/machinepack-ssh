module.exports = {


  friendlyName: 'Run SSH Command w/ Keys',


  description: 'Run a command on a remote server via SSH. Requires Host, Username, Password and ommand.',


  extendedDescription: '',


  inputs: {

     hostName: {
      example: '127.0.0.1',
      description: 'The hostname or IP of the server you would like to SSH into. Do not include the port.',
      required: true
    },
    port: {
      example: '22',
      description: 'The port you wish to connect through on the remote server. This is usually 22 by default.',
      required: true
    },
    userName: {
      example: 'user1',
      description: 'The username of the account you would like to SSH into the remote server with.',
      required: true
    },
    privatekey: {
      example: '',
      description: 'The location of your private key on the local server. DO NOT enter the key its self as text!',
      required: true
    },
    command: {
      example: 'mkdir testfolder' ,
      description: 'The command you wish to execute on the remote machine. For SFTP transfers, use the SFTP function.',
      required: true
    }
  },



  defaultExit: 'close',
  exits: {
    close: {
      description: 'Connection closed.'
    },
    error: {
      description: 'Unexpected error occurred.'
    },
    stderr: {
      description: 'Returns stderr output from the remote server.'
    },
    stdout: {
      description: 'Returns output from the remote server.'
    }
 },


  fn: function (inputs, exits)  {

    var Client = require('ssh2').Client;
    // Debugging? Un-comment the console.log lines.
    var conn = new Client();
    var alldata = '';

    conn.on('error', function(err){
      // console.log(`Client :: error ${err}`);
      return exits.error(err);
    });

    conn.on('ready', function() {
    // console.log('Client :: ready');
    conn.exec(inputs.command, function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
        return exits.close(alldata);
      });
      stream.on('data', function(data) {
        // console.log('STDOUT: ' + data);
        alldata += data;
        return exits.stdout(data);
      });
      stream.stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
        alldata += data;
        return exits.stderr(data);
      });
    });

  });

  conn.connect({
    host: inputs.hostName,
    port: inputs.port,
    username: inputs.userName,
    privateKey: require('fs').readFileSync(inputs.privateKey)
  });



  },



};
