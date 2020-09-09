'use strict'
const chalk = require('chalk')
const socket = require('socket.io-client')('http://localhost:3002')
const inquirer = require('inquirer')
const {
  login,
  signInUsername,
  signInPassword,
  roomMenu,
  message,
  users,
  whisper
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
      let input = await inquirer.prompt(message)
      const cmd = input.chat
      if (cmd[0] === '/') {
        await this.handleCommand(cmd)

      } else if (!cmd.length) {
        // setTimeout(() => {
        //   this.listenForChat()
        // }, 0);
      } else {
        await socket.send({ cmd, username: socket.username })
        // setTimeout(() => {
        //   this.listenForChat()
        // }, 0);
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
  invalidRoomHandler = (error) => {
    ui.log.write(chalk.red(`SERVER ERROR: ${error.error}`))
  }

  unavailableHandler = (error) => {
    ui.log.write(chalk.red(`SERVER ERROR: ${error.error}`))
  }

  handleWhisperMenu = async (list, cb) => {
    ui.log.write(chalk.red(`SERVER: List of connected users`))
    list.forEach(user => {
      ui.log.write(chalk.red(user))
    })
    ui.log.write(chalk.red(`SERVER: To direct message a user, type "/whisper <username> <message>"`))
    // users.choices = list
    // const input = await inquirer.prompt([users, whisper])
    // console.log(input)
    // socket.emit('whisper', input)
    // setTimeout(() => {
    //   cb()
    // }, 0)
  }
  
  handleJoinMenu = async (list, cb) => {
    ui.log.write(chalk.red(`SERVER: List of rooms`))
    list.forEach(room => {
      ui.log.write(chalk.red(room))
    })
    ui.log.write(chalk.red(`SERVER: To join a separate room, type "/join <room name>"`))
    
    // roomMenu.choices = list
    // const input = await inquirer.prompt([roomMenu])
    // socket.emit('join', input)
    // setTimeout(() => {
    //   cb()
    // }, 0)
  }

  handleJoined = (room) => {
    ui.log.write(chalk.red(`SERVER: Joined ${room}`))
  }

  // TODO: case 'help' to print all commands and their functionality
  handleCommand = async (cmd) => {
    const command = cmd.match(/[a-z]+\b/)[0]
    const args = cmd.match(/[a-z-]+\b/g)[1]
    let message;
    if(args){
      message = cmd.substr(command.length + args.length + 3, cmd.length)    
    }      
    switch (command) {
      case 'join': // ie: foobar
        if(args) {
          await socket.emit('join', args)
        } else {
          await socket.emit('getrooms')
        }
        break
      case 'exit': // /exit
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