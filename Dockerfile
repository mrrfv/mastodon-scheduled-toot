# Use the official Node.js image as a base
FROM node:lts-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the app code to /app
COPY . .

# Start the app using node
CMD ["node", "index.js"]
