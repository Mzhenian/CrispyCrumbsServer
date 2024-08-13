# Crispy Crumbs: NodeJS server with MongoDB database

Welcome to the **Crispy Crumbs** backend. This server is built using NodeJS and MongoDB to provide a robust backend for the Crispy Crumbs video sharing platform.

## Crispy Crumbs - Founders

- Ofek Avan Danan (211824727)
- Zohar Mzhen (314621806)
- Dolev Menajem (207272220)

## Running the Crispy Crumbs Server

### Prerequisites

- The server is build and tested to run from a windows machine.
- Node.js
- MongoDB
  - By default CrispyCrumbs will use "CrispyCrumbs" database in "mongodb://localhost:27017/CrispyCrumbs" connection.

### Download

- Second download [CrispyCrumbsServer](https://github.com/Mzhenian/CrispyCrumbsServer) as [zip](https://github.com/Mzhenian/CrispyCrumbsServer/archive/refs/heads/main.zip) and unzip it
- **or** [clone](https://github.com/Mzhenian/CrispyCrumbsServer.git) the repository and checkout the EX2-complete branch.

### Initialization option one: Easy & fast script

**Note:** If you're interested in using the website than you can run only the CrispyCrumbs website initialization script (which will call the server initialization script).

1) open a powershell in `CrispyCrumbsServer` project-folder.
2) run: `.\init_server.ps1`
3) Enter the new CrispyCrumbs server JWT secret if prompted.

### Initialization option two: manually

**JWT secret**
1. Open `CrispyCrumbsServer\config\config.js` file and choose a new JWT secret key:

   ```javascript
   // config/config.js
   module.exports = {
       jwtSecret: 'your-jwt-secret-here', // Replace this with your actual secret key
       // other configurations...
   };
   ```

**MongoDB**
2. Open mongoDB compass.
3.  connect to the URI `mongodb://localhost:27017/CrispyCrumbs`
4. Open / create database named `CrispyCrumbs`
5. Open / create two collections: `users` and `videos`
Now it should look like this:
![[.\demonstration\mongodb-collections.png]]
6. Insure `users` and `videos` are empty
![[.\demonstration\mongodb-empty.png]]
7. In `users` select `ADD DATA > iMPORT json OR csv FILE`
![[.\demonstration\mongodb-add.png]]
8. Choose `CrispyCrumbsServer\FilesForMongoDB\CrispyCrumbs.users.json`
9. In `videos` select `ADD DATA > iMPORT json OR csv FILE` and choose `CrispyCrumbsServer\FilesForMongoDB\CrispyCrumbs.videos.json`

**The server**
10. Open a terminal in `CrispyCrumbsServer` project-folder
11. Run `npm install`
12. Run `node server.js`
Now the server should be running!
![[.\demonstration\server-running.png]]

## Public routes structure

### User Routes

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

### Video Routes

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

