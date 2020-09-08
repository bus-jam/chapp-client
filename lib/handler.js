'use strict'
const chalk = require('chalk')
const socket = require('socket.io-client')('http://localhost:3000')
const inquirer = require('inquirer')
const {
  login,
  signInUsername,
  signInPassword,
  menu,
  message,
  users,
  whisper
} = require('../utils/questions')

class eventHandlers {

  loginOrSignup = () => {
    inquirer.prompt([login]).then(answers => {
      if (answers.answer === 'sign-in') {
        inquirer.prompt([signInUsername, signInPassword]).then(user => {
          socket.emit('signin', user)
        })
      } else {
        inquirer.prompt([signInUsername, signInPassword]).then(user => {
          socket.emit('signup', user)
        })
      }
    })
  }
  listenForChat = () => {
  inquirer.prompt(message).then(message => {
    const cmd = message.chat
    if (cmd[0] === '/') {
      this.handleCommand(cmd)
    } else if (!cmd.length) {
      this.listenForChat()
    } else {
      socket.send({ cmd, username: socket.username })
      this.listenForChat()
    }
  })
}
invalidLoginHandler = (error, cb) => {
  console.log(chalk.red(`SERVER ERROR: ${error.err}`))
  cb()
}
connected = (username, cb) => {
  console.log(chalk.red(`=== start chatting ${username} ===`))
  cb()
}
messageHandler = (data, cb) => {
  const { cmd, username } = data
  console.log(chalk.green(`${username}: ${cmd.split('\n')[0]}`))
  cb()
}
whisperHandler = (data, cb) => {
  const { message, user } = data
  console.log(chalk.blue(`Whisper from ${user}: ${message}`))
  cb()
}
toxicHandler = (data, cb) => {
  const { cmd } = data
  console.log(chalk.red(`SERVER: ${cmd.split('\n')[0]}`))
  cb()
}
invalidRoomHandler = (error, cb) => {
  console.log(chalk.red(`SERVER ERROR: ${error.error}`))
  cb()
}
handleCommand = (cmd) => {
  const command = cmd.match(/[a-z]+\b/)[0]
  const args = cmd.match(/[a-z-]+\b/g)[1]
  let message;
  if(args){
    message = cmd.substr(command.length + args.length + 3, cmd.length)    
  }      
  switch (command) {
    case 'join': // ie: foobar
      if(args) {
        socket.emit('join', args)
      } else {
        socket.emit('getrooms')
        socket.on('sendrooms', (list) => {
          menu.choices = list
          inquirer.prompt([menu]).then(choice => {
            socket.emit('join', choice)
          })
        })
      }
      break
    case 'getusers':
      socket.emit('getusers')
      socket.on('sendusers', (list) => {
        users.choices = list;
        inquirer.prompt([users, whisper]).then(choice => {
          socket.emit('whisper', choice)
        })
      })
    case 'exit': // /exit
      socket.emit('disconnected', socket.username)
      process.exit(0)
    case 'whisper':
      if(args) {
        socket.emit('whisper', { user: args, message })
        this.listenForChat()          
      } else {
        socket.emit('getusers')
        socket.on('sendusers', (list) => {
          users.choices = list;
          inquirer.prompt([users, whisper]).then(choice => {
            socket.emit('whisper', choice)
          })
        })
        this.listenForChat()
      }
      break
    default:
      this.listenForChat()
  }
}
}

module.exports = {
    eventhandlers : new eventHandlers(),
    socket,
}