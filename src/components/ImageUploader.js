import React, { useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setUploadProgress(0);

    // Simulated upload progress for UX (replace with actual progress if available)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 500);

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
  <div className="relative pt-2">
    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
      <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300"></div>
    </div>
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
