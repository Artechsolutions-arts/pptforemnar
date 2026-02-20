const { execSync } = require('child_process');

try {
    console.log('Attempting upload to bashupload.com...');
    const output = execSync('curl -T ./pitch_deck.zip https://bashupload.com', { encoding: 'utf8' });
    console.log('Upload complete!');
    console.log(output);
} catch (error) {
    console.error('Failed to upload using curl:', error.message);
    try {
        const output = execSync('powershell "Invoke-WebRequest -Uri https://bashupload.com/pitch_deck.zip -Method Put -InFile ./pitch_deck.zip"', { encoding: 'utf8' });
        console.log('Upload complete via PowerShell!');
        console.log(output);
    } catch (e2) {
        console.error('Failed via PowerShell too.');
    }
}
