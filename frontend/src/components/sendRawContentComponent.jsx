import React, { useState } from 'react';
import PublicNewsService from '../services/PublicNewsService';
import {
    Button,
    TextField,
    Typography,
    Box,
    Paper,
    Divider,
    IconButton,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RawContentSubmitComponent = () => {
    const [content, setContent] = useState('');
    const [additionalPhotos, setAdditionalPhotos] = useState([]);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAdditionalPhotos((prev) => [...prev, ...files]);
    };

    const handleRemovePhoto = (indexToRemove) => {
        setAdditionalPhotos((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('content', content);
        additionalPhotos.forEach((file) => {
            formData.append('additionalPhotos', file);
        });

        try {
            await PublicNewsService.submitRawContent(formData);
            setMessage('Content submitted successfully!');
            setContent('');
            setAdditionalPhotos([]);
        } catch (error) {
            console.error('Submission failed', error);
            setMessage('Failed to submit content.');
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 5 }}>
            <Paper elevation={6} sx={{ maxWidth: 800, mx: 'auto', p: 4, borderRadius: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ textAlign: 'center', fontWeight: 'bold', color: '#00703C' }}
                >
                    DLSAU Content Contribution
                </Typography>

                <Divider sx={{ mb: 3, bgcolor: '#FFD700' }} />

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Enter the details"
                        multiline
                        rows={10}
                        fullWidth
                        margin="normal"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#00703C' },
                                '&:hover fieldset': { borderColor: '#005A30' }
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            mt: 2,
                            backgroundColor: '#00703C',
                            '&:hover': { backgroundColor: '#005A30' },
                            borderRadius: 2
                        }}
                    >
                        Upload Your Photos
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Button>

                    {additionalPhotos.length > 0 && (
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {additionalPhotos.map((file, index) => (
                                <Grid item xs={6} sm={4} md={3} key={index} sx={{ position: 'relative' }}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '2px solid #00703C'
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleRemovePhoto(index)}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(255,255,255,0.7)',
                                            '&:hover': { backgroundColor: '#ffcccc' }
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        sx={{
                            mt: 3,
                            backgroundColor: '#F0F0F0',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#e6c200' },
                            borderRadius: 2
                        }}
                        fullWidth
                    >
                        Submit Content
                    </Button>

                    {message && (
                        <Typography
                            sx={{
                                mt: 3,
                                textAlign: 'center',
                                color: message.includes("success") ? '#00703C' : 'error.main',
                                fontWeight: 'medium'
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default RawContentSubmitComponent;
