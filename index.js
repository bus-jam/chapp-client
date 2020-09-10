#!/usr/bin/env node
'use strict'
// ================================================================
// Required Libraries

const { socket } = require('./lib/handler')
const { eventhandlers } = require('./lib/handler')
const {
  listenForChat,
  loginOrSignup,
  invalidLoginHandler,
  connected,
  messageHandler,
  whisperHandler,
  toxicHandler,
  errorHandler,
  handleMenu,
  handleJoined
} = eventhandlers

const userPrompt = [
  'List of connected users',
  'To direct message a user, type "/whisper <username> <message>"'
]
const roomPrompt = [
  'List of rooms',
  'To join a separate room, type "/join <room name>"'
]
// ================================================================
// Socket Listeners

socket.on('disconnect', () => {
  socket.emit('disconnect')
})

socket.on('connect', () => {
  loginOrSignup()
})

socket.on('invalid-login', error => {
  invalidLoginHandler(error, loginOrSignup)
})

socket.on('connected', username => {
  socket.username = username
  connected(username, listenForChat)
})

socket.on('joined', room => {
  handleJoined(room)
})

socket.on('message', data => {
  messageHandler(data)
})

socket.on('whisper', data => {
  whisperHandler(data)
})

socket.on('toxic', data => {
  toxicHandler(data)
})

socket.on('invalid room', data => {
  errorHandler(data)
})

socket.on('unavailable', error => {
  errorHandler(error)
})

socket.on('whispermenu', list => {
  handleMenu(list, userPrompt)
})

socket.on('joinmenu', list => {
  handleMenu(list, roomPrompt)
})
