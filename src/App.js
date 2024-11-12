import React from 'react';
import ImageUploader from './components/ImageUploader';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6">
        <ImageUploader />
      </div>
    </div>
  );
}

export default App;
