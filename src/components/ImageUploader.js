import React, { useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await uploadToIpfs(file);
    }
  };

  const uploadToIpfs = async (file) => {
    try {
      setUploading(true);
      const added = await client.add(file);
      setIpfsHash(`https://ipfs.infura.io/ipfs/${added.path}`);
    } catch (error) {
      console.error('Error uploading file: ', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Image to IPFS</h2>
      
      <div className="mb-4">
        <label className="cursor-pointer inline-flex items-center bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleImageChange} 
            className="hidden"
          />
          Select or Capture Photo
        </label>
      </div>

      {uploading && (
  <div className="text-blue-600 text-lg font-semibold">
    <svg className="animate-spin h-5 w-5 mr-2 inline-block text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    Uploading...
  </div>
)}

      
      {image && !uploading && (
        <div className="mt-4">
          <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-md mb-4" />
        </div>
      )}

      {ipfsHash && (
        <div className="mt-6">
          <p className="text-gray-700">Image uploaded to IPFS:</p>
          <a href={ipfsHash} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
            {ipfsHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
