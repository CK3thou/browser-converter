// Popup script
document.getElementById('open-settings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('feedback-link').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Thank you for using Text Converter Pro!\n\nWe appreciate your feedback. Please share your suggestions and bug reports on GitHub or through Chrome Web Store reviews.');
});

document.getElementById('about-link').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Text Converter Pro v1.0.0\n\nConvert highlighted text instantly:\n• Timezone conversions\n• Currency conversions\n\nQuick, easy, and always on your browser!');
});
