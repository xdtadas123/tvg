const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const imageMetadataPath = './imageMetadata.json';

app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false, message: 'No file uploaded' });
    }
    
    const imageDetails = {
        imagePath: `/uploads/${req.file.filename}`,
        text: "Some Text", // Placeholder - you'd typically get this from the upload form or some other source
        timestamp: Date.now()
    };
    saveImageDetails(imageDetails);
    res.json({ success: true, imagePath: imageDetails.imagePath, timestamp: imageDetails.timestamp });
});

app.get('/upload/', (req, res) => {
    res.json({ status: "success", message: "Hello from /upload/" });
});

app.get('/getImages', (req, res) => {
    const images = getAllImageDetails();
    res.json({ success: true, images: images });
});

app.delete('/deleteImage/:id', (req, res) => {
    const imageId = req.params.id;

    // Get the image metadata
    const allImages = getAllImageDetails();
    const imageDetails = allImages.find(img => img.imagePath.includes(imageId));

    if (!imageDetails) {
        return res.json({ success: false, message: "Image not found in metadata." });
    }

    // Derive the actual file path from metadata
    const imagePath = imageDetails.imagePath;
    const filePath = path.join(__dirname, imagePath.substr(1)); // Remove the leading slash

    fs.unlink(filePath, err => {
        if (err) {
            return res.json({ success: false, message: "Failed to delete image from filesystem." });
        }
        removeImageDetails(imagePath);
        res.json({ success: true, message: "Image deleted successfully." });
    });
});

app.listen(51041, () => {
    console.log('Server started on http://127.0.0.1:51041');
});

function saveImageDetails(imageDetails) {
    const currentData = JSON.parse(fs.readFileSync(imageMetadataPath, 'utf8'));
    currentData.push(imageDetails);
    fs.writeFileSync(imageMetadataPath, JSON.stringify(currentData));
}

function getAllImageDetails() {
    return JSON.parse(fs.readFileSync(imageMetadataPath, 'utf8'));
}

function removeImageDetails(imagePath) {
    const currentData = JSON.parse(fs.readFileSync(imageMetadataPath, 'utf8'));
    const newData = currentData.filter(item => item.imagePath !== imagePath);
    fs.writeFileSync(imageMetadataPath, JSON.stringify(newData));
}
