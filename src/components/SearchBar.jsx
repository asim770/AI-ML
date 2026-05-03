import React, { useState } from 'react';
import { Search, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCity(transcript);
      onSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-md mx-auto mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex items-center w-full h-12 rounded-full focus-within:shadow-lg bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden transition-all duration-300">
        <div className="grid place-items-center h-full w-12 text-white/80">
          <Search size={20} />
        </div>

        <input
          className="peer h-full w-full outline-none text-sm text-white bg-transparent pr-2 placeholder-white/70"
          type="text"
          id="search"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        
        <button 
          type="button"
          onClick={handleVoiceSearch}
          className={`grid place-items-center h-full w-12 text-white/80 hover:text-white transition-colors ${isListening ? 'animate-pulse text-red-400' : ''}`}
          aria-label="Voice Search"
        >
          <Mic size={20} />
        </button>
      </div>
    </motion.form>
  );
};

export default SearchBar;
