document.addEventListener("DOMContentLoaded", function() {
    displayUploadedImages();  // Call the function when the page loads

    // IMAGE UPLOAD LOGIC
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
    
        const notification = document.getElementById('notification');
        let imageFile = document.getElementById('imageInput').files[0];
        let imageText = document.getElementById('imageText').value;
    
        if (!imageText.trim() || imageText.trim() === "Add some text...") {
            notification.style.display = 'block';
            return;
        }
        notification.style.display = 'none';
    
        if (imageFile) {
            let formData = new FormData();
            formData.append('image', imageFile);
            formData.append('text', imageText);
    
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                handleImageUpload(data);
            })
            .catch(error => {
                console.error('There was an error:', error);
            });
        }
    });

    document.getElementById('imageInput').addEventListener('change', function() {
        let imageFile = document.getElementById('imageInput').files[0];
        if (imageFile) {
            document.querySelector('label').setAttribute('data-content', imageFile.name);
        } else {
            // Reset to default text if no file is selected
            document.querySelector('label').setAttribute('data-content', 'Select Image');
        }
    });

    // MENU TOGGLE LOGICS
    const profileMenu = document.querySelector('.profile-menu');

    document.querySelector('.profile-icon').addEventListener('click', function() {
        console.log('Profile icon clicked');
        if (profileMenu.style.visibility === 'hidden' || profileMenu.style.visibility === '') {
            profileMenu.style.transform = 'scaleY(1)';
            profileMenu.style.visibility = 'visible';
            profileMenu.style.opacity = '1';
        } else {
            profileMenu.style.transform = 'scaleY(0)';
            profileMenu.style.visibility = 'hidden';
            profileMenu.style.opacity = '0';
        }
    });
    

    document.querySelector('.guest-icon').addEventListener('click', function() {
        const menu = document.querySelector('.guest-menu');
        if (menu.style.top === '-100%') {
            menu.style.top = '10px';
        } else {
            menu.style.top = '-100%';
        }
    });

    // OTHER INTERACTION LOGICS
    const profileName = document.getElementById('profileName');
    profileName.addEventListener('click', function() {
        if (!profileName.isContentEditable) {
            profileName.contentEditable = "true";
            profileName.focus();
        }
    });

    profileName.addEventListener('blur', function() {
        if (profileName.isContentEditable) {
            profileName.contentEditable = "false";
        }
    });

    document.querySelector('.camera-icon').addEventListener('click', function() {
        // Logic for camera icon, maybe open file dialog or another action.
    });

    // LIVE FILTERING LOGIC
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase().trim();
        const posts = document.querySelectorAll('.insta-post');

        posts.forEach(post => {
            const description = post.querySelector('.post-text') 
                ? post.querySelector('.post-text').textContent.toLowerCase().trim() 
                : "";

            if (description.includes(query)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    });

    document.querySelector('#uploadButton').addEventListener('click', function() {
        let textAreaValue = document.querySelector('#yourTextAreaID').value;
        let notification = document.querySelector('.notification');

        if(!textAreaValue.trim()) {
            notification.innerText = "Please add some text before uploading the image.";
            notification.style.display = 'block';
        } else {
            notification.style.display = 'none';
        }
    });

    document.getElementById('yourFileInputID').addEventListener('change', function(){
        const formData = new FormData();
        formData.append('image', this.files[0]);

        fetch('upload.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'ok') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('There was an error uploading the image!', error);
        });
    });

    // DISPLAY UPLOADED IMAGE
    const image = document.querySelector('#imageInput').files[0];
    const text = document.querySelector('#imageText').value;
    
    if (image && text.trim()) {
        const post = document.createElement('div');
        post.classList.add('insta-post');
        post.innerHTML = `
            <div class="post-header">
                <img src="${URL.createObjectURL(image)}" alt="user profile image" class="profile-image">
                <span class="username">username_here</span>
            </div>
            <div class="post-image">
                <img src="${URL.createObjectURL(image)}" alt="uploaded image">
            </div>
            <div class="post-text">${text}</div>
            <div class="post-date">${new Date().toLocaleDateString()}</div>
        `;
        document.querySelector('#imagesContainer').appendChild(post);
    }

    function handleUpload(event) {
        event.preventDefault();
        
        const fileInput = document.getElementById('imageInput');
        const textArea = document.getElementById('imageText');
        const imagesContainer = document.getElementById('imagesContainer');
        
        if (!fileInput.files.length) {
            alert('Please select an image to upload.');
            return;
        }
        
        if (!textArea.value.trim()) {
            alert('Please add some text before uploading the image.');
            return;
        }
        
        const postElement = document.createElement('div');
        postElement.className = 'insta-post';
        
        const headerElement = document.createElement('div');
        headerElement.className = 'post-header';
        headerElement.innerHTML = `
            <img src="path_to_user_image.jpg" alt="user profile image" class="profile-image">
            <span class="username">username_here</span>
        `;
        const imageElement = document.createElement('div');
        imageElement.className = 'post-image';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(fileInput.files[0]);
        img.onload = function() {
            URL.revokeObjectURL(img.src);
        }
        imageElement.appendChild(img);

        const textElement = document.createElement('div');
        textElement.className = 'post-text';
        textElement.textContent = textArea.value;

        const dateElement = document.createElement('div');
        dateElement.className = 'post-date';
        dateElement.textContent = new Date().toLocaleDateString();
        
        postElement.appendChild(headerElement);
        postElement.appendChild(imageElement);
        postElement.appendChild(textElement);
        postElement.appendChild(dateElement);
        
        imagesContainer.appendChild(postElement);
    }
});


