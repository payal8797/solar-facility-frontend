import axios from 'axios';

const getHeaders = (token) => ({
  'Content-Type': 'multipart/form-data',
  'Authorization': `Bearer ${token}`,
});

/**
 * Uploads CSV data to the server using Axios.
 * @param {FormData} formData - The FormData object containing the CSV file.
 * @returns {Promise} A promise that resolves with the server response data.
 * @throws {Error} If token is not available or if an error occurs during the upload.
 */

export const uploadCSVData = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error('Token is not available');
    }
    const headers = getHeaders(token);
    const url = 'http://localhost:5000/upload';

    const uploadResponse = await axios.post(url, formData, { headers });

    return uploadResponse.data; 
  } catch (error) {
    console.error('Error uploading CSV data:', error);
    if (error.response) {
      console.error('Server responded with an error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};
