// Function to get a random value from an array
function getRandomValue(array) {
  const randomElement = array[Math.floor(Math.random() * array.length)]; // Fixed variable name
  return randomElement;
}

// Function simulating a heavy task with random delays and possible errors
function doSomeHeavyTask() {
  // Get a random delay time
  const ms = getRandomValue([100, 150, 200, 300, 600, 500, 1000, 1400, 2500]);

  // Decide randomly whether to throw an error
  const shouldThrowError = getRandomValue([1, 2, 3, 4, 5, 6, 7, 8]) === 8;

  // If error condition is met, throw a random error
  if (shouldThrowError) {
    const randomError = getRandomValue([
      "DB Payment Failure",
      "DB Server is Down",
      "Access Denied",
      "Not Found Error",
    ]);
    throw new Error(randomError);
  }

  // Return a promise that resolves after the delay (ms)
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms)); // Fixed resolve syntax
}

module.exports = { doSomeHeavyTask };
