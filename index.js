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
  invalidRoomHandler,
  connected,
  messageHandler,
  whisperHandler,
  toxicHandler,
  unavailableHandler,
  handleWhisperMenu,
  handleJoinMenu,
  handleJoined
} = eventhandlers;

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
  login = true;
  socket.username = username;
  connected(username, listenForChat)
})

socket.on('joined', room => {
  handleJoined(room)
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

socket.on('whispermenu', list => {
  handleWhisperMenu(list, listenForChat)
})

socket.on('joinmenu', list => {
  handleJoinMenu(list, listenForChat)
})
