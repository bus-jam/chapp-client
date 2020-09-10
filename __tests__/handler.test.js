'use strict'

const { eventhandlers } = require('../lib/handler')
const {
  listenForChat,
  loginOrSignup,
  connected,
  invalidLoginHandler,
  messageHandler,
  whisperHandler,
  toxicHandler,
  errorHandler,
  menuHandler,
  joinedHandler,
  helpHandler
} = eventhandlers

const ui = require('../__mocks__/inquirer-mock')

describe('Test logging functions', () => {
     
    ui.log.write = jest.fn()
it('Should log message', () => {
    const message = {
        username: 'test',
        message: 'test message\n'
    }
    messageHandler(message)
    console.log(result)
    expect(ui.log.write).toHaveBeenCalledWith('test: test message')
})
})