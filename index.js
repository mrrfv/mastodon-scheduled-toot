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
  "MASTODON_STATUS_TEXT",
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


// Define a function that runs the main logic of the app
async function main() {
  // Define the status parameters
  const statusParams = {
    status: process.env.MASTODON_STATUS_TEXT, // The text content of the status
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
