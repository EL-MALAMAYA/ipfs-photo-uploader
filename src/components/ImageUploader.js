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
    <div className="w-full max-w-md p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4 text-center">Upload Image to IPFS</h2>
      <div className="mb-4">
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={handleImageChange} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      {uploading && (
        <div className="text-center text-blue-500">Uploading...</div>
      )}
      {image && !uploading && (
        <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-md mb-4" />
      )}
      {ipfsHash && (
        <div className="mt-4 text-center">
          <p className="text-gray-700">Image uploaded to IPFS:</p>
          <a href={ipfsHash} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {ipfsHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
