import { useState, useRef, useEffect } from 'react';

const RoleWidget = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! How can we help you today? 😊', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Simple AI responses based on keywords
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return 'Hello! Welcome to DeLegends Barber Shop! How can I assist you today? ✂️';
    } else if (msg.includes('book') || msg.includes('appointment')) {
      return 'Great! You can book an appointment by clicking "Book Now" in our menu. We offer premium haircuts and grooming services! 📅';
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('rates')) {
      return 'Our services start from affordable rates! Check out our Services page for detailed pricing, or I can help you choose the perfect service. 💰';
    } else if (msg.includes('hours') || msg.includes('open') || msg.includes('timing')) {
      return 'We are open 7 days a week! Visit our shop or book online for your convenience. ⏰';
    } else if (msg.includes('location') || msg.includes('where') || msg.includes('address')) {
      return 'We have multiple locations! You can select your preferred location when booking an appointment. 📍';
    } else if (msg.includes('service') || msg.includes('haircut') || msg.includes('grooming')) {
      return 'We offer premium haircuts, beard grooming, hair styling, and much more! Check our Services page to explore all options. ✨';
    } else if (msg.includes('product') || msg.includes('shop')) {
      return 'Yes! We have premium grooming products available. Visit our Products section to browse our collection! 🛍️';
    } else if (msg.includes('thank')) {
      return 'You\'re welcome! Feel free to ask anything else. We\'re here to help! 😊';
    } else {
      return 'Thanks for your message! For specific inquiries, please check our website or contact us directly. We\'re here to help! 💬';
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMsg = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const containerStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
    fontFamily: 'Figtree, sans-serif',
  };

  const chatButtonStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4af37 0%, #c49a2e 100%)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    position: 'relative',
  };

  const chatWindowStyle = {
    width: '380px',
    height: '550px',
    backgroundColor: '#111827',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '0',
    right: '0',
    transition: 'all 0.3s ease',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #d4af37 0%, #c49a2e 100%)',
    padding: '18px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  };

  const titleTextStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const titleMainStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  };

  const titleSubStyle = {
    fontSize: '11px',
    color: '#374151',
    fontWeight: '500',
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#1f2937',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const messageStyle = (sender) => ({
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1.5',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'user' ? '#d4af37' : '#374151',
    color: sender === 'user' ? '#111827' : '#ffffff',
    wordWrap: 'break-word',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  });

  const typingIndicatorStyle = {
    display: 'flex',
    gap: '4px',
    padding: '10px 14px',
    backgroundColor: '#374151',
    borderRadius: '12px',
    maxWidth: '60px',
    alignSelf: 'flex-start',
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#9ca3af',
    animation: 'bounce 1.4s infinite ease-in-out',
  };

  const inputContainerStyle = {
    padding: '16px',
    backgroundColor: '#111827',
    borderTop: '1px solid #374151',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '24px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const sendButtonStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4af37 0%, #c49a2e 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: '#111827',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    borderRadius: '4px',
  };

  const notificationBadgeStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    border: '2px solid #111827',
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .dot-1 { animation-delay: -0.32s; }
          .dot-2 { animation-delay: -0.16s; }
        `}
      </style>

      {!isOpen ? (
        <button
          style={chatButtonStyle}
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(212, 175, 55, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.4)';
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          {messages.length > 1 && <div style={notificationBadgeStyle}></div>}
        </button>
      ) : (
        <div style={chatWindowStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={titleStyle}>
              <div style={avatarStyle}>✂️</div>
              <div style={titleTextStyle}>
                <div style={titleMainStyle}>DeLegends Support</div>
                <div style={titleSubStyle}>● Online - Quick Reply</div>
              </div>
            </div>
            <button
              style={closeButtonStyle}
              onClick={() => setIsOpen(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={messagesContainerStyle}>
            {messages.map((msg) => (
              <div key={msg.id} style={messageStyle(msg.sender)}>
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div style={typingIndicatorStyle}>
                <div style={{...dotStyle}} className="dot-1"></div>
                <div style={{...dotStyle}} className="dot-2"></div>
                <div style={{...dotStyle}}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={inputContainerStyle}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#d4af37'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
            />
            <button
              style={sendButtonStyle}
              onClick={handleSendMessage}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.3)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleWidget;
