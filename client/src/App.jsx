import './App.css';
import io from 'socket.io-client'
import { useState } from 'react';
import { useEffect } from 'react';

const socket = io('http://localhost:8800')

function App() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message)
    setMessage('')
    const newMessage = {
      body: message,
      from: 'Me'
    }
    setMessages([newMessage, ...messages])
  }

  useEffect(() => {

    const receiveMessage = (message) => {
      setMessages([message, ...messages])
    }

    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [messages])

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className='bg-zinc-900 p-10'>
        <h1 className='text-2x1 font-bold my-2'>Chat React</h1>
        <input type="text" onChange={(e) => { setMessage(e.target.value) }} value={message} className='border-2 border-zinc-500 text-black w-full' />
        <ul className='h-80 overflow-y-auto'>
          {
            messages.map((message, index) => (
              <li key={index} className={` my-2 table p-2 text-sm rounded-md ${message.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black'}`}>
                <p>{message.from}: {message.body}</p>
              </li>
            ))
          }
        </ul>
      </form>
    </div>
  );
}

export default App;
