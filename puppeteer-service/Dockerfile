# Use Node.js base image
FROM node:18-slim

# Install Chrome
RUN apt-get update && apt-get install -y \
  wget gnupg \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/google.list \
  && apt-get update && apt-get install -y \
     google-chrome-stable \
     fonts-liberation \
     libasound2 \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port for Railway
ENV PORT=3000
EXPOSE 3000

# Start server
CMD ["node", "index.js"]
