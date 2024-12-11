let characters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "~",
  "`",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "-",
  "+",
  "=",
  "{",
  "[",
  "}",
  "]",
  ",",
  "|",
  ":",
  ";",
  "<",
  ">",
  ".",
  "?",
  "/",
];

// Toggles work
const numbersToggleInput = document.getElementById("numbers-toggle");
const symbolsToggleInput = document.getElementById("symbols-toggle");
// Forcing checked state at page reload 'script run'
numbersToggleInput.checked = true;
symbolsToggleInput.checked = true;
// Regular Expression for false state of numbers toggle -> returns all but numbers
const allButNumbersRegex = new RegExp(/[^0-9]/g);
// Regular Expression for false state of symbols toggle -> returns all but symbols
const allButSymbolsRegex = new RegExp(/[a-zA-Z0-9]/g);
// Regular Expression for combined false states of both toggles
const alphOnlyRegex = new RegExp(/[a-zA-Z]/g);

// Toggle 'states' handler -> [we don't have to make events for the toggle inputs]
function toggleHandler() {
  let filterdChars = characters;
  if (!numbersToggleInput.checked) {
    filterdChars = characters
      .reduce((letter, next) => letter + next)
      .match(allButNumbersRegex);
  }
  if (!symbolsToggleInput.checked) {
    filterdChars = characters
      .reduce((letter, next) => letter + next)
      .match(allButSymbolsRegex);
  }
  if (!numbersToggleInput.checked && !symbolsToggleInput.checked) {
    filterdChars = characters
      .reduce((letter, next) => letter + next)
      .match(alphOnlyRegex);
  }
  return filterdChars;
}

// Function to generate 15 random indexes to be used to access the characters array above
function generateIndexes(filteredCharacters) {
  // Fetching the password length chosen by the user with default value of 15
  let passwordLength = document.getElementById("password-length").value || 15;
  let indexesContainer = [];
  for (let i = 0; i < passwordLength; i++) {
    let j = Math.floor(Math.random() * filteredCharacters.length);
    indexesContainer.push(j);
  }
  // Checking for big values of password lengths enetered by the user
  if (passwordLength > filteredCharacters.length) {
    //alert("Error: Password length exceeds the number of available characters.");
    swal({
      title: "Error",
      text: "Password length exceeds the number of available characters.",
      icon: "error",
    });
    return; // Exit the function if the condition is met
  }
  // You need to return the temp array here in order to declare and set the values of the password arrays above in one shot
  return indexesContainer;
}

// Fetching the app container
let appContainer = document.querySelector(".container");

// Fetching the passwords display elements
let passwordOne = document.querySelector(".first-password");
let passwordTwo = document.querySelector(".second-password");

// Fetching the copy button element
let copyButton = document.querySelector(".copy-btn");
copyButton.style.opacity = 0.2; // Starting with vague button
copyButton.style.cursor = "default";

// The main passwords generation event
let generatorButton = document
  .querySelector(".generator-btn")
  .addEventListener("click", function () {
    // The filtered characters array returned by the toggle handler
    let filteredCharacters = toggleHandler();

    // Placing these indexes creation inside the event allows you to recreate new passwords each time the button is clickes as opposed to initialize them outside (in this case you get one set for each password)
    let firstPasswordIndexes = generateIndexes(filteredCharacters);
    let secondPasswordIndexes = generateIndexes(filteredCharacters);

    // Retrieve characters using indexes arrays created
    passwordOne.textContent = firstPasswordIndexes
      .map((index) => filteredCharacters[index])
      .join(""); // Note that we join the array into a string
    passwordTwo.textContent = secondPasswordIndexes
      .map((index) => filteredCharacters[index])
      .join("");

    // Fully showing the copy button
    copyButton.style.opacity = 1;
    copyButton.style.cursor = "pointer";
  });

// The copy to clipboard event
copyButton.addEventListener("click", function () {
  // Combine both passwords into a single string
  let combinedPasswords = `Password 1: ${passwordOne.textContent}\nPassword 2: ${passwordTwo.textContent}`;

  // Use the "Clipboard API" to copy the combined passwords when the button is active
  if (copyButton.style.cursor === "pointer") {
    navigator.clipboard
      .writeText(combinedPasswords)
      .then(() => {
        // Optionally, you can alert the user or show a message
        swal("", "Passwords copied to clipboard!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }
});

// Fetching the passwords container
let passContainer = document.querySelector(".passwords-container");

// Copy on click function for the spans of the passwords
function copyOnClick(passSpan) {
  passSpan.addEventListener("click", function () {
    if (passSpan.textContent) {
      let toCopyPass = passSpan.textContent;
      navigator.clipboard
        .writeText(toCopyPass)
        .then(() => {
          // Create a callout span element
          const callout = document.createElement("span");
          callout.className = "callout"; // Assign a class for styling
          callout.textContent = "Copied!"; // Set the text content

          // Append the callout as a child of the passwords container
          passContainer.appendChild(callout);

          // Optionally, you can remove the callout after a few seconds
          setTimeout(() => {
            callout.remove();
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  });
}

copyOnClick(passwordOne);
copyOnClick(passwordTwo);
