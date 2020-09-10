'use strict'

const { socket, ui } = require('../lib/handler')
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
  helpHandler,
  handleCommand
} = eventhandlers


describe('Test command handling and parsing', () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

     describe('Test /join', () => {

         it('Should emit with args parsed', async () => {
             let cmd = '/join general'
             const spy = jest.spyOn(socket, 'emit')
             await handleCommand(cmd)
             expect(spy).toHaveBeenCalledWith('join', 'general')
        })

        it('Should emit get rooms with no args', async () => {
            let cmd = '/join'
            const spy = jest.spyOn(socket, 'emit')
            await handleCommand(cmd)
            expect(spy).toHaveBeenCalledWith('getrooms')
        })

    })

    describe('Test /whisper', () => {

        it('Should emit whisper with args and message parsed', async () => {
            let cmd = '/whisper test foo bar'
            const spy = jest.spyOn(socket, 'emit')
            await handleCommand(cmd)
            expect(spy).toHaveBeenCalledWith('whisper', { 'message':'foo bar', 'username':'test' })
        })

        it('Should emit getusers with no args', async () => {
            let cmd = '/whisper'
            const spy = jest.spyOn(socket, 'emit')
            await handleCommand(cmd)
            expect(spy).toHaveBeenCalledWith('getusers')
        })

    })

    describe('Test /exit', () => {

        it('Should exit with code 0', async () => {
            let cmd = '/exit'
            const spy = jest.spyOn(process, 'exit').mockImplementation(() => {})
            await handleCommand(cmd)
            expect(spy).toHaveBeenCalledWith(0)
        })

    })
    
    describe('Test /help', () => {

        it('Should emit help', async () => {
            let cmd = '/help'
            const spy = jest.spyOn(socket, 'emit')
            await handleCommand(cmd)
            expect(spy).toHaveBeenCalledWith('help')
        })

    })

    describe('Test default case', () => {

        it('Should emit help with /anything else', async () => {
            let cmd = '/foobar'
            const spy = jest.spyOn(socket, 'emit')
            await handleCommand(cmd)
            expect(spy).toHaveBeenCalledWith('help')
        })

    })

})

describe('Test logging methods', () => {

    afterEach(() => {
        jest.clearAllMocks()
    })
    describe('Test Connected', () => {

        let user = 'test'

        it('Should log message with username', () => {
            const spy = jest.spyOn(ui, 'write')
            connected(user, jest.fn)
            expect(spy).toHaveBeenCalled()
        })

        it('Should call callback', () => {
            const spy = jest.fn()
            connected(user, spy)
            expect(spy).toHaveBeenCalled()
        })

    })

    describe('Test invalidLoginHandler', () => {

        let error = { error: 'test'}

        it('Should log error message', () => {
            const spy = jest.spyOn(ui, 'write')
            invalidLoginHandler(error, jest.fn)
            expect(spy).toHaveBeenCalled()
        })

        it('Should call callback', () => {
            const spy = jest.fn()
            invalidLoginHandler(error, spy)
            expect(spy).toHaveBeenCalled()
        })

    })

    describe('Test messageHandler', () => {

        let message = {
            message: 'foo bar',
            username: 'test'
        }

        it('Should log message', () => {
            const spy = jest.spyOn(ui, 'write')
            messageHandler(message)
            expect(spy).toHaveBeenCalled()
        })

    })

    describe('Test whisperHandler', () => {

        let whisper = {
            message: 'foo bar',
            username: 'test'
        }

        it('Should log whisper', () => {
            const spy = jest.spyOn(ui, 'write')
            whisperHandler(whisper)
            expect(spy).toHaveBeenCalled()
        })

    })

    describe('Test toxicHandler', () => {

        let message = { message: 'foo bar' }

        it('Should log message', () => {
            const spy = jest.spyOn(ui, 'write')
            toxicHandler(message)
            expect(spy).toHaveBeenCalled()
        })

    })

    describe('Test errorHandler', () => {

        let error = { error: 'foo bar' }

        it('Should log error', () => {
            const spy = jest.spyOn(ui, 'write')
            errorHandler(error)
            expect(spy).toHaveBeenCalled()
        })

    })
    
    describe('Test menuHandler', () => {

        let arr = ['test', 'test']

        it('Should log prompts and loop through array logging', async () => {
            const spy = jest.spyOn(ui, 'write')
            await menuHandler(arr, arr)
            expect(spy).toHaveBeenCalledTimes(4)
        })

    })

    describe('Test joinedHandler', () => {

        let room = 'foobar'

        it('Should log error', () => {
            const spy = jest.spyOn(ui, 'write')
            joinedHandler(room)
            expect(spy).toHaveBeenCalled()
        })

    })

    describe('Test helpHandler', () => {

        let count = 5

        it('Should log prompts and loop through array logging', async () => {
            const spy = jest.spyOn(ui, 'write')
            helpHandler(count)
            expect(spy).toHaveBeenCalledTimes(6)
        })

    })

})

