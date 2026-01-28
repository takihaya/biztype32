// API utility functions

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function saveResult(typeCode, scores) {
  try {
    const response = await fetch(`${API_BASE}/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ typeCode, scores }),
    });

    if (!response.ok) {
      throw new Error('Failed to save result');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Could not save result to server:', error);
    return null;
  }
}

export async function getResult(id) {
  try {
    const response = await fetch(`${API_BASE}/results/${id}`);

    if (!response.ok) {
      throw new Error('Result not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get result:', error);
    return null;
  }
}
