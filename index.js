'use strict'
// ================================================================
// Required Libraries
const chalk = require('chalk')
const socket = require('socket.io-client')('http://localhost:3002')
const inquirer = require('inquirer')

// ================================================================
// Establish Objects

// TODO: maybe modularize these question objects and require them in to clean this up

const login = {
  type: 'list',
  name: 'answer',
  message: 'Sign-in or sign-up',
  choices: ['sign-in', 'sign-up']
}

const signinUsername = {
  type: 'input',
  name: 'username',
  message: 'Enter your username'
}

const signinPassword = {
  type: 'password',
  name: 'password',
  message: 'Enter your password'
}

const menu = {
  type: 'list',
  name: 'room',
  choices: []// socket.emit('getrooms'),
}

const message = {
  type: 'input',
  name: 'chat',
  message: ''
}

// ================================================================
// Disconnect Event

socket.on('disconnect', () => {
  socket.emit('disconnect')
})

socket.on('connect', loginOrSignup)

function loginOrSignup () {
  inquirer.prompt([login]).then(answers => {
    if (answers.answer === 'sign-in') {
      inquirer.prompt([signinUsername, signinPassword]).then(user => {
        socket.emit('signin', user)
      })
    } else {
      inquirer.prompt([signinUsername, signinPassword]).then(user => {
        socket.emit('signup', user)
      })
    }
  })
}

function listenForChat () {
  inquirer.prompt(message).then(message => {
    const cmd = message.chat
    if (cmd[0] === '/') {
      handleCommand(cmd)
    } else {
      socket.send({ cmd, username: socket.username })
      listenForChat()
    }
  })
}

// ================================================================
// Invalid Login Response - Loop back to login/signup prompt

socket.on('invalid-login', (error) => {
  console.log(chalk.red(`SERVER ERROR: ${error.error}`))
  loginOrSignup()
})

// ================================================================
// After Successful Login

socket.on('connected', (username) => {
  socket.username = username // TODO: is this reduntant?
  console.log(chalk.red(`=== start chatting ${username} ===`))
  listenForChat()
})

// ================================================================
// Joined Event

socket.on('joined', (room) => {
  listenForChat()
})

// ================================================================
// Normal Message Response

socket.on('message', data => {
  const { cmd, username } = data
  // console.log('data', data);
  console.log(chalk.green(`${username}: ${cmd.split('\n')[0]}`))
  listenForChat()
})

// ================================================================
// Whisper Response

socket.on('whisper', messageObj => {
  const { message, user } = messageObj
  console.log(chalk.blue(`Whisper from ${user}: ${message}`))
  listenForChat()
})

// ================================================================
// Toxic Comment Response

socket.on('toxic', data => {
  const { cmd } = data
  console.log(chalk.red(`SERVER: ${cmd.split('\n')[0]}`))
  listenForChat()
})

// ================================================================
// Invalid Room Error - Triggered by Join Event to Non-Existent Room

socket.on('invalid room', error => {
  console.log(chalk.red(`SERVER ERROR: ${error.error}`))
  listenForChat()
})

// ================================================================
// Command Switch Block

const handleCommand = (cmd) => {
  const command = cmd.match(/[a-z]+\b/)[0]
  const args = cmd.match(/[a-z-]+\b/g)[1]
  const message = cmd.substr(command.length + args.length + 3, cmd.length)
  console.log(chalk.red(command), chalk.red(args), chalk.red(message))
  switch (command) {
    case 'join': // ie: foobar
      console.log('join')
      socket.emit('join', args)
      break
    case 'exit': // /exit
      console.log('exit')
      socket.emit('disconnected', socket.username)
      process.exit(0)
    case 'whisper':
      console.log('whisper', args, message)
      socket.emit('whisper', { user: args, message })
      listenForChat()
      break
    default:
      listenForChat()
  }
}
