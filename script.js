// Camera feature
const cameraBtn = document.getElementById('camera-button');
cameraBtn.addEventListener('click', () => {
// Open a new popup window
const cameraWindow = window.open("", "Camera Capture", "width=400,height=400");

// Add the content in the new popup window
cameraWindow.document.write(`
				<video id="video" width="500" height="250" autoplay></video>
				<br/>
				<button id="capture">Capture Photo</button>
				<canvas id="canvas" width="500" height="250" style="display:none;"></canvas>
				<script>
					const video = document.getElementById('video');
					const canvas = document.getElementById('canvas');
					const context = canvas.getContext('2d');
					const captureButton = document.getElementById('capture');
	
					// Access the camera
					navigator.mediaDevices.getUserMedia({ video: true })
					.then(stream => {
						video.srcObject = stream;
					})
					.catch(err => {
						console.error('Error accessing camera:', err);
					});
	
					// Capture the image when the button is clicked
					captureButton.addEventListener('click', () => {
						canvas.style.display = 'block';
						context.drawImage(video, 0, 0, canvas.width, canvas.height);
						const image = canvas.toDataURL('image/jpeg');
						
						// Save the captured image as a file
						const link = document.createElement('a');
						link.href = image;
						link.download = 'captured_image.jpg';
						link.click();
	
						// Stop the video stream
						const tracks = video.srcObject.getTracks();
						tracks.forEach(track => track.stop());
					});
				<\/script>
			`);
});

// File upload feature
const fileBtn = document.getElementById('file-button');
const inputFile = document.createElement('input');
inputFile.type = 'file';
inputFile.style.display = 'none';

fileBtn.addEventListener('click', () => {
    inputFile.click();
});

inputFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        link.click();
    }
});

// Append the hidden file input
document.body.appendChild(inputFile);

// Microphone feature
const micBtn = document.getElementById('mic-button');
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const blob = new Blob([transcript], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'transcript.txt';
        link.click();
    };
} else {
    alert('Speech recognition not supported in this browser.');
}
