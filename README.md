# Restaurants

Restaurants to the MAXX!, is a group project created by Darryl Dixon, Shariff Rudolph, and Kimberly McCaffrey (coworkers for MAXX Potential).  A common topic of workplace conversation is "Where should we eat?".  That question was the origin for our group project.  This project will gather restaurants that are local to the MAXX Potential - Norfolk, VA office.

As a result, coworkers will be able to access their dining options more easily. This will increase both efficiency and morale in the workplace.

---

## Prerequisites

Before you get started, you'll need to install NodeJS if you don't have it already. Go to [NodeJS.org](http://nodejs.org) to get the installer. The current project is being developed with v10.15.0. Earlier versions are not guaranteed to work.

I recommend using nvm to manage Node versions. You can get it [here](https://github.com/creationix/nvm). For Windows users they have [external links](https://github.com/creationix/nvm#important-notes) to similar projects as they do not officially support Windows:

---

### How to Build

Before you can build you'll need to install global build dependencies.
Use this command to install these dependencies globally: `npm run-script install-build-deps`

The repo comes with a file called `build.js`. Simply execute `node build.js` at the root of the project to start the build process. This can be kept running in the background as it will watch for most file changes. File extentions include `.ts`, `.scss`, and `.sass`.

### Local Development Setup

To make development changes you'll need to install dependencies. Go to the root of the directory then use this command: `npm install`

### How to Run

This repo currently has a distribution build ready to run

To run the server use this command at the root of the project: `node index.js`