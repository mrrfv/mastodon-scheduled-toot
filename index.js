// Load the node-schedule module to schedule jobs
import schedule from 'node-schedule'

// Load the dotenv module to access environment variables
import dotenv from 'dotenv';
dotenv.config();

// Load the node-fetch module to make HTTP requests
import fetch from 'node-fetch';

// Check if the required environment variables are present
const required_env_vars = [
  "CRON_SCHEDULE",
  "MASTODON_INSTANCE_URL",
  "MASTODON_USER_TOKEN",
  "MASTODON_STATUS_VISIBILITY",
]

for (const env_var of required_env_vars) {
  if (!process.env[env_var]) {
    console.error(`Missing environment variable: ${env_var} - the bot cannot continue.`);
    console.error(`Required environment variables: ${required_env_vars.join(', ')}`);
    console.error(`Refer to the documentation for more information.`)
    process.exit(1);
  }
}

// Test if either the MASTODON_STATUS_TEXT or MASTODON_STATUS_TEXTS_RANDOM environment variable is present
if (!process.env.MASTODON_STATUS_TEXT && !process.env.MASTODON_STATUS_TEXTS_RANDOM) {
  console.error(`Missing environment variable: MASTODON_STATUS_TEXT or MASTODON_STATUS_TEXTS_RANDOM - the bot cannot continue.`);
  console.error(`One must be defined.`);
  console.error(`Refer to the documentation for more information.`)
}

// Test if the MASTODON_STATUS_TEXTS_RANDOM environment variable is valid JSON
if (process.env.MASTODON_STATUS_TEXTS_RANDOM) {
  try {
    JSON.parse(process.env.MASTODON_STATUS_TEXTS_RANDOM);
  } catch (err) {
    console.error(`Invalid JSON in MASTODON_STATUS_TEXTS_RANDOM environment variable: ${err}`);
    process.exit(1);
  }
}

// Define a function that runs the main logic of the app
async function main() {
  let status;

  // Determine which status to post
  if (process.env.MASTODON_STATUS_TEXTS_RANDOM) {
    // User has specified a JSON array of statuses to choose from
    const statusTexts = JSON.parse(process.env.MASTODON_STATUS_TEXTS_RANDOM);
    // Choose a random status from the array
    status = statusTexts[Math.floor(Math.random() * statusTexts.length)];
  } else if (process.env.MASTODON_STATUS_TEXT) {
    // User has specified a single status
    status = process.env.MASTODON_STATUS_TEXT;
  } else {
    // This should never happen
    console.error(`No status text to post!`);
    process.exit(1);
  }

  // Define the status parameters
  const statusParams = {
    status, // The text content of the status
    visibility: process.env.MASTODON_STATUS_VISIBILITY, // The visibility of the status
    // Other parameters are optional, see https://docs.joinmastodon.org/methods/statuses/
  };

  // Define the API endpoint for posting a status
  const postStatusURL = `${process.env.MASTODON_INSTANCE_URL}/api/v1/statuses`;

  // Make a POST request with node-fetch
  fetch(postStatusURL, {
    method: 'POST', // Specify the HTTP method
    headers: {
      'Authorization': `Bearer ${process.env.MASTODON_USER_TOKEN}`, // Example: Bearer 1234567890abcdef
      'Content-Type': 'application/json', // Specify the content type
    },
    body: JSON.stringify(statusParams), // Convert the status parameters to JSON string
  })
  .then(res => res.json()) // Parse the response as JSON
  .then(data => {
    // Do something with the data, such as logging or displaying it
    console.log(`Toot posted! Check it out at ${data.url}`);
  })
  .catch(err => {
    console.error(err);
  });
}

console.log("Bot started! The toot will be posted according to the schedule.");
console.log(`Your current schedule: ${process.env.CRON_SCHEDULE}`);
// Set an interval to run the main function according to the schedule
schedule.scheduleJob(process.env.CRON_SCHEDULE, () => {
  main();
})
