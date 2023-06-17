const request = require('request');
const readline = require('readline');
const fs = require('fs');

const url = process.argv[2];
const filePath = process.argv[3];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(url, (error, response, body) => {
  console.log("Connecting to server...");

  // catches invalid URLs
  if (error) {
    if (error.errno === 'ENOTFOUND') {
      console.log("\nURL is inavlid, please enter a different URL");
      process.exit();
    } else {
      console.error('error: ', error);
    }
  }

  // function that creates and writes to a file, then console logs the file size
  const writeFile = () => {
    fs.writeFile(filePath, body, err => {
      if (err) {
        console.error(err);
      }

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
        process.exit();
      });
    });
  };

  // checks if target file already exits
  try {
    //  Overwrites current file if approved
    if (fs.existsSync(filePath)) {
      rl.question(`Would you like to overwrite current ${filePath}? Enter "Y" or "ctrl+z" to exit.\n`, (answer) => {
        if (answer !== "Y") {
          process.exit();
        }
        writeFile();
      });
    } else {
      // creates and writes to filePath if it doesn't already exist
      writeFile();
    }
  } catch (err) { // error if invalid file path
    console.error("Invalid file path:", err.message);
    process.exit();
  }
});
