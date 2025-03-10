# Use the official Node.js LTS image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /Alteroffice_Assignment/src

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Set environment variables (optional, for development mode)
ENV NODE_ENV=production

# Command to start the application
CMD ["npm", "run", "dev"]
