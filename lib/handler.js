'use strict'
require('dotenv').config()
const chalk = require('chalk')
const server = process.env.SERVER || 'https://bus-jam-chapp-server.herokuapp.com/';
const socket = require('socket.io-client')(server)
const inquirer = require('inquirer')
const {
  login,
  signInUsername,
  signInPassword,
  messagePrompt,
} = require('../utils/questions')
let ui = new inquirer.ui.BottomBar();

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

  listenForChat = async () => {
    while(true){
      let input = await inquirer.prompt(messagePrompt)
      const message = input.chat
      if (message[0] === '/') {
        await this.handleCommand(message)
      } else if (message) {
        await socket.send({ message, username: socket.username })
      } 
    }
  }

  invalidLoginHandler = (error, cb) => {
    ui.log.write(chalk.red(`SERVER ERROR: ${error.error}`))
      cb()
  }

  connected = (username, cb) => {
    ui.log.write(chalk.red(`=== start chatting ${username} ===`))
      cb()
  }

  messageHandler = (data) => {
    const { message, username } = data
    ui.log.write(chalk.green(`${username}: ${message.split('\n')[0]}`))
  }

  whisperHandler = (data) => {
    const { message, username } = data
    ui.log.write(chalk.blue(`Whisper from ${username}: ${message}`))
  }
  
  toxicHandler = (data) => {
    const { message } = data
    ui.log.write(chalk.red(`SERVER: ${message.split('\n')[0]}`))
  }

  errorHandler = (error) => {
    ui.log.write(chalk.red(`SERVER ERROR: ${error.error}`))
  }
  
  menuHandler = async (list, arr) => {
    ui.log.write(chalk.red(`SERVER: ${arr[0]}`))
    list.forEach(str => {
      ui.log.write(chalk.blue(str))
    })
    ui.log.write(chalk.red(`SERVER: ${arr[1]}`))
  }

  joinedHandler = (room) => {
    ui.log.write(chalk.red(`SERVER: Joined ${room}`))
  }

  helpHandler = (count) => {
    ui.log.write(chalk.red(`SERVER: Help Menu`))
    ui.log.write(chalk.red(`Type /join to view available chat rooms`))
    ui.log.write(chalk.blue(`/join <room> or /join`))
    ui.log.write(chalk.red(`Type /whisper to view who is online and available to chat - there are currently ${count} users active on Chapp`))
    ui.log.write(chalk.blue(`/whisper <username> <message> or /whisper`))
    ui.log.write(chalk.red(`Type /exit to end your session`))
  }

  handleCommand = async (cmd) => {
    const command = cmd.match(/[a-z0-9]+\b/)[0]
    const args = cmd.match(/[a-zA-Z0-9]+\b/g)[1]
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
        process.exit(0)
      case 'whisper':
        if(args) {
          socket.emit('whisper', { username: args, message:message })
        } else {
          socket.emit('getusers')          
        }
        break
      case 'help':
        socket.emit('help')
        break
      default:
        socket.emit('help')
    }
  }
}

module.exports = {
    eventhandlers : new eventHandlers(),
    socket,
    ui
}