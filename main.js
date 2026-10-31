document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const closeChat = document.getElementById('closeChat');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');

  // Toggle Chatbot
  chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
  });

  closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  // Small database of fallback responses to feel human-like
  const fallbackResponses = [
    { keywords: ['hi', 'hello', 'hey'], response: "Hey there! How can I help you explore our portfolio today?" },
    { keywords: ['how are you'], response: "I'm just a few lines of code, but I'm doing great! How about you?" },
    { keywords: ['seham'], response: "Seham is our backend logic master and AI integration specialist. You can see her projects on her personal page!" },
    { keywords: ['amelia'], response: "Amelia is the creative frontend genius behind these neat animations. Check out her page for UI/UX stuff!" },
    { keywords: ['contact', 'email', 'hire'], response: "You can find contact forms on Seham's or Amelia's personal pages. Or check out the Careers section!" },
    { keywords: ['skills', 'tech stack'], response: "Between them, they know Python, React, Next.js, AI APIs, CSS animations, and more. A full-stack powerhouse!" }
  ];

  function getFallbackResponse(text) {
    const lowerText = text.toLowerCase();
    for (let item of fallbackResponses) {
      if (item.keywords.some(kw => lowerText.includes(kw))) {
        return item.response;
      }
    }
    return "That's interesting! I'm best at answering questions about Seham, Amelia, their projects, or skills. Want to know about their tech stack?";
  }

  function appendMessage(text, sender) {
    // sender: 'user' or 'bot'
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender);
    msgDiv.textContent = text;
    // Insert before typing indicator
    chatMessages.insertBefore(msgDiv, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    typingIndicator.style.display = 'flex';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
    typingIndicator.style.display = 'none';
  }

  async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // User message
    appendMessage(text, 'user');
    chatInput.value = '';

    // Show bot typing
    showTyping();

    try {
      // Trying the API route first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("API not ok");
      
      const data = await response.json();
      hideTyping();
      appendMessage(data.reply || "I got your message, but the response was empty.", 'bot');
      
    } catch (error) {
      // Fallback
      hideTyping();
      setTimeout(() => {
        appendMessage(getFallbackResponse(text), 'bot');
      }, 500); // Small delay to feel natural
    }
  }

  chatSend.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
});
