     _____ _                       
    /  __ \ |                      
    | /  \/ |__   __ _ _ __  _ __  
    | |   | '_ \ / _` | '_ \| '_ \ 
    | \__/\ | | | (_| | |_) | |_) |
     \____/_| |_|\__,_| .__/| .__/ 
                      | |   | |    
                      |_|   |_|  

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/bus-jam/chapp-client/blob/staging/license)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Version](https://img.shields.io/badge/Version-0.2.0-brightgreen.svg)](https://github.com/bus-jam/chapp-client#readme)
[![Build Status](https://travis-ci.com/bus-jam/chapp-client.svg?branch=master)](https://travis-ci.com/bus-jam/chapp-client)

## Goal

We wanted to build a socket io driven command line chat app. Our server uses **TensorFlow** to moderate messages and try to stop toxicity and bad language.

## Installation

To install our app run the following:

    $ npm i -g chapp

Once installed to run the app:

    $ chapp

## Usage

Once launched follow the prompts to create a username and password to login the chat rooms.

### Chat commands

    /join <room>

Joins specified room.

    /whisper <username> <message>

Sends a private message to the specified user.

    /exit

Exits the app and disconnects from server.

## The Team

* [Matt Herriges](https://github.com/herrigesmt)
* [Jennifer Chinzi](https://github.com/jchinzi)
* [Sean Murray](https://github.com/seanjmurray)
* [Blake Romero](https://github.com/blakerom)

## Version History

* 2020-09-04 V 0.1.0 Initial files uploaded, basic app functionality added.
* 2020-09-07 V 0.2.0 Add basic menu and prompts, handle sign-in/up events and saving users to database, private messages, and room switching.

