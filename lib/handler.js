'use strict'
const chalk = require('chalk')
const socket = require('socket.io-client')('https://bus-jam-chapp-server.herokuapp.com/')
const inquirer = require('inquirer')
const {
  login,
  signInUsername,
  signInPassword,
  message,
} = require('../utils/questions')
let ui = new inquirer.ui.BottomBar();

class eventHandlers {
  // TODO: normalize callback naming convention
  // TODO: normalize variable naming convention

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
  listenForChat = async () => {
    while(true){
      let input = await inquirer.prompt(message)
      const cmd = input.chat
      if (cmd[0] === '/') {
        await this.handleCommand(cmd)
      } else if (cmd) {
        await socket.send({ cmd, username: socket.username })
      } else {
        
      }
    }
  }

  invalidLoginHandler = (error, cb) => {
    ui.log.write(chalk.red(`SERVER ERROR: ${error.error}`))
    setTimeout(() => {
      cb()
    }, 0)
  }
  connected = (username, cb) => {
    ui.log.write(chalk.red(`=== start chatting ${username} ===`))
    setTimeout(() => {
      cb()
    }, 0)
  }
  messageHandler = (data) => {
    const { cmd, username } = data
    ui.log.write(chalk.green(`${username}: ${cmd.split('\n')[0]}`))
  }
  whisperHandler = (data) => {
    const { message, user } = data
    ui.log.write(chalk.blue(`Whisper from ${user}: ${message}`))
  }
  toxicHandler = (data) => {
    const { cmd } = data
    ui.log.write(chalk.red(`SERVER: ${cmd.split('\n')[0]}`))
  }

  errorHandler = (error) => {
    ui.log.write(chalk.red(`SERVER ERROR: ${error.error}`))
  }
  
  handleMenu = async (list, arr) => {
    ui.log.write(chalk.red(`SERVER: ${arr[0]}`))
    list.forEach(str => {
      ui.log.write(chalk.blue(str))
    })
    ui.log.write(chalk.red(`SERVER: ${arr[1]}`))
  }

  handleJoined = (room) => {
    ui.log.write(chalk.red(`SERVER: Joined ${room}`))
  }

  // TODO: case 'help' to print all commands and their functionality
  // BUG: /exit causes stack overflow. I cant figure
  handleCommand = async (cmd) => {
    const command = cmd.match(/[a-z]+\b/)[0]
    const args = cmd.match(/[a-z-]+\b/g)[1]
    let message;
    if(args){
      message = cmd.substr(command.length + args.length + 3, cmd.length)    
    }      
    switch (command) {
      case 'join': 
        if(args) {
          await socket.emit('join', args)
        } else {
          await socket.emit('getrooms')
        }
        break
      case 'exit': 
        socket.emit('disconnected', socket)
        process.exit(0)
      case 'whisper':
        if(args) {
          socket.emit('whisper', { user: args, whisper:message })
        } else {
          socket.emit('getusers')          
        }
        break
      default:
  
    }
  }
}

module.exports = {
    eventhandlers : new eventHandlers(),
    socket,
}