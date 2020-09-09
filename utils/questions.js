'use strict'

class Questions {
  constructor () {
    this.login = {
      type: 'list',
      name: 'answer',
      message: 'Sign-in or sign-up',
      choices: ['sign-in', 'sign-up']
    },
    this.signInUsername = {
      type: 'input',
      name: 'username',
      message: 'Enter your username'
    },
    this.signInPassword = {
      type: 'password',
      name: 'password',
      message: 'Enter your password'
    },
    this.menu = {
      type: 'list',
      name: 'room',
      choices: []// socket.emit('getrooms'),
    },
    this.users = {
      type: 'list',
      name: 'user',
      choices: []// socket.emit('getusers'),
    },
    this.whisper = {
      type: 'input',
      name: 'whisper',
      message: ''
    }
    this.message = {
      type: 'input',
      name: 'chat',
      message: ''
    }
  }
}

module.exports = new Questions()
