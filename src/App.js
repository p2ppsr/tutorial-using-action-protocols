import React, { useState, useEffect } from 'react';
import './App.css';
import { createAction, getPrimarySigningPub } from '@babbage/sdk';
import { TextField, Button, Typography } from '@material-ui/core';
import bsv from 'bsv';
import parapet from 'parapet-js';

function App () {
  const [postText, setPostText] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    (async () => {
      const result = await parapet({
        bridge: '1Prq8NfyBH2mGaGG3jPcbfgH4JXj5aK9sN',
        request: {
          type: 'json-query',
          query: {
            v: 3,
            q: {
              collection: 'hello',
              find: {}
            }
          }
        }
      })
      setMessages(result.reverse())
    })()
  }, [])

  useEffect(() => {
    let socket
    (async () => {
      socket = await parapet({
        bridge: '1Prq8NfyBH2mGaGG3jPcbfgH4JXj5aK9sN',
        request: {
          type: 'socket',
          query: {
            v: 3,
            q: {
              find: {}
            }
          }
        }
      })
      socket.onmessage = async e => {
        const data = JSON.parse(e.data)
        if (data.type !== 'message') {
          return
        }
        setMessages(oldMessages => ([
          data.data,
          ...oldMessages
        ]))
      }
    })()
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [])

  // The function is run when we click the button
  const handleClick = async () => {
    if (!postText) {
      alert('No post text!')
      return
    }
    if (postText.length > 512) {
      alert('HWP messages cannot exceed 512 characters!')
      return
    }

    // An HWP sender ID is calculated from the public key
    const key = await getPrimarySigningPub({
      path: 'm/1033/10'
    })
    const senderID = bsv.Address.fromPublicKey(
      bsv.HDPublicKey.fromString(key).publicKey
    ).toString()
    console.log(`Sender ID: ${senderID}`)

    const result = await createAction({
      description: 'Send a message with Hello World Protocol',
      keyName: 'primarySigning',
      keyPath: 'm/1033/10',
      data: [
        btoa('1He11omzQsAeYa2JUj52sFZRQEsSzPFNZx'),
        btoa(senderID),
        btoa(postText)
      ],
      bridge: ['1Prq8NfyBH2mGaGG3jPcbfgH4JXj5aK9sN'] // HWP
    }, false)

    setPostText('')
    console.log(result)
  }

  return (
    <div className="App">
      <header className="App-header">
        <TextField
          value={postText}
          onChange={e => setPostText(e.target.value)}
          placeholder='Write a message'
          multiline
          rows={4}
        />
        <br />
        <br />
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={handleClick}
        >
          Send
        </Button>
        <br />
        <br />
        {messages.map((msg, i) => (
          <Typography key={i} paragraph>
            <b>{msg.sender}</b>: {msg.message}
          </Typography>
        ))}
      </header>
    </div>
  );
}

export default App;
