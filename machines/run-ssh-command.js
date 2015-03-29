module.exports = {


  friendlyName: 'Run SSH Command',


  description: 'Run a command on a remote server via SSH. Requires Host, Username, Password and ommand.',


  extendedDescription: '',


  inputs: {

     hostName: {
      example: '127.0.0.1',
      description: 'The hostname or IP of the server you would like to SSH into.',
      required: true
    },
    userName: {
      example: 'user1',
      description: 'The username of the account you would like to SSH into the remote server with.',
      required: true
    },
    password: {
      example: '',
      description: 'The password for your user account on the remote server.',
      required: true
    },
    command: {
      example: 'mkdir testfolder' ,
      description: 'The command you wish to execute on the remote machine. For SFTP transfers, use the SFTP function.',
      required: true
    }
  },



  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Returns output from the remote server.',
      example: 'Connection Successful.'
    }
 },


  fn: function (inputs, exits)  {

    var Client = require('ssh2').Client;
    // Debugging? Un-comment the console.log lines.
    var conn = new Client();

    conn.on('ready', function() {
    // console.log('Client :: ready');
    conn.exec(inputs.command, function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: inputs.hostName,
    port: 22,
    username: inputs.userName,
    password: inputs.password
  });


    return exits.success();
  },



};
