### [Link to Design Document for Lab 1](designlab1.md)

### [Link to Design Document for Lab 2](designlab2.md)

### [Link to Design Document for Lab 3](designlab3.md)

### [Link to Design Document for Lab 4](designlab4.md)

# New Changes to our Design

Let's start on our new login screen!

<img src="lab5Welcome.png" width="1138" height="649" alt="">

This is where a new user starts off with our application. You get an example screenshot for what our notes app looks 
like once you're signed in, and a choice between signing in and signing up.

<img src="lab5SignUp.png" width="1138" height="649" alt="">

New users should click the 'Sign Up' button, where they will be able to enter an email and password to register an 
account. They'll also be able to jump straight in to the application with a Google login. Our application senses when a 
provided email is invalid, and will kick that error back to the user.

<img src="lab5SignIn.png" width="1138" height="649" alt="">

When you press the 'Sign In' button, the user is able to log into the app using their email/password credentials. Our 
app will show errors if the user has inputted an invalid email or an incorrect password. You can also use Google sign-in 
if you prefer.

<img src="lab5HomeScreen.png" width="1138" height="649" alt="">

Now that we've logged in, the app showcases the current user as well as a 'Log out' option in the top right of the 
screen. Logging out sends you right back the welcome screen we visited before.

<img src="lab5ShareOption.png" width="1138" height="649" alt="">

There are now new options on each note! To access them, tap the circle button in the bottom left of each note. If you 
are the original creator of a note, you'll be able to hit the 'Share' button to adjust permissions for other users to 
access it.  

<img src="lab5OwnerShareMenu.png" width="1138" height="649" alt="">

Hitting this button as an owner allows you to input the emails of users you want to share with, as well as their desired 
permission level (editor or viewer). You are only allowed to input the emails for registered users for the app, it will 
kick out an error if you provide something else. Editors are given full permissions for the note, except that they 
cannot share it with other people. In contrast, viewers can only access what's inside the note and sort it (no 
adding/hiding of data or adjusting priority levels) and are not able to rename or delete a note either.

<img src="lab5ViewerShareOption.png" width="1138" height="649" alt="">

If you're an editor or viewer, hitting 'Shared with' (what you get instead of the 'Share' tab) produces a static list of 
the current permissions for that note.

<img src="lab5ViewerShareMenu.png" width="1138" height="649" alt="">

If you are a shared editor or viewer for a note, you will not be able to adjust sharing permissions but can still see 
who else is shared on the note through the 'Shared with' option.

<img src="lab5ViewerList.png" width="1138" height="649" alt="">

Inside of each note, viewers will not be able to click on anything except for the back button and sorting. We also have 
security rules that prevent such users from changing or updating the data here.


One final thing to note is that notes you can view are colored differently compared to those you own and have editing 
privileges on. We wanted to give a subtle distinction between these types at the top-level, as they differ pretty 
substantially with what you can do.

# Design Decisions

We decided to let both the owner and shared editors of a document delete the list. This is because
editors have full permissions to change what's inside the list, and deleting all the lines of data inside the note
is functionally equivalent to deleting the note itself, so might as well give them that permission. If we had some sort
of revision history where the owner could revert to an older version of the note to correct malicious edits, then we 
would only let the owner delete the note outright.

# Alternative Designs

We originally had the sign in and sign up pages on top of each other on our log in page. But we thought that this was 
confusing for transitioning between signing up and signing up, so we implemented the current method where the main Sign 
In and Sign Up buttons stay fixed while the content shifts below. 

# User Testing

We did not do any user testing.

# Challenges

It was difficult figuring out a system to store and access a list of all registered user emails while keeping our 
security as tight as possible. We also struggled with figuring out the security rules at first, but we eventually got 
the hang of them.

# What We're Most Proud Of

We're proud of getting some more complex features in with our sharing method, such as bad username/password error 
checks and only supporting sharing for registered emails.