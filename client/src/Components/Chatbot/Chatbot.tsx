import { HfInference } from '@huggingface/inference';
import React, { useCallback, useEffect, useState } from 'react';
import { faqData } from '../../Data/faqData';
import './Chatbot.css'
import Spinner from '../UI-Components/Spinner/Spinner';
import { API_KEY } from '../../config/config';



// the hugging face inference points to a deployed inference API that
// uses embeddings to compare sentence similarity
const hf = new HfInference(API_KEY)

const BOT_NAME = 'Jarvis'

interface Answer {
  id: number,
  question: string,
  answer: string,
}

type MessageType = 'loading' | 'message' | 'error'

interface Message {
  user: string;
  text: string;
  type: MessageType
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [inputValue, setInputValue] = useState('');
  const [formattedAnswers, setFormattedAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

 useEffect(() => {
  // simulate a call to an API to get the answers, in a real app the formatted answers could contain 
  // a subset of popular answers with embeddings to speed up the retrieval process
  setTimeout(() => {
    const formattedAnswers = faqData.map((answer) => answer.question + ' | ' +  answer.answer);
    setFormattedAnswers(formattedAnswers);
  }, 100)
 }, [])



const querySentenceSimilarity = useCallback(async function query(input: string) {
    const inputs = {
        source_sentence: input,
        sentences: formattedAnswers,
      }
	const response = await hf.sentenceSimilarity({inputs})
	return response
}, [formattedAnswers]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      try {
        setIsLoading(true)
        setMessages((prev) => [...prev, { user: '', text: '', type: 'loading'}])
        const result = await querySentenceSimilarity(inputValue);
        const closest = result.indexOf(Math.max(...result));
        setIsLoading(false)
        setMessages((prevMessages) => [
          ...prevMessages.filter(t => t.type !== 'loading'),
          {user: 'you', text: inputValue, type: 'message'},
          {user: BOT_NAME, text: faqData[closest].answer, type: 'message'}
        ])
      } catch (error) {
        console.error('Error calling the API:', error);
        setMessages((prevMessages) => [
          ...prevMessages.filter(t => t.type !== 'loading'),
          {user: 'bot', text: 'something went wrong', type: 'error'}
        ])

      }
      setInputValue('');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, index) => {
           if (msg?.type === 'loading') {
            return <Spinner key={index} />
           }
           return ( <div key={index} className={`message`}>
           <strong>{msg.user}: </strong> {msg.text}
         </div>)
        })}
      </div>
      <div className="input-area">
        <input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
