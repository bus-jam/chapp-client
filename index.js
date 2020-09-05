'use strict';

const repl = require('repl');
const chalk = require('chalk');
// FROM https://blog.bitsrc.io/build-a-command-line-real-time-chat-app-using-socketio-f2e3553d6228
const socket = require('socket.io-client')('http://localhost:3002');
let os = require('os')
let username = null;





socket.on('disconnect', () => {
    socket.emit('disconnect');
});

socket.on('connect', () => {
    username = os.userInfo().username || 'guest';
    console.log(chalk.red(`=== start chatting ${username} ===`));
});
socket.on('key', key => {
  console.log(key)
})

socket.on('message', data => {
    const { cmd, username } = data;
    // console.log('data', data);
    console.log(chalk.green(`${username}: ${cmd.split('\n')[0]}`));
});

socket.on('toxic', data => {
  const { cmd } = data;
  console.log(chalk.red(`SERVER: ${cmd.split('\n')[0]}`))  
});


repl.start({
    prompt: '',
    terminal: false,
    eval: (cmd) => {
      socket.send({cmd, username});
    
    }
  
});

