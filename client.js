// ... Your existing functions and event listeners ...

function createImageContainer(imageName, imageTextValue, timestamp) {
    console.log("Button created for image:", imageName);
    
    if (document.getElementById(`image-${imageName.split('.')[0]}`)) {
        console.log("Image already displayed:", imageName);
        return;  // If the image is already displayed, exit the function
    }
    
    // Create main container
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';
    imageWrapper.id = `image-${imageName.split('.')[0]}`; // Assigning an ID for easy removal

    // Create and append the image
    const img = document.createElement('img');
    img.src = `/uploads/${imageName}`;
    imageWrapper.appendChild(img);

    // Create and append the text
    const imageTextEl = document.createElement('p');
    imageTextEl.innerText = imageTextValue;
    imageWrapper.appendChild(imageTextEl);

    // Create and append the date
    const imageDate = document.createElement('span');
    imageDate.innerText = new Date(timestamp).toLocaleDateString();
    imageWrapper.appendChild(imageDate);

    // Create and append the remove button
    const removeButton = document.createElement('button');
    removeButton.innerText = 'X';

    removeButton.addEventListener('click', function() {
        const imageId = imageName.split('.')[0];  // Extract image ID from the imageName
        deleteImage(imageId);
    });

    imageWrapper.appendChild(removeButton);

    // Append the main container to the images container
    document.getElementById('imagesContainer').appendChild(imageWrapper);
}

function deleteImage(imageId) {
    // Make the DELETE request to the server
    fetch(`/deleteImage/${imageId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the image container from the DOM
            const imageContainer = document.getElementById(`image-${imageId}`);
            if (imageContainer) {
                imageContainer.remove();
            }
        } else {
            // Handle the error (show a message to the user or something similar)
            console.error('Failed to delete the image:', data.message);
        }
    })
    .catch(error => {
        console.error('Error during the fetch:', error);
    });
}

function handleImageUpload(data) {
    const imageName = data.imagePath.split('/uploads/')[1];
    
    if (document.getElementById(`image-${imageName.split('.')[0]}`)) {
        console.log("Image already handled:", imageName);
        return;  // If the image is already handled, exit the function
    }

    createImageContainer(imageName, imageText.value, data.timestamp);
    imageInput.value = '';
    imageText.value = '';
    document.querySelector('label').setAttribute('data-content', '');
}

function displayUploadedImages() {
    // Clear existing images
    const imagesContainer = document.getElementById('imagesContainer');
    imagesContainer.innerHTML = '';
    
    // Fetch and display images
    fetch('/getImages')
    .then(response => response.json())
    .then(data => {
        if (data.success && data.images) {
            data.images.forEach(image => {
                const imageName = image.imagePath.split('/uploads/')[1];

                // Check if the imageName and image.text are valid before creating the container
                if (imageName && image.text) {
                    createImageContainer(imageName, image.text, image.timestamp);
                }
            });
        }
    })
    .catch(error => console.error('Error fetching images:', error));
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded fired");
    // Call the function when the page loads
    displayUploadedImages();

    const profileIcon = document.querySelector('.profile-icon');
    const profileMenu = document.querySelector('.profile-menu');

    profileIcon.addEventListener('click', function() {
        if (profileMenu.classList.contains('hide')) {
            profileMenu.classList.remove('hide');
        } else {
            profileMenu.classList.add('hide');
        }
    });
})
