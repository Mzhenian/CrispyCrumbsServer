# Crispy Crumbs Website Overview

Welcome to the **Crispy Crumbs** website, an exclusive video-sharing platform that presents only the finest Crispy Crumbs content. The website is designed with a clean, organized layout that features a playful twist—all buttons resemble crispy, fried snacks, adding a fun touch to the overall formal and tidy design. Each icon on the site is custom-made, contributing to the unique user experience.


### Setup Guide Reference

The setup guide for building the website environment can be found in the previous section of the wiki or directly in the [Crispy Crumbs Website repository's README](https://github.com/Mzhenian/CrispyCrumbsWeb).


## 1. Homepage and Top Bar

Upon entering the website, users are greeted by the homepage, which displays videos sorted by "Most Watched," "Most Recent," "Random" (suggested), and "Suggested for You." The top navigation bar allows users to search for videos, log in, or sign up, and features a toggle for switching between light and dark mode.

There is also a search option that enables users to find videos based on their title, description, or tags.

1 - home page light
![alt text](<photos/web 1.png>)

2 - home page dark
![alt text](<photos/web 2.png>)

### 1.1 User Registration

When accessing the sign-up page from the homepage, users need to provide basic information such as username, password, full name, country, birth date, profile picture, and other optional details. Once the information is filled out correctly, users can click the **Sign Up** button to complete registration. If users already have an account, they can click the **Log In** button to proceed.

If any incorrect information is provided—such as an already existing username or email—an error message will appear, and the user will not be able to complete the registration.

3 - Sign up
![alt text](<photos/web 3.png>)

### 1.2 User Login

For users with an existing account, the **Log In** button on the homepage directs them to the login page. Here, users need to enter their username and password. There is also a "Remember Me" toggle, allowing longer session persistence.

If incorrect credentials are provided, an error message will be displayed. If the login is successful, users are redirected to the homepage, now as registered users.

4 - Login example with an error
![alt text](<photos/web 4.png>)

### 1.3 Homepage After Login

After logging in, the homepage changes slightly. The top bar replaces the **Sign Up** and **Log In** buttons with the user's profile picture. By clicking on the profile picture, a popup menu appears, offering options such as **View Profile**, **Edit Profile**, and **Log Out**. There is also an additional **Upload Video** button.

Additionally, users will now see a new section that displays videos uploaded by users they follow.

5 - Home page at subscribed view - with grid layout
![alt text](<photos/web 5.png>)

## 2. Viewing Profile Page

The profile page allows users to view their personal information and see all their uploaded videos. Every user has a profile page, and users can access their own profile or others' profiles by clicking on a profile image anywhere on the website.

If a user is viewing their own profile, they will have an **Edit** icon next to each video, allowing them to navigate to the video edit page directly.

Other users can subscribe to profiles by clicking the **Subscribe** button. In their own profile, users have an **Edit Profile** button instead.

6 - Current profile with editing user and edit icon
![alt text](<photos/web 6.png>)

7 - Different profile without the editing options on dark mode
![alt text](<photos/web 7.png>)

### 2.1 Editing Profile

On the **Edit Profile** page, users are presented with a form similar to the registration form, allowing them to update their details. All fields must be filled out with valid information. At the bottom of the page, users can apply changes or cancel them.

There is also an option to delete the account, which opens a popup window warning users that this action will remove all their videos and comments.

8 - Edit Profile
![alt text](<photos/web 8.png>)

## 3. Videos

### 3.1 Uploading Videos

Only logged-in users are allowed to upload videos. From the top navigation bar, users can click on the **Upload Video** button, which opens a popup window where they can either click to select a video or drag and drop one—whatever suits them best.

Once a video is selected, users can add video details such as title, description, tags, category, and thumbnail. After filling out the information, users can click **Upload Video** to complete the upload, or they can choose **Cancel** if they decide not to upload.

9 - Upload video click here to choose a video or drag the video
![alt text](<photos/web 9.png>)

10 - Upload video window - edit video details
![alt text](<photos/web 10.png>)

### 3.2 Video Watch Page

Each uploaded video has its own video page, which displays the video player along with basic information such as the title, description, uploader's name (with a subscribe button), similar videos (generated by the recommendation algorithm), views, and likes.

Users can like or dislike a video and leave comments, provided they are logged in. The user can also share the video on different platforms. If the video belongs to the user, there will be an **Edit Video** button in place of the **Subscribe** button.

Users can edit or delete their own comments by clicking on the pencil icon that appears next to their comments. Additionally, users can undo a like or dislike by clicking the button again.

11 - Video of the current user - edit video button, a comment written by the current user - the user can edit that comment by clicking on the icon, save the changes, discard the changes, or delete the comment.
![alt text](<photos/web 11.png>)

12 - Video of a different user with a subscribe button - dark mode
![alt text](<photos/web 12.png>)

13 - Share menu
![alt text](<photos/web 13.png>)

### 3.3 Editing Existing Videos

If a user wants to edit a video, they can modify all the details available during the upload process, such as the title, description, tags, category, and thumbnail. Users can either apply the changes or discard them.

There is also an option to delete the video, which can be accessed using the **Delete Video** button.

14 - Edit video page
![alt text](<photos/web 14.png>)
