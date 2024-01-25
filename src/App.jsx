import { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMessage: '',
      conversation: [],  
      userHasSentMessage: false,
      userIP: Math.floor(Math.random() * 1000000) + 1,
      timeStamp: Date.now(),
      feedback: "None",
    };

    this.apiEndpoint = "http://mtggpt1.us-east-2.elasticbeanstalk.com/"
    // this.apiEndpoint = "http://127.0.0.1:5000/"

  }
  
  clearConversation = () => {
    this.setState({ conversation: [], timeStamp: Date.now()});
  };

  saveConversation = async (fb) => {
    const { conversation } = this.state;
    if(conversation.length > 0) {
      this.setState({ feedback:fb});
      this.sendConversation();
    }
  }

  handleChange = (e) => {
    this.setState({ inputMessage: e.target.value });
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit(e);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { inputMessage, conversation } = this.state;
    console.log(this.apiEndpoint + 'conversation')

    if (inputMessage.trim() === '') return;

    conversation.push({ role: 'user', content: inputMessage });
    this.setState({ conversation, inputMessage: '' });

    const assistantResponse = await this.sendConversation();
    console.log(assistantResponse)
    conversation.push({ role: 'assistant', content: assistantResponse });
  };

  sendConversation = async () => {
    const { conversation, userIP, timeStamp, feedback } = this.state;
  
    try {
      const response = await axios.post(this.apiEndpoint + 'conversation', {
        messages: conversation,
        user_ip: userIP,
        time_stamp: timeStamp,
        feed_back: feedback,
      });
      console.log(response)
      // Extract the assistant's response from the API response
      const assistantResponse = response.data.response;

      // Update the state with the updated conversation
      this.setState({conversation, userHasSentMessage: true });

      return assistantResponse;
    } catch (error) {
      console.error('Error sending message:', error);
    }
    return "Error!!!"
  }


  render() {
    const { conversation, inputMessage, userHasSentMessage } = this.state;

    return (
      <div className="App">
        <h1>MTG-GPT</h1>
        <div className="chat-container">
        <div className="chat-messages">
          {conversation.length === 0 && !userHasSentMessage ? (
            <div className="start-conversation-message">
              Type a message to start the conversation
            </div>
          ) : (
            <div />
          )}
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
              >
              <pre className="message-content">{message.content}</pre>
              </div>
            ))}
          </div>
          <form onSubmit={this.handleSubmit}>
            <textarea
              value={inputMessage}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              placeholder="Type a message..."
              rows="5"
              cols="80"
            />
            <br />
            <button type="submit">Send</button>
          
          </form>
          <button onClick={this.clearConversation}>Clear Conversation</button>
          
          <div>
            <button onClick={() => this.saveConversation('thumbsup')}>
              <span className="material-symbols-outlined">thumb_up</span>
            </button>
            <button onClick={() => this.saveConversation('thumbsdown')}>
              <span className="material-symbols-outlined">thumb_down</span>
            </button>
          </div>
        
        </div>
        <div className="footer">
        Created by Zachary Kiihne & Juhani Manninen
      </div>
      </div>
    );
  }
}

export default App;
