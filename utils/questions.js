'use strict'

class Questions {
  constructor () {
    this.login = {
      type: 'list',
      name: 'answer',
      message: 'Sign-in or sign-up',
      choices: ['sign-in', 'sign-up']
    },
    this.signinUsername = {
      type: 'input',
      name: 'username',
      message: 'Enter your username'
    },
    this.signinPassword = {
      type: 'password',
      name: 'password',
      message: 'Enter your password'
    },
    this.menu = {
      type: 'list',
      name: 'room',
      choices: []// socket.emit('getrooms'),
    },
    this.message = {
      type: 'input',
      name: 'chat',
      message: ''
    }
  }
}

module.exports = new Questions()
