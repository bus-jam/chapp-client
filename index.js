'use strict';

// const repl = require('repl');
const chalk = require('chalk');
// FROM https://blog.bitsrc.io/build-a-command-line-real-time-chat-app-using-socketio-f2e3553d6228
const socket = require('socket.io-client')('http://localhost:3002');
let os = require('os')
let username = null;
const readline = require('readline');
const inquirer = require('inquirer');

// const rl = readline.createInterface(process.stdin, process.stdout)
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



socket.on('disconnect', () => {
    socket.emit('disconnect');
});

socket.on('connect', () => {
    username = os.userInfo().username || 'guest';
    inquirer.prompt([login]).then(answers => {
      if(answers.answer === 'sign-in'){
        inquirer.prompt([signinUsername,signinPassword]).then(user => {
          socket.emit('signin', user)
        });
      } else {
        inquirer.prompt([signinUsername,signinPassword,signinPassword]).then(user => {
          socket.emit('signup', user)
        });
      }
    })
   
   
    // console.log(chalk.red(`=== start chatting ${username} ===`));
    // rl.question(`Hello, sign in or sign up?`, (cmd) => {
    //   console.log('cmd', cmd)
    //   if(cmd === 'sign in'){
    //     const signInData = {
    //       username: rl.question('Please enter your username:', name => name),
    //       password: rl.question('Please enter a password:', pw => pw),
    //     }
    //     socket.send('sign-in', signInData)
        
    //   }
    // })
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

// rl.on('line', (line) => {
// socket.send({line, username})
// rl.prompt(true)
// });
// repl.start({
//     prompt: '',
//     terminal: false,
//     eval: (cmd) => {
//       socket.send({cmd, username});
    
//     }
  
// });


// rl.question('What is your ;', (name) => {
//   let message = `${name} has joined the chat`;
//   rl.prompt(true);
// });