const numbers = [1, 10, 101, 1001, 1011, 1100, 1101, 10001];
const rangeValues = [1, 10, 100, 1000, 10000, 100000, 1000000];

let currentIndex = 0;
let score = 0;
let currentNumber = 0;

const playButton = document.getElementById('playButton');
const numberInput = document.getElementById('numberInput');
const submitButton = document.getElementById('submitButton');
const scoreElement = document.getElementById('score');
const fireworksElement = document.getElementById('fireworks');
const minRangeSelect = document.getElementById('minRange');
const maxRangeSelect = document.getElementById('maxRange');

playButton.addEventListener('click', playNumber);
submitButton.addEventListener('click', checkAnswer);
numberInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
    if (event.key === ' ') {
        playNumber();
    }
});

minRangeSelect.addEventListener('change', updateRanges);
maxRangeSelect.addEventListener('change', updateRanges);

function updateRanges() {
    let minVal = parseInt(minRangeSelect.value);
    let maxVal = parseInt(maxRangeSelect.value);
    console.log("Updating ranges", minVal, maxVal);
    if (minVal >= maxVal) {
        if (maxVal === rangeValues[rangeValues.length - 1]) {
            minRangeSelect.value = rangeValues[rangeValues.indexOf(maxVal) - 1];
        } else {
            maxRangeSelect.value = rangeValues[rangeValues.indexOf(minVal) + 1];
        }
        minVal = parseInt(minRangeSelect.value);
        maxVal = parseInt(maxRangeSelect.value);
    }

    updateSelectOptions();
    drawNumber(minVal, maxVal);
    console.log("Drawn number", currentNumber);
    playNumber();
}

function updateSelectOptions() {
    const minVal = parseInt(minRangeSelect.value);
    const maxVal = parseInt(maxRangeSelect.value);

    Array.from(minRangeSelect.options).forEach(option => {
        option.disabled = parseInt(option.value) >= maxVal;
    });

    Array.from(maxRangeSelect.options).forEach(option => {
        option.disabled = parseInt(option.value) <= minVal;
    });
}

// Assigns a new number to currentNumber
function drawNumber(min, max) {
    if (!isPowerOfTen(min) || !isPowerOfTen(max) || min >= max) {
        throw new Error("Both min and max must be powers of 10 and min must be less than max.");
    }

    // Get the number of digits in the max number (since max is a power of 10, this helps us know the upper limit for digits)
    const maxDigits = String(max).length;

    // Function to check if a number is a power of ten
    function isPowerOfTen(num) {
        return Math.log10(num) % 1 === 0;
    }

    // Function to generate a random number between min and max
    function getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to modify a number to insert the required number of zeros
    function modifyNumberWithZeros(number) {
        let digits = String(number).split(''); // Convert number to array of digits
        const existingZerosCount = digits.reduce((count, digit) => {
            return digit === '0' ? count + 1 : count;
        }, 0);
        console.log("Existing zeros count", existingZerosCount);
        let zerosToAddCount = getRandomInRange(existingZerosCount,
            digits.length - 2 - existingZerosCount);
        console.log("Drawn zeros count", zerosToAddCount);
        // Exclude the first digit from being a zero, as well as existing zeros
        let availablePositions = [];
        for (let i = 1; i < digits.length; i++) {
            if (digits[i] !== '0') {
                availablePositions.push(i);
            }
        }
        console.log("Available positions", availablePositions);

        // Randomly pick positions to place zeros
        let zeroIndices = [];
        while (zeroIndices.length < zerosToAddCount && availablePositions.length > 0) {
            const index = Math.floor(Math.random() * availablePositions.length);
            zeroIndices.push(availablePositions[index]);
            availablePositions.splice(index, 1);
        }
        console.log("Zero indices", zeroIndices);

        // Place zeros at the selected positions
        zeroIndices.forEach(index => {
            digits[index] = '0';
        });

        return parseInt(digits.join(''), 10);
    }

    // Generate a random number in the range first
    let randomNum = getRandomInRange(min, max);
    console.log("Random number", randomNum);
    // Modify the number to add zeros while ensuring the first digit is non-zero
    currentNumber = modifyNumberWithZeros(randomNum);
    console.log("Current number drawn", currentNumber);
}

function playNumber() {
    console.log("Playing number", currentNumber);
    const utterance = new SpeechSynthesisUtterance(currentNumber.toString());
    utterance.lang = 'de-DE';
    speechSynthesis.speak(utterance);
    console.log(currentNumber);
    numberInput.focus();
}

function checkAnswer() {
    const userInput = parseInt(numberInput.value);
    console.log("Checking answer", userInput, currentNumber);
    if (userInput === currentNumber) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        // If entered correctly, draw new number.
        drawNumber(parseInt(minRangeSelect.value), parseInt(maxRangeSelect.value));
        //currentIndex++;

        if (currentIndex >= numbers.length) {
            showFireworks();
        } else {
            //alert('Correct! Play the next number.');
        }
    } else {
       //alert('Incorrect. Try again!');
    }
    numberInput.value = '';
    playNumber();
}

function showFireworks() {
    fireworksElement.innerHTML = '🎆🎇✨';
    fireworksElement.style.fontSize = '100px';
    //alert('Congratulations! You\'ve guessed all the numbers correctly!');
}

//updateRanges();