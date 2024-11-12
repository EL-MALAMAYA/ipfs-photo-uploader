import React, { useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setErrorMessage(null); // Clear any previous errors
      await uploadToIpfs(file);
    }
  };

  const uploadToIpfs = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      setErrorMessage(null); // Clear any previous errors

      // Simulated upload progress for UX
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
      setShowModal(true); // Show modal on successful upload
    } catch (error) {
      console.error('Error uploading file: ', error);
      setErrorMessage('There was an error uploading your image. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0); // Reset progress after upload completes or fails
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Capture the Moment!</h2>
      
      <div className="mb-4">
        <label className="cursor-pointer inline-flex items-center bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-200">
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
        <div className="mt-4 animate-fadeIn">
          <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-md mb-4" />
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Uploaded Successfully!</h3>
            <p className="text-gray-700 mb-4">Here’s your IPFS link:</p>
            <a href={ipfsHash} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all hover:text-blue-700">
              {ipfsHash}
            </a>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => document.querySelector('input[type=file]').click()}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
      >
        📸
      </button>
    </div>
  );
};

export default ImageUploader;
