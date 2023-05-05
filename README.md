# Spotigen

# Introduction
This is a Full-Stack project I made called Spotigen. I used React for the frontend, NodeJs (Express) for the backend, and MongoDB for the database. The idea behind Spotigen is that a user has a selection of five genres of music, those being Hip-Hop, Classical, Rock, Jazz, and Pop. Of these five genres, the user can select three and hit the "Generate Playlist" button, and just like that, Spotigen displays a link to your newly created playlist of 30 random songs of the genres you chose ready for listening in your Spotify account!

# Setup
After forking and cloning this repository onto your machine comes the setup. Due to Spotify taking authentication very serious not everyone can log in freely to the application. There are a couple of steps to complete but they do not take long at all.

## Creating a Spotify Developer Account
The main thing that is needed for the authentication flow to work is a client Id and client secret. These are unique to each user and to obtain these two strings you must create a Spotify developer account at this link: https://developer.spotify.com/

## Creating your app
Now that your account is created, you will now need to head ot the Dashboard where you will create an app. You will be presented with a form where you can fill it out exactly like this: ![image](https://user-images.githubusercontent.com/103136187/236570108-4849797e-4069-4932-abf9-6ff9e420994a.png)

### Getting your Client Id and Client Secret
Finally, to get your Client ID and Client Secret, head to the Settings tab of your app and both of them will be there for you to copy.

# Starting Spotigen

Now that you have your Client ID and Client Secret in hand, you can head over to your text editor and insert your credentials into the .env file in the root of the project. Now we are ready to start the application

## The Backend

1. Open a split terminal
2. Type cd backend
3. Type yarn install
4. Type npm run devStart to start the backend environment

## The Frontend
1. On the other terminal
2. Type cd client
3. Type yarn install
4. Type yarn start to start the frontend environment


# That is it for the setup, enjoy Spotigen!






