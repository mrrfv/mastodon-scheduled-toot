# Mastodon Scheduled Post Bot

This is a Node.js application that uses the Mastodon API to post a toot at a specified time.

## Usage

1. Run `npm install` to install dependencies.
2. Go to your Mastodon instance preferences and click Development. Create a new application and copy the access token.
3. Copy `.env.example` to `.env` and fill in the values.
4. Run `node index.js`.

## Docker

You can also run this bot in a Docker container. To do so, follow step 2 from the usage guide and from use the following command:

```bash
docker run -d \
    -e TZ="Europe/Berlin" \
    -e CRON_SCHEDULE="0 17 * * *" \
    -e MASTODON_INSTANCE_URL="your mastodon instance url, for example https://mastodon.social" \
    -e MASTODON_USER_TOKEN="your mastodon access token" \
    -e MASTODON_STATUS_TEXT="your toot text" \
    # takes priority over MASTODON_STATUS_TEXT
    # -e MASTODON_STATUS_TEXTS_RANDOM="[\"your toot text 1\", \"your toot text 2\"]" \
    -e MASTODON_STATUS_VISIBILITY="unlisted" \
    --restart always \
    --name mastobot \
    mrrfv/mastodon-scheduled-toot:latest
```

Change the value of the `TZ` environment variable for scheduling to work properly.

## License

BSD 3-Clause License. See `LICENSE` for more information.

## Donations

If you would like to donate to support this project, you can do so via Liberapay - see my GitHub profile for the link.
