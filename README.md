# Crispy Crumbs - NodeJS Server with MongoDB

Welcome to the **Crispy Crumbs** server setup guide. This server is built using NodeJS and MongoDB to provide a robust backend for the Crispy Crumbs video sharing platform. Follow these steps to get the server up and running.

### Crispy Crumbs - Founders
- Ofek Avan Danan (211824727)
- Zohar Mzhen (314621806)
- Dolev Menajem (207272220)

## Running the Crispy Crumbs Server

### Initial Setup

1. **Clone the Repository**

   Clone this project to your local machine:

   ```bash
   git clone https://github.com/Mzhenian/CrispyCrumbsServer.git
   cd CrispyCrumbsServer
   ```

2. **Set Up JWT Secret**

   Choose a JWT secret key and update it in the `config.js` file:

   ```javascript
   // config/config.js
   module.exports = {
       jwtSecret: 'your-jwt-secret-here', // Replace this with your actual secret key
       // other configurations...
   };
   ```

3. **Initialize MongoDB**

-place holder-

4. **Install Dependencies**

   Run the following command to install all necessary dependencies:

   ```bash
   npm install
   ```

5. **Start the Server**

   Start the server using:

   ```bash
   npm start
   ```

   The server should now be running at `http://localhost:5000`.

## Server Configuration

### Express Setup

The server uses Express for handling routes and middleware. Multer is used for handling file uploads.

### Routes

#### User Routes

- **Get User Details**
  - `GET /:id`
  - Function: `getUserDetails`
  - Description: Retrieves detailed information about a user.

- **Get Basic User Details**
  - `GET /basic/:id`
  - Function: `getUserBasicDetails`
  - Description: Retrieves basic information about a user.

- **Update User**
  - `PUT /:id`
  - Function: `updateUser`
  - Description: Updates user details. Requires authentication and user verification.

- **Delete User**
  - `DELETE /:id`
  - Function: `deleteUser`
  - Description: Deletes a user. Requires authentication and user verification.

- **Get User Videos**
  - `GET /:id/videos/`
  - Function: `getUserVideos`
  - Description: Retrieves videos uploaded by a user.

- **Upload Video**
  - `POST /:id/videos`
  - Function: `createUserVideo`
  - Description: Uploads a new video. Requires authentication and user verification.

- **Edit Video**
  - `PUT /:id/videos/:videoId`
  - Function: `editVideo`
  - Description: Edits an existing video. Requires authentication and user verification.

- **Delete Video**
  - `DELETE /:id/videos/:videoId`
  - Function: `deleteVideo`
  - Description: Deletes a video. Requires authentication and user verification.

- **Authentication and Validation**
  - `POST /validateToken`
  - Function: `validateToken`
  - Description: Validates the JWT token.

  - `POST /tokens`
  - Function: `login`
  - Description: Logs in a user and provides a JWT token.

  - `POST /`
  - Function: `signup`
  - Description: Signs up a new user.

- **Follow/Unfollow User**
  - `POST /follow`
  - Function: `followUnfollowUser`
  - Description: Follows or unfollows a user. Requires authentication and user verification.

- **Check Username/Email Availability**
  - `POST /isUsernameAvailable`
  - Function: `isUsernameAvailable`
  - Description: Checks if a username is available.

  - `POST /isEmailAvailable`
  - Function: `isEmailAvailable`
  - Description: Checks if an email is available.

#### Video Routes

- **Get All Videos**
  - `GET /`
  - Function: `getAllVideos`
  - Description: Retrieves all videos.

- **Get Following Videos**
  - `GET /followers`
  - Function: `getFollowingVideos`
  - Description: Retrieves videos from followed users. Requires authentication.

- **Get Video by ID**
  - `GET /:id`
  - Function: `getVideoById`
  - Description: Retrieves a video by its ID.

- **Like/Dislike Video**
  - `POST /like`
  - Function: `likeVideo`
  - Description: Likes a video. Requires authentication and user verification.

  - `POST /dislike`
  - Function: `dislikeVideo`
  - Description: Dislikes a video. Requires authentication and user verification.

- **Increment Views**
  - `POST /incrementViews`
  - Function: `incrementViews`
  - Description: Increments the view count of a video.

- **Add/Edit/Delete Comment**
  - `POST /comment`
  - Function: `addComment`
  - Description: Adds a comment to a video. Requires authentication and user verification.

  - `PUT /comment`
  - Function: `editComment`
  - Description: Edits a comment. Requires authentication and user verification.

  - `DELETE /comment`
  - Function: `deleteComment`
  - Description: Deletes a comment. Requires authentication and user verification.

- **Delete Video**
  - `DELETE /:id`
  - Function: `deleteVideo`
  - Description: Deletes a video. Requires authentication.

### File Uploads

Multer is used to handle file uploads, including profile photos, videos, and thumbnails. The file storage is configured to store files in the DB folder based on their type.

---

