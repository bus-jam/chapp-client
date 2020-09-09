'use strict'
const chalk = require('chalk')
const socket = require('socket.io-client')('http://localhost:3002')
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
let count = 0;
let ui = new inquirer.ui.BottomBar();
const EventEmitter = require('events');
const fs = require('fs');
// const read = fs.createReadStream(process.mainModule.path);
// const write = fs.createWriteStream('/');
// outputStream.pipe(ui.log)
// emitter.setMaxListeners(0)
const readline = require('readline');
const stack = []
const stream = require('stream')
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
    count++
    ui.log.write(count)
    let input = await inquirer.prompt(message)
    const cmd = input.chat
    if (cmd[0] === '/') {
          this.handleCommand(cmd)
        } else if (!cmd.length) {
          setTimeout(() => {
            this.listenForChat()
          }, 0);
        } else {
          socket.send({ cmd, username: socket.username })
          setTimeout(() => {
            this.listenForChat()
          }, 0);
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
      this.listenForChat()
    }, 0)
  }
  messageHandler = (data, cb) => {
    const { cmd, username } = data
    ui.log.write(chalk.green(`${username}: ${cmd.split('\n')[0]}`))
    // setTimeout(() => {
    //   cb()
    // }, 0)
  }
  whisperHandler = (data, cb) => {
    const { message, user } = data
    ui.log.write(chalk.blue(`Whisper from ${user}: ${message}`))
    // setTimeout(() => {
    //   cb()
    // }, 0)
  }
  toxicHandler = (data, cb) => {
    const { cmd } = data
    ui.log.write(chalk.red(`SERVER: ${cmd.split('\n')[0]}`))
    // setTimeout(() => {
    //   cb()
    // }, 0)
  }
  invalidRoomHandler = (error, cb) => {
    ui.log.write(chalk.red(`SERVER ERROR: ${error.error}`))
    // setTimeout(() => {
    //   cb()
    // }, 0)
  }

  unavailableHandler = (error, cb) => {
    ui.log.write(chalk.red(`SERVER ERROR: ${error.error}`))
    // setTimeout(() => {
    //   cb()
    // }, 0)
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
              setTimeout(() => {
                this.listenForChat()          
              }, 0)
            })
          })
        }
        break
      case 'getusers':
        socket.emit('getusers')
        socket.on('sendusers', (list) => {
          ui.log.write(chalk.red(`SERVER: List of connected users`))
          list.forEach( user => {
            ui.log.write(chalk.green(`${user}`))
          })
        })
        setTimeout(() => {
          this.listenForChat()          
        }, 0)
      case 'exit': // /exit
        socket.emit('disconnected', socket)
        process.exit(0)
      case 'whisper':
        if(args) {
          socket.emit('whisper', { user: args, message })
          setTimeout(() => {
            this.listenForChat()          
          }, 0)
        } else {
          socket.emit('getusers')
          socket.on('sendusers', (list) => {
            users.choices = list;
            inquirer.prompt([users, whisper]).then(choice => {
            socket.emit('whisper', choice)
            })
          })
          setTimeout(() => {
            this.listenForChat()
          }, 0)
        }
        break
      default:
        setTimeout(() => {
          this.listenForChat()
        }, 0)
    }
  }
}

module.exports = {
    eventhandlers : new eventHandlers(),
    socket,
}