const fs = require('fs');
const path = require('path');

const testImagePath = path.join(__dirname, 'uploads', '1693336300367.png');

if (fs.existsSync(testImagePath)) {
    fs.unlink(testImagePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
        } else {
            console.log("File deleted successfully!");
        }
    });
} else {
    console.error("File does not exist:", testImagePath);
}