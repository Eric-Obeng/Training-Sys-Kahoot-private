export function initializeDropdownOptions() {
  const calculateExpiryDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  return {
    levels: [
      { name: 'Beginner' },
      { name: 'Intermediate' },
      { name: 'Advanced' },
    ],
    questionType: [
      { name: 'True/False', value: 'TRUE_FALSE' },
      { name: 'Multiple choice', value: 'MULTIPLE_CHOICE' },
      { name: 'Image based', value: 'IMAGE_BASE' },
    ],
    includeCode: [
      { name: 'No' },
      { name: 'JavaScript' },
      { name: 'Python' },
      { name: 'Java' },
      { name: 'C#' },
    ],
    timeLimit: [
      { name: '5 seconds', value: 5 },
      { name: '10 seconds', value: 10 },
      { name: '15 seconds', value: 15 },
      { name: '20 seconds', value: 20 },
      { name: '30 seconds', value: 30 },
      { name: '1 minute', value: 60 },
      { name: '2 minutes', value: 120 },
      { name: '3 minutes', value: 180 },
      { name: '4 minutes', value: 240 },
    ],
    point: [
      { name: 'Standard', value: 50 },
      { name: 'Double Point', value: 100 },
      { name: 'No Point', value: 0 },
    ],
    answerOptions: [{ name: 'Single Select' }, { name: 'Multi-select' }],
    expiryOptions: [
      { name: '1 day', value: calculateExpiryDate(1) },
      { name: '2 days', value: calculateExpiryDate(2) },
      { name: '3 days', value: calculateExpiryDate(3) },
      { name: '4 days', value: calculateExpiryDate(4) },
      { name: '5 days', value: calculateExpiryDate(5) },
      { name: '6 days', value: calculateExpiryDate(6) },
      { name: '1 week', value: calculateExpiryDate(7) },
      { name: '2 weeks', value: calculateExpiryDate(14) },
      { name: '3 weeks', value: calculateExpiryDate(21) },
      { name: '1 month', value: calculateExpiryDate(30) },
      { name: '2 months', value: calculateExpiryDate(60) },
      { name: '3 months', value: calculateExpiryDate(90) },
    ],
  };
}
