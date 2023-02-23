import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css'

const client = new W3CWebSocket('ws://127.0.0.1:8080');

function App() {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  
  // Set up WebSocket event handlers when the component mounts
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
  }, []);
  
  // Handle incoming messages from the WebSocket server
  useEffect(() => {
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply!', dataFromServer);
      if (dataFromServer.type === 'message') {
        setMessages((prevMessages) => [
          ...prevMessages, {
            msg: dataFromServer.msg,
            user: dataFromServer.user,
          }]);
        }
      };
    }, []);
    
    const onButtonClicked = (value) => {
      client.send(JSON.stringify({
        type: 'message',
        msg: value,
        user: userName,
      }));
      setMessage('');
    };

    return (
    <>
      <div className='container'>
        {isLoggedIn ? (
          <div className='msg-wrapper'>
            <div className="title">
              <h1>Welcome {userName}!</h1>
            </div>

            <div id="messages">
              {messages.map((message) => (
                <div key={message.msg} style={{ alignSelf: userName === message.user ? 'flex-end' : 'flex-start'}}>
                  <strong>{message.user}:</strong> {message.msg}
                </div>))}
            </div>

            <div className="message-input">
              <input type="text" placeholder="Message" value={message}
                onChange={(e) => setMessage(e.target.value)} />
              <button onClick={() => onButtonClicked(message)}>Send</button>
            </div>
          </div>

        ) : (
          <div className='login-wrapper'>
            <h3>Login to ChatApp</h3>
            <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <button onClick={() => setIsLoggedIn(true)}>Login</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

