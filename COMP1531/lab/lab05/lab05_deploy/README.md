# Lab05 - Deploy

[TOC]

## Due Date

Week 7 Monday 5:00 pm AEST

## Note

1. It is possible to complete this lab without finishing `lab05_forum` - you can simply deploy the starter code, as the only routes we will assess are the root (`/`) and echo (`/echo/echo`).

1. Although it is not a requirement that you deploy to Alwaysdata in this lab, we recommend doing so as you will receive the most support from our staff this way.

## Background

### Rationale

Deploy deploy deploy 🚀!

While having our forum application working locally is fun and all, there's no point if you can't show it off to everyone else 😎!

In this lab, you will expose your backend server application to the outside world. You can use it to chat with your friends, host secret parties or plot a coup d'etat against COMP1531 staff - the possibilities are endless!

### Getting Started

- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine.
- In your terminal, change your directory (using the cd command) into the newly cloned lab.

### Package Installation

1. Open [package.json](package.json) and look at existing packages in "dependencies" and "devDependencies". Install them with:
    ```shell
    $ npm install
    ```
    
1. That's it :). This repository is only for submitting your `DEPLOYED_URL` and sanity-checking with the given tests and pipeline. Most of the work (i.e. the deployment process) **should be done in your `lab05_forum` repository**.

## Task

1. Open [src/deploy.ts](src/deploy.ts). **You will need to update the `DEPLOYED_URL` constant to contain your `zID`**.

1. Look through the deployment guide below. Watch the linked video and follow the instructions given to deploy your `lab05_forum` application.
    - https://gitlab.cse.unsw.edu.au/COMP1531/22T2/deployment

1. Open [src/deploy.test.ts](src/deploy.test.ts) and uncomment the given tests. Ensure that the tests pass locally.

1. Push your code and the uncommented tests to your master branch. Your Gitlab pipeline should also pass.

1. As an optional final check, try connecting the [frontend](https://comp1531frontend.gitlab.io/forum) to your deployed backend application.

### Tip
1. Before deploying to Alwaysdata, you may need to
    - move `ts-node` from `"devDependencies"` to `"dependencies"`.
    - update the `start` script to use `ts-node` on your server.
    - This should all be done in your `lab05_forum`'s `package.json` and repository.
1. Don't forget to update your port to use `process.env.PORT` if it exists.
1. Before seeking help, make sure to re-check all the debugging tips from our deployment guide and video guide.
1. When posting on our COMP1531 Ed forums for support, please include screenshots of:
    - The output when you `ssh` into Alwaysdata, `cd` into the correct directory and manually run the server with `npm start`
    - Your full Alwaysdata configuration
    - The output of any relevant log files
    - The error message when visiting your `DEPLOYED_URL`. Don't forget to restart your application on Alwaysdata and refresh the `DEPLOYED_URL` page.
1. You will need to create another Alwaysdata account if you are tasked with deploying your major group project (only one application per account). Fortunately, we don't need to sign up again:
    - At the bottom of the left sidebar under the CUSTOMER AREA section, select "Accounts". On the new page, click "Add Account" at the top-right corner.
    - You can switch between accounts using the dropdown at the top of the left sidebar.


## Submission

- Use `git` to `add`, `commit`, and `push` your changes on your master branch.
- Check that your code has been uploaded to your Gitlab repository on this website (you may need to refresh the page).

**If you have pushed your latest changes to master on Gitlab no further action is required! At the due date and time, we automatically collect your work from what's on your master branch on Gitlab.**
