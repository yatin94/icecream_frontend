FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the React development server port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]