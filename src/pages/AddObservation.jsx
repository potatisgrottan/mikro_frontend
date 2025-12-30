import React, { useState} from "react";
import { useParams } from "react-router-dom";
import { journalApi, imageApi } from "../api"; 

function AddObservationPage() {
    const { encounterId } = useParams();
    
    const [form, setForm] = useState({ observationText: "" }); 

    const [imageId, setImageId] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(null); 

    const [editTextInput, setEditTextInput] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        
        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file)); 
        setImageUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file); 
            
            const imageRes = await imageApi.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const newImageId = imageRes.data.imageId;
            setImageId(newImageId);
            
            setPreviewUrl(`${imageApi.defaults.baseURL}/image/${newImageId}/raw?t=${Date.now()}`);

        } catch (err) {
            console.error("Initial image upload failed:", err);
            alert("Initial upload failed. Cannot edit this image.");
        } finally {
            setImageUploading(false);
        }
    };

    const handleAddText = async () => {
        if (!imageId || !editTextInput) return;
        setLoading(true);

        try {
            await imageApi.post(`/image/${imageId}/add-text`, {
                text: editTextInput,
            });
            alert("Text added! Image updated.");
            
            setPreviewUrl(prev => `${prev.split('?')[0]}?t=${Date.now()}`); 
            setEditTextInput("");

        } catch (error) {
            console.error("Editing failed:", error);
            alert("Failed to edit image.");
        } finally {
            setLoading(false);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const observationData = {
                observationText: form.observationText,
                imageId: imageId 
            };

            await journalApi.post(`/encounters/${encounterId}/observations`, observationData);

            alert("Observation added!");
            setForm({ observationText: "" });
            setSelectedFile(null);
            setImageId(null);
            setPreviewUrl(null);

        } catch (err) {
            console.error(err);
            alert("Failed to add observation. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Observation to Encounter {encounterId}</h2>
            
            {/* 1. TEXTINPUT */}
            <textarea
                name="observationText"
                placeholder="Observation text"
                value={form.observationText}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                rows="4"
            />
            
            {/* 2. FILUPPLADDNING */}
            <p>Attach Image (Optional):</p>
            <input 
                type="file" 
                name="image" 
                accept="image/*"
                onChange={handleFileChange} 
                disabled={imageUploading}
            />
            {imageUploading && <p>Uploading image...</p>}
            {previewUrl && (
                <div style={{ marginTop: '15px', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Image Preview & Edit:</h3>
                    

                    <img
                        alt="Image Preview" 
                        style={{ maxWidth: '100%', maxHeight: '400px', display: 'block' }} 
                    />
                    <div style={{ marginTop: '10px' }}>
                        <input
                            type="text"
                            placeholder="Text to add to image"
                            value={editTextInput}
                            onChange={(e) => setEditTextInput(e.target.value)}
                            disabled={loading || imageUploading}
                        />
                        <button 
                            type="button" 
                            onClick={handleAddText} 
                            disabled={!imageId || loading || imageUploading || editTextInput.trim() === ""}
                        >
                            Add Text to Image
                        </button>
                    </div>
                </div>
            )}
            
            {/* 4. SLUTGILTIG SKICKA-KNAPP */}
            <button type="submit" disabled={loading || imageUploading}>
                {loading ? "Saving Observation..." : "Add Observation"}
            </button>
        </form>
    );
}

export default AddObservationPage;