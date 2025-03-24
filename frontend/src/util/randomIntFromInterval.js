//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
export default function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}