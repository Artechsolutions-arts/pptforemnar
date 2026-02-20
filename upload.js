const fs = require('fs');

async function upload() {
    const filePath = './pitch_deck.zip';
    if (!fs.existsSync(filePath)) {
        console.error('File not found: ' + filePath);
        return;
    }
    const fileData = fs.readFileSync(filePath);

    const formData = new FormData();
    // Using a simpler way to create the blob if needed
    formData.append('file', new Blob([fileData], { type: 'application/zip' }), 'pitch_deck.zip');

    try {
        const response = await fetch('https://file.io', {
            method: 'POST',
            body: formData
        });
        const text = await response.text();
        try {
            const result = JSON.parse(text);
            if (result.success) {
                console.log('Successfully uploaded!');
                console.log('Link: ' + result.link);
                console.log('Note: This link is one-time use and expires in 14 days.');
            } else {
                console.error('Upload failed:', result);
            }
        } catch (e) {
            console.error('Response was not JSON:', text);
        }
    } catch (error) {
        console.error('Error during upload:', error);
    }
}

upload();
