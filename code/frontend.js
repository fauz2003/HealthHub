const form = document.getElementById('questionnaire-form');
const healthStatusText = document.getElementById('health-status-text');

console.log('Frontend JavaScript loaded');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log('Form submitted');

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/health-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch health analysis');
    }

    const result = await response.json();
    healthStatusText.textContent = result.healthAnalysis;
    console.log('Health analysis received:', result.healthAnalysis);
  } catch (error) {
    console.error('Error fetching health analysis:', error);
    // Display an error message to the user or handle the error appropriately
  }
});
