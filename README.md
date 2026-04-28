# Learning App - Backend

Backend service for the English learning platform. Handles authentication, user data, lessons, and system logic.

## Tech Stack

* Node.js
* Express
* MongoDB

## Installation

git clone https://github.com/SyHHoang/BackendLearningApp.git
cd BackendLearningApp
npm install

## Environment Variables

Create a `.env` file in the root folder:

```env
PORT=your_port
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
```

## Run

npm run dev

## Notes

This backend provides APIs for authentication, learning content, and media handling. It integrates with external services like ImageKit and Cloudinary for image storage.
