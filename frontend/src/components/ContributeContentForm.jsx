import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Input,
    IconButton,
    Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const categoryFields = {
    'BalitAraneta': ['Who', 'What', 'Where', 'When', 'Additional Info'],
    'Animo Idol': ['Name of Featured Lasallian', 'Grade/Year and Section/Course', 'Skills/Talents', 'Why he/she is an Animo Idol'],
    'Animo In-Demand': ['Name of Owner (Lasallian or family member)', 'Grade/Year and Section/Course', 'Name of Business', 'Details about the Business', 'Products/Services (with details)'],
    'Lasallian Tambayan': ['Name of Store/Establishment (store, cafe, restaurant, gym, etc.)', 'Location/Address of the Store/Establishment', 'What the place can offer? (food, entertainment, comfort, scenery, etc.)'],
    'Proud Lasallian': ['Name of Featured Lasallian', 'Grade/Year and Section/Course (position, if employee)'],
    'The DLSAU InfoTalk': ['Name of Speaker/Presenter and grade/year/course', 'Topic/Title', 'Details About the Topic', 'Video Link'],
    'DLSAU Testimonials': ['Name of DLSAU Student', 'Grade/Year and Section/Course', 'Why did you choose DLSAU? And why would you recommend DLSAU to others?'],
    'Galing Araneta, Galing Araneta': ['Name of DLSAU Alumnus/alumna', 'Year Graduated at DLSAU and degree/level/strand they took', 'Work-related Achievements'],
    'AniModel': ['Name of Featured Lasallian', 'Grade/Year and Section/Course', 'Why is he/she a Lasallian model inside and out?']
};

const DynamicForm = () => {
    const [category, setCategory] = useState('');
    const [formData, setFormData] = useState({});
    const [mediaFiles, setMediaFiles] = useState([]);
    const [errors, setErrors] = useState({});

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setFormData({});
        setErrors({});
    };

    const handleInputChange = (e, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleFileChange = (e) => {
        setMediaFiles(prev => [...prev, ...Array.from(e.target.files)]);
    };

    const handleRemovePhoto = (index) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData['Your Name']) newErrors['Your Name'] = 'Name is required';
        if (!formData['Your Email']) {
            newErrors['Your Email'] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData['Your Email'])) {
            newErrors['Your Email'] = 'Invalid email format';
        }

        if (!category) newErrors.category = 'Category is required';

        if (category) {
            categoryFields[category].forEach(field => {
                if (field !== 'Additional Info' && !formData[field]) {
                    newErrors[field] = 'This field is required';
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedContent = Object.entries(formData)
        .filter(([key]) => key !== 'Your Name' && key !== 'Your Email')
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    const formPayload = new FormData();
    formPayload.append('author', formData['Your Name']);
    formPayload.append('authorEmail', formData['Your Email']);
    formPayload.append('category', category);
    formPayload.append('content', formattedContent);
    mediaFiles.forEach(file => {
        formPayload.append('photos', file);
    });

    fetch('http://localhost:8081/api/v1/contribute-news', {
        method: 'POST',
        body: formPayload
    })
        .then(res => res.json())
        .then(() => {
            alert('Post submitted successfully!');
            window.location.reload();
        })
        .catch(() => alert('Error submitting post.'));
};

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: '#fff' }}
        >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Contribute a Post
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.category}>
                <InputLabel>Select Category</InputLabel>
                <Select
                    value={category}
                    label="Select Category"
                    onChange={handleCategoryChange}
                    required
                >
                    {Object.keys(categoryFields).map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                </Select>
                {errors.category && <Typography variant="caption" color="error">{errors.category}</Typography>}
            </FormControl>
            <TextField
                label="Your Name"
                value={formData['Your Name'] || ''}
                onChange={(e) => handleInputChange(e, 'Your Name')}
                error={!!errors['Your Name']}
                helperText={errors['Your Name']}
                fullWidth
                required
                sx={{ mb: 2 }}
            />

            <TextField
                label="Your Email"
                type="email"
                value={formData['Your Email'] || ''}
                onChange={(e) => handleInputChange(e, 'Your Email')}
                error={!!errors['Your Email']}
                helperText={errors['Your Email']}
                fullWidth
                required
                sx={{ mb: 3 }}
            />



            {category && categoryFields[category].map(field => (
                <TextField
                    key={field}
                    label={field}
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(e, field)}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    fullWidth
                    multiline
                    required={field !== 'Additional Info'}
                    sx={{ mb: 2 }}
                />
            ))}

            <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Upload Media:</Typography>
                <Input type="file" inputProps={{ multiple: true }} onChange={handleFileChange} />
            </FormControl>

            {/* Preview and Remove */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {mediaFiles.map((file, index) => (
                    <Grid item xs={4} key={index}>
                        <Box position="relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => handleRemovePhoto(index)}
                                sx={{ position: 'absolute', top: 0, right: 0, bgcolor: '#fff' }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
            >
                Submit Post
            </Button>
        </Box>
    );
};

export default DynamicForm;
