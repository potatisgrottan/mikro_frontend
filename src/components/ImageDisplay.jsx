import React from 'react';
import { imageApi } from '../api'; // Anta att imageApi bas-URL är http://localhost:3001

function ImageDisplay({ imageId }) {
    if (!imageId) return null;
    

    // Bygger den direkta URL:en för att hämta den råa bilden från Image Service
    // Image Service URL är: http://localhost:3001/image/:id/raw
    const imageUrl = `${imageApi.defaults.baseURL}/image/${imageId}/raw`;

    console.log("Loading Image URL:", imageUrl);

    // Vi använder img-taggen direkt mot API-endpointen
    return (
        <div style={{ marginTop: '10px' }}>
            <img 
                src={imageUrl} 
                alt={`Observation Image ${imageId}`} 
                style={{ maxWidth: '100%', maxHeight: '200px', border: '1px solid #333' }} 
            />
        </div>
    );
}

export default ImageDisplay;