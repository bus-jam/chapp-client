'use strict';

// const repl = require('repl');
const chalk = require('chalk');
// FROM https://blog.bitsrc.io/build-a-command-line-real-time-chat-app-using-socketio-f2e3553d6228
const socket = require('socket.io-client')('http://localhost:3002');
let os = require('os')
let username = null;
const readline = require('readline');
const inquirer = require('inquirer');
const repl = require('repl');

const ui = new inquirer.ui.BottomBar();
const rl = readline.createInterface(process.stdin, process.stdout)
const login = {
  type: 'list',
  name: 'answer',
  message: 'Sign-in or sign-up',
  choices: ['sign-in','sign-up']
}

const signinUsername = {
  type: 'input',
  name: 'username',
  message: 'Enter your username',
}

const signinPassword = {
  type: 'password',
  name: 'password',
  message: 'Enter your password',
}

const menu = {
  type: 'list',
  name: 'room',
  choices: [
    
  ]// socket.emit('getrooms'),
}

const message = {
  type: 'input',
  name: 'cmd',
  message: '',
}

socket.on('disconnect', () => {
    socket.emit('disconnect');
});

socket.on('connect', () => {
    username = os.userInfo().username || 'guest';
    inquirer.prompt([login]).then(answers => {
      if(answers.answer === 'sign-in'){
        inquirer.prompt([signinUsername,signinPassword]).then(user => {
          socket.emit('signin', user);
          ui.log.write(chalk.red(`=== start chatting ${user.username} ===`));
          inquirer.prompt(message).then(message => {
            console.log('i am here', message);
            const { cmd } = message;
            socket.send({cmd, username:'null'})
          });
          
        });
      } else {
        inquirer.prompt([signinUsername,signinPassword]).then(user => {
          socket.emit('signup', user);
        });
      }
    });
});

socket.on('invalid-login', () => {
  // populate me later
});


socket.on('connected', (username) => {
  ui.log.write(chalk.red(`=== start chatting ${username} ===`));
});

socket.on('join', (user, room) => {
  console.log(chalk.red(`${user} joined the room ${room}`));
});

socket.on('message', data => {
    const { cmd, username } = data;
    // console.log('data', data);
    console.log(chalk.green(`${username}: ${cmd.split('\n')[0]}`));
});

socket.on('toxic', data => {
  const { cmd } = data;
  console.log(chalk.red(`SERVER: ${cmd.split('\n')[0]}`))  
});

//   repl.start({
//     prompt: '',
//     terminal: false,
//     eval: (cmd) => {
//       socket.send({cmd, username});
//     }
// });

