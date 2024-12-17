import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

const UploadImage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<{ url: string }>('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImageUrl(response.data.url);
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Imagen</button>
      {imageUrl && <img src={imageUrl} alt="Imagen subida" />}
    </div>
  );
};

export default UploadImage;