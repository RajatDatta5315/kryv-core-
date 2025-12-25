use client;
import { useState } from 'react';

export default function ViralPostGenerator() {
  const [productName, setProductName] = useState('');
  const [generatedTweet, setGeneratedTweet] = useState('');

  const handleGenerateTweet = () => {
    const tweet = `Freelancers, stop losing money! 💸 Use this ${productName}...`;
    setGeneratedTweet(tweet);
  };

  return (
    <div className="flex justify-center p-4">
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-1/2">
        <h1 className="text-emerald-500 text-2xl font-bold mb-4">Viral Post Generator</h1>
        <input 
          type="text" 
          placeholder="Product Name" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
          className="bg-gray-800 p-2 rounded-lg w-full mb-4"
        />
        <button 
          onClick={handleGenerateTweet} 
          className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg w-full"
        >
          Generate
        </button>
        {generatedTweet && (
          <p className="text-gray-300 mt-4">{generatedTweet}</p>
        )}
      </div>
    </div>
  );
}