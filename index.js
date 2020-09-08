#!/usr/bin/env node
'use strict'
// ================================================================
// Required Libraries

const chalk = require('chalk')
// const socket = require('socket.io-client')('http://localhost:3000')
const { socket } = require('./lib/handler')
const inquirer = require('inquirer')
// const {
//   login,
//   signInUsername,
//   signInPassword,
//   menu,
//   message,
//   users,
//   whisper
// } = require('./utils/questions')
const handlers = require('./lib/handler')
const {
  listenForChat,
  loginOrSignup,
  invalidLoginHandler,
  invalidRoomHandler,
  connected,
  messageHandler,
  whisperHandler,
  toxicHandler
} = handlers.eventhandlers;
// ================================================================

// ================================================================
// Disconnect Event

// const loginOrSignup = () => {
//   inquirer.prompt([login]).then(answers => {
//     if (answers.answer === 'sign-in') {
//       inquirer.prompt([signInUsername, signInPassword]).then(user => {
//         socket.emit('signin', user)
//       })
//     } else {
//       inquirer.prompt([signInUsername, signInPassword]).then(user => {
//         socket.emit('signup', user)
//       })
//     }
//   })
// }

// // ================================================================
// // Listen for Chat Event

// const listenForChat = () => {
//   inquirer.prompt(message).then(message => {
//     const cmd = message.chat
//     if (cmd[0] === '/') {
//       handleCommand(cmd)
//     } else if (!cmd.length) {
//       listenForChat()
//     } else {
//       socket.send({ cmd, username: socket.username })
//       listenForChat()
//     }
//   })
// }

// // ================================================================
// // Invalid Login Response - Loop back to login/signup prompt
// const invalidLoginHandler = (error, cb) => {
//   console.log(chalk.red(`SERVER ERROR: ${error.err}`))
//   cb()
// }

// // ================================================================
// // After Successful Login

// const connected = (username, cb) => {
//   console.log(chalk.red(`=== start chatting ${username} ===`))
//   cb()
// }

// // ================================================================
// // Normal Message Response

// const messageHandler = (data, cb) => {
//   const { cmd, username } = data
//   console.log(chalk.green(`${username}: ${cmd.split('\n')[0]}`))
//   cb()
// }

// // ================================================================
// // Whisper Response

// const whisperHandler = (data, cb) => {
//   const { message, user } = data
//   console.log(chalk.blue(`Whisper from ${user}: ${message}`))
//   cb()
// }

// // ================================================================
// // Toxic Comment Response

// const toxicHandler = (data, cb) => {
//   const { cmd } = data
//   console.log(chalk.red(`SERVER: ${cmd.split('\n')[0]}`))
//   cb()
// }

// // ================================================================
// // Invalid Room Error - Triggered by Join Event to Non-Existent Room

// const invalidRoomHandler = (error, cb) => {
//   console.log(chalk.red(`SERVER ERROR: ${error.error}`))
//   cb()
// }

// ================================================================
// Command Switch Block

// const handleCommand = (cmd) => {
//   const command = cmd.match(/[a-z]+\b/)[0]
//   const args = cmd.match(/[a-z-]+\b/g)[1]
//   const message = cmd.substr(command.length + args.length + 3, cmd.length)
//   switch (command) {
//     case 'join': // ie: foobar
//       if(args) {
//         socket.emit('join', args)
//       } else {
//         socket.emit('getrooms')
//         socket.on('sendrooms', (list) => {
//           menu.choices = list
//           inquirer.prompt([menu]).then(choice => {
//             socket.emit('join', choice)
//           })
//         })
//       }
//       break
//     case 'getusers':
//       socket.emit('getusers')
//       socket.on('sendusers', (list) => {
//         users.choices = list;
//         inquirer.prompt([users, whisper]).then(choice => {
//           socket.emit('whisper', choice)
//         })
//       })
//     case 'exit': // /exit
//       socket.emit('disconnected', socket.username)
//       process.exit(0)
//     case 'whisper':
//       socket.emit('whisper', { user: args, message })
//       listenForChat()
//       break
//     default:
//       listenForChat()
//   }
// }

// ================================================================
// Socket Listeners

socket.on('disconnect', () => {
  socket.emit('disconnect')
})

socket.on('connect', () => {
  console.log('here')
  loginOrSignup()
})

socket.on('invalid-login', error => {
  invalidLoginHandler(error, loginOrSignup)
})

socket.on('connected', username => {
  console.log('I heard')
  connected(username, listenForChat)
})

socket.on('joined', () => {
  listenForChat()
})

socket.on('message', data => {
  messageHandler(data, listenForChat)
})

socket.on('whisper', data => {
  whisperHandler(data, listenForChat)
})

socket.on('toxic', data => {
  toxicHandler(data, listenForChat)
})

socket.on('invalid room', data => {
  invalidRoomHandler(data, listenForChat)
})

socket.on('unavailable', () => {
  // TODO: need to write
})