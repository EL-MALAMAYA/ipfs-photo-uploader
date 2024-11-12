import React, { useState } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle the file selection and preview
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file);
      setImage(URL.createObjectURL(file));
      setErrorMessage(null); // Clear any previous errors
      await uploadToPinata(file);
    }
  };

  // Function to upload image to Pinata with error handling and progress tracking
  const uploadToPinata = async (file, retries = 3) => {
    const apiKey = '549f55bf4068aae1e2c6'; // Replace with your actual API key
    const apiSecret = '4cdcdeddf69d095a13fb94080cb7a2f6a04e91b7202214779aa56a7b253cd088'; // Replace with your actual API secret

    try {
      console.log("Starting upload...");
      setUploading(true);
      setUploadProgress(0);
      setErrorMessage(null);

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

      // Prepare the file for upload
      const formData = new FormData();
      formData.append('file', file);

      // Log the attempt to upload to Pinata
      console.log("Uploading file to Pinata...");

      // Upload to Pinata using fetch
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${btoa(`${apiKey}:${apiSecret}`)}`,
        },
        body: formData,
      });

      const result = await response.json();

      // Check if the response is successful
      if (response.ok) {
        console.log("File uploaded to IPFS:", result.IpfsHash);
        setIpfsHash(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
        setShowModal(true); // Show modal on successful upload
      } else {
        throw new Error(result.error || 'Failed to upload to IPFS');
      }
    } catch (error) {
      console.error("Error uploading file:", error);

      // Retry mechanism
      if (retries > 0) {
        console.log("Retrying upload...");
        uploadToPinata(file, retries - 1);
      } else {
        setErrorMessage("There was an error uploading your image. Please try again.");
      }
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
          Capture Photo
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
          <img src={image} alt="Preview" className="w-full sm:h-48 h-32 object-cover rounded-lg shadow-md mb-4" />
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
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

      {/* Camera button positioned in the lower-middle of the screen */}
      <button
        onClick={() => document.querySelector('input[type=file]').click()}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
      >
        📸
      </button>
    </div>
  );
};

export default ImageUploader;
