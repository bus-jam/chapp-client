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
  toxicHandler,
  unavailableHandler
} = handlers.eventhandlers;

let login = false;
// ================================================================
// Socket Listeners

socket.on('disconnect', () => {
  socket.emit('disconnect')
})

socket.on('connect', () => {
  // console.log('here')
  loginOrSignup()
})

socket.on('invalid-login', error => {
  invalidLoginHandler(error, loginOrSignup)
})

socket.on('connected', username => {
  // console.log('I heard')
  login = true;
  socket.username = username;
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

socket.on('unavailable', error => {
  unavailableHandler(error, listenForChat)
})


