FROM node:21.7.1

# Set environment variables
ENV DB_URL=mongo:27017
ENV DB_USER=my-user
ENV DB_PASS=my-password
ENV DB_NAME=trt-backend-assigment

# Create and set the working directory
WORKDIR /application

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install global dependencies
RUN npm install -g npm@10.8.2

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 8080

# Command to run your application
CMD ["node", "src/app.js"]
