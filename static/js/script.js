// static/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const suggestionChips = document.querySelectorAll('.chip');
    const saveSettingsBtn = document.getElementById('save-settings');
    const colorThemeBtns = document.querySelectorAll('.color-theme-btn');
    const animationSpeedSlider = document.getElementById('animation-speed');
    const lightModeRadio = document.getElementById('light-mode');
    const darkModeRadio = document.getElementById('dark-mode');
    const messageStyleRadios = document.querySelectorAll('input[name="message-style"]');
    
    // Application state
    const state = {
        animationSpeed: 0.5,
        theme: localStorage.getItem('theme') || 'light',
        colorTheme: localStorage.getItem('colorTheme') || 'default',
        messageStyle: localStorage.getItem('messageStyle') || 'rounded',
        animationClasses: {
            bot: 'animate__animated animate__fadeInLeft',
            user: 'animate__animated animate__fadeInRight'
        }
    };
    
    // Initialize app with saved settings
    function initializeAppSettings() {
        // Set theme mode (light/dark)
        document.documentElement.setAttribute('data-bs-theme', state.theme);
        if (state.theme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeRadio.checked = true;
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            lightModeRadio.checked = true;
        }
        
        // Set color theme
        document.body.className = `theme-${state.colorTheme}`;
        colorThemeBtns.forEach(btn => {
            if (btn.getAttribute('data-theme') === state.colorTheme) {
                btn.classList.add('active');
            }
        });
        
        // Set message style
        document.body.classList.add(`style-${state.messageStyle}`);
        document.getElementById(`${state.messageStyle}-messages`).checked = true;
        
        // Set animation speed
        document.documentElement.style.setProperty('--animation-speed', `${state.animationSpeed}s`);
        animationSpeedSlider.value = state.animationSpeed;
        
        // Add RGB versions of the theme colors (needed for some CSS effects)
        updateRgbVariables();
    }
    
    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        // Default fallback colors
        if (!hex || hex === 'transparent') return '0, 123, 255'; // Default blue
        
        // If it's a variable
        if (hex.startsWith('var(')) {
            const varName = hex.match(/var\((.*?)\)/)[1];
            hex = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        }
        
        // If it's a gradient
        if (hex.includes('gradient')) {
            // Extract the first color from the gradient
            const match = hex.match(/(#[a-f\d]{6}|#[a-f\d]{3}|rgb\([^)]+\))/i);
            if (match) hex = match[0];
        }
        
        // If it's already rgb format
        if (hex.startsWith('rgb')) {
            return hex.match(/\d+, \d+, \d+/)[0];
        }
        
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Convert shorthand hex to full hex
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `${r}, ${g}, ${b}`;
    }
    
    // Update RGB variables from current CSS custom properties
    function updateRgbVariables() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
        
        document.documentElement.style.setProperty('--primary-color-rgb', hexToRgb(primaryColor));
        document.documentElement.style.setProperty('--secondary-color-rgb', hexToRgb(secondaryColor));
    }
    
    // Theme toggle function
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
            
        state.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        
        // Check the appropriate radio button in settings
        if (newTheme === 'dark') {
            darkModeRadio.checked = true;
        } else {
            lightModeRadio.checked = true;
        }
    }
    
    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        // Add animation classes
        const animationClass = isUser ? state.animationClasses.user : state.animationClasses.bot;
        messageDiv.className += ` ${animationClass}`;
        
        // Avatar div
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = isUser ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>';
        
        // Message content div
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        // Process content
        if (content.includes('\n')) {
            const paragraphs = content.split('\n').filter(p => p.trim() !== '');
            paragraphs.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                messageContent.appendChild(p);
            });
        } else {
            const p = document.createElement('p');
            p.textContent = content;
            messageContent.appendChild(p);
        }
        
        // Add components to message
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to add typing indicator
    function addTypingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message', 'animate__animated', 'animate__fadeIn');
        loadingDiv.id = 'typing-indicator';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        
        loadingDiv.appendChild(avatarDiv);
        loadingDiv.appendChild(typingIndicator);
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const loadingDiv = document.getElementById('typing-indicator');
        if (loadingDiv) {
            loadingDiv.classList.add('animate__fadeOut');
            setTimeout(() => {
                loadingDiv.remove();
            }, 500);
        }
    }
    
    // Function to send user query to the backend
    async function sendMessage(message) {
        if (!message.trim()) return;

        // Add user message to chat
        addMessage(message, true);

        // Clear input field
        userInput.value = '';

        // Add typing indicator
        addTypingIndicator();

        try {
            const response = await fetch('/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: message })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response from server.');
            }

            const data = await response.json();

            // Simulate thinking time (min 1 second)
            setTimeout(() => {
                // Remove typing indicator
                removeTypingIndicator();

                // Add bot response to chat
                addMessage(data.response);
            }, Math.max(1000, data.response.length / 50));
        } catch (error) {
            // Remove typing indicator after a short delay
            setTimeout(() => {
                removeTypingIndicator();

                // Add error message
                addMessage('Sorry, there was an error processing your request. Please try again.');
                console.error('Error:', error);
            }, 1000);
        }
    }
    
    // Handle suggestion chip clicks
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const chipText = this.textContent;
            userInput.value = chipText;
            sendMessage(chipText);
            
            // Add animation to the clicked chip
            this.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__pulse');
            }, 500);
        });
    });
    
    // Settings related functions
    
    // Handle color theme selection
    colorThemeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Remove active class from all buttons
            colorThemeBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set theme class on body
            document.body.className = theme !== 'default' ? `theme-${theme}` : '';
            
            // Add message style class back (since we reset body classes)
            document.body.classList.add(`style-${state.messageStyle}`);
            
            // Update state
            state.colorTheme = theme;
            
            // Update RGB variables
            updateRgbVariables();
        });
    });
    
    // Handle animation speed changes
    animationSpeedSlider.addEventListener('input', function() {
        const speed = this.value;
        document.documentElement.style.setProperty('--animation-speed', `${speed}s`);
        state.animationSpeed = speed;
    });
    
    // Handle message style changes
    messageStyleRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const style = this.id.replace('-messages', '');
            
            // Remove all style classes
            document.body.classList.remove('style-rounded', 'style-bubble', 'style-modern');
            
            // Add selected style class
            document.body.classList.add(`style-${style}`);
            
            // Update state
            state.messageStyle = style;
        });
    });
    
    // Handle theme mode changes (from settings modal)
    lightModeRadio.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-bs-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            state.theme = 'light';
        }
    });
    
    darkModeRadio.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            state.theme = 'dark';
        }
    });
    
    // Save settings to localStorage
    saveSettingsBtn.addEventListener('click', function() {
        localStorage.setItem('theme', state.theme);
        localStorage.setItem('colorTheme', state.colorTheme);
        localStorage.setItem('messageStyle', state.messageStyle);
        localStorage.setItem('animationSpeed', state.animationSpeed);
        
        // Show success feedback
        const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        modal.hide();
        
        // Show toast notification
        showToast('Settings saved successfully!');
    });
    
    // Toast notification function
    function showToast(message) {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        // Initialize and show toast
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
        
        // Remove toast after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    }
    
    // Function to create dynamic suggestion chips based on conversation context
    function updateSuggestionChips(context) {
        const suggestionContainer = document.getElementById('suggestion-chips');
        
        // Define potential suggestion categories
        const suggestions = {
            'recruitment': [
                'Tell me about hiring process',
                'What are employment criteria?',
                'How does probation work?',
                'Non-discrimination policies'
            ],
            'benefits': [
                'What employee loans are available?',
                'Explain medical benefits',
                'Tell me about retirement benefits',
                'What recognition programs exist?'
            ],
            'leave': [
                'How does sick leave work?',
                'Explain maternity leave policy',
                'How much annual leave do I get?',
                'What\'s the compassionate leave policy?'
            ],
            'conduct': [
                'Explain code of conduct',
                'What are ethics policies?',
                'Tell me about conflict of interest',
                'Anti-harassment policies'
            ],
            'default': [
                'What is the code of conduct?',
                'Tell me about recruitment policies',
                'Explain leave policies',
                'How do termination procedures work?'
            ]
        };
        
        // Determine which category to show based on context
        let categoryToShow = 'default';
        const contextLower = context.toLowerCase();
        
        if (contextLower.includes('recruit') || contextLower.includes('hir') || contextLower.includes('employ')) {
            categoryToShow = 'recruitment';
        } else if (contextLower.includes('benefit') || contextLower.includes('loan') || contextLower.includes('medical')) {
            categoryToShow = 'benefits';
        } else if (contextLower.includes('leave') || contextLower.includes('sick') || contextLower.includes('vacation')) {
            categoryToShow = 'leave';
        } else if (contextLower.includes('conduct') || contextLower.includes('ethics') || contextLower.includes('harassment')) {
            categoryToShow = 'conduct';
        }
        
        // Clear existing chips with a fade effect
        suggestionContainer.classList.add('animate__animated', 'animate__fadeOut');
        
        setTimeout(() => {
            // Clear chips
            suggestionContainer.innerHTML = '';
            suggestionContainer.classList.remove('animate__animated', 'animate__fadeOut');
            
            // Add new chips with animation
            suggestions[categoryToShow].forEach(suggestion => {
                const chip = document.createElement('button');
                chip.className = 'chip animate__animated animate__fadeIn';
                chip.textContent = suggestion;
                
                // Add click event
                chip.addEventListener('click', function() {
                    userInput.value = this.textContent;
                    sendMessage(this.textContent);
                    
                    // Add animation to the clicked chip
                    this.classList.add('animate__pulse');
                    setTimeout(() => this.classList.remove('animate__pulse'), 500);
                });
                
                suggestionContainer.appendChild(chip);
            });
        }, 300);
    }
    
    // Add animation effects when scrolling through messages
    function addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', entry.target.classList.contains('user-message') ? 
                        'animate__fadeInRight' : 'animate__fadeInLeft');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        // Observe all messages
        document.querySelectorAll('.message').forEach(message => {
            observer.observe(message);
        });
    }
    
    // Event Listeners
    
    // Send button click
    sendBtn.addEventListener('click', function() {
        const message = userInput.value;
        sendMessage(message);
        
        // Update suggestion chips based on user message
        updateSuggestionChips(message);
    });
    
    // Enter key press
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = userInput.value;
            sendMessage(message);
            
            // Update suggestion chips based on user message
            updateSuggestionChips(message);
        }
    });
    
    // Theme toggle click
    themeToggle.addEventListener('click', toggleTheme);
    
    // Add a floating action button for additional quick actions
    function addFloatingActionButton() {
        const fab = document.createElement('div');
        fab.className = 'floating-action-btn';
        fab.innerHTML = '<i class="fas fa-plus"></i>';
        document.body.appendChild(fab);
        
        // Add menu items
        const fabMenu = document.createElement('div');
        fabMenu.className = 'fab-menu';
        fabMenu.innerHTML = `
            <div class="fab-item" title="Clear chat"><i class="fas fa-trash"></i></div>
            <div class="fab-item" title="Export chat"><i class="fas fa-download"></i></div>
            <div class="fab-item" title="Toggle reading mode"><i class="fas fa-book-reader"></i></div>
        `;
        document.body.appendChild(fabMenu);
        
        // Toggle menu
        fab.addEventListener('click', function() {
            fab.classList.toggle('active');
            fabMenu.classList.toggle('show');
        });
        
        // Handle menu item clicks
        fabMenu.querySelectorAll('.fab-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                switch(index) {
                    case 0: // Clear chat
                        clearChat();
                        break;
                    case 1: // Export chat
                        exportChat();
                        break;
                    case 2: // Toggle reading mode
                        toggleReadingMode();
                        break;
                }
                
                // Close menu
                fab.classList.remove('active');
                fabMenu.classList.remove('show');
            });
        });
    }
    
    // Clear chat function
    function clearChat() {
        // Animation for clearing
        chatMessages.classList.add('animate__animated', 'animate__fadeOut');
        
        setTimeout(() => {
            // Keep only the welcome message
            chatMessages.innerHTML = '';
            chatMessages.classList.remove('animate__animated', 'animate__fadeOut');
            
            // Add a new welcome message
            const welcomeMessage = document.createElement('div');
            welcomeMessage.classList.add('message', 'bot-message', 'animate__animated', 'animate__fadeIn');
            
            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('message-avatar');
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
            
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            messageContent.innerHTML = '<p>Chat cleared! How can I assist you with HR policies today?</p>';
            
            welcomeMessage.appendChild(avatarDiv);
            welcomeMessage.appendChild(messageContent);
            chatMessages.appendChild(welcomeMessage);
            
            // Reset suggestion chips
            updateSuggestionChips('');
        }, 500);
    }
    
    // Export chat function
    function exportChat() {
        // Gather chat messages
        const messages = [];
        document.querySelectorAll('.message').forEach(msg => {
            const content = msg.querySelector('.message-content').textContent.trim();
            const isUser = msg.classList.contains('user-message');
            messages.push(`${isUser ? 'You' : 'HR Assistant'}: ${content}`);
        });
        
        // Create text content
        const chatContent = messages.join('\n\n');
        
        // Create download link
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(chatContent));
        element.setAttribute('download', `hr-chat-${new Date().toISOString().slice(0,10)}.txt`);
        element.style.display = 'none';
        
        // Add to document, trigger download, and remove
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        // Show feedback
        showToast('Chat exported successfully!');
    }
    
    // Toggle reading mode function
    function toggleReadingMode() {
        document.body.classList.toggle('reading-mode');
        
        if (document.body.classList.contains('reading-mode')) {
            showToast('Reading mode enabled');
        } else {
            showToast('Reading mode disabled');
        }
    }
    
    // Initialize app
    initializeAppSettings();
    updateRgbVariables();
    
    // Focus on input field when page loads
    userInput.focus();
    
    // Add floating action button after a slight delay
    setTimeout(addFloatingActionButton, 1000);
});