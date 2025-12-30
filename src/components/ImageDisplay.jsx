import React from 'react';
import { imageApi } from '../api'; 

function ImageDisplay({ imageId }) {
    if (!imageId) return null;
    
    const imageUrl = `${imageApi.defaults.baseURL}/image/${imageId}/raw`;

    console.log("Loading Image URL:", imageUrl);

    return (
        <div style={{ marginTop: '10px' }}>
            <img 
                src={imageUrl} 
                alt={`Observation ${imageId}`}
                style={{ maxWidth: '100%', maxHeight: '200px', border: '1px solid #333' }} 
            />
        </div>
    );
}

export default ImageDisplay;