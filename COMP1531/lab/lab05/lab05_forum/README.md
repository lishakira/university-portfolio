# Lab05 - Forum

[TOC]

## Due Date

Week 7 Monday 5:00 pm AEST

## Background

### Rationale

Forums are online discussion boards where people can post questions, share their experiences and discuss ideas and topics with others who have similar interests.

A client has reached out to you with a problem - they want a platform where they can publicly *express* their thoughts and allow others to comment and critique them. In this lab, you are to build a backend server for a simple forum design.

### Getting Started
- Copy the SSH clone link from Gitlab and clone this repository on either VLAB or your local machine. 
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab.

### Express Installation

*[Express](https://expressjs.com/) is a fast, unopinionated minimalist web framework for Node.js*. To get started,

1. Open [package.json](package.json) and look at existing packages in `"dependencies"` and `"devDependencies"`. Install them with:
    ```shell
    $ npm install
    ```

1. Install [express](https://www.npmjs.com/package/express), along with the middlewares 
    - [cors](https://www.npmjs.com/package/cors) to allow access from other domains (needed for frontend to connect)
    - [morgan](https://www.npmjs.com/package/morgan) (OPTIONAL) to log (print to terminal) incoming HTTP requests. 
    ```shell
    $ npm install express cors morgan
    ```

1. Install the type definitions for the dependencies above as development dependencies:
    ```shell
    $ npm install --save-dev @types/express @types/cors @types/morgan
    ```

1. Finally, we will install 
    - [nodemon](https://www.npmjs.com/package/nodemon) (OPTIONAL)
        - to run our server in debug mode
        - automatically restart the server when changes are made to the code
    - [sync-request](https://www.npmjs.com/package/sync-request)
        - for testing purposes
        - we will use this to send HTTP requests to our server
    ```shell
    $ npm install --save-dev nodemon sync-request
    ```

1. Open your [package.json](package.json) and add the following scripts:
    ```json
    "scripts": {
        "test": "jest src",
        "ts-node": "ts-node",
        "tsc": "tsc --noEmit",
        "lint": "eslint src/**.ts"
        // Any other scripts you want here
    }
    ```

1. Tip: For convenience, you may also add `nodemon` in a `start` script to run [src/server.ts](src/server.ts):
    ```json
    "start": "nodemon src/server.ts"
    ```
    Similar to `test`, `start` is a special value in `npm`. Thus, either of the below will work:
    ```shell
    $ npm run start
    $ npm start
    ```

1. To check that you have completed the steps correctly, compare your [package.json](package.json) with our sample package.json in the [Additional Information](#additional-information) section.

1. (Optional) Update [.gitlab-ci.yml](.gitlab-ci.yml) with testing and linting.

### Interface: Routes

<table>
  <tr>
    <th>Name & Description</th>
    <th>HTTP Method</th>
    <th>Data Types</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
        <code>/</code><br /><br />
        This is an example route that we will implement for you.
        <br/><br/>
        Display a message when the root url of the server is accessed directly.
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{message}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>/echo/echo</code><br /><br />
        This is an example route that we will implement for you.
        <br/><br/>
        Echoes the given message back to the caller.
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{message}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{message}</code>
    </td>
    <td>
        Return <code>{error}</code>
        when the message passed in is exactly <code>echo</code>.
    </td>
  </tr>
  <tr>
    <td>
        <code>/post/create</code><br /><br />
        Add a new post to our forum.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{sender, title, content}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{postId}</code>
    </td>
    <td>
        Return <code>{error}</code> when any of:
        <ul>
            <li>sender is an empty string, <code>""</code></li>
            <li>title is an empty string, <code>""</code></li>
            <li>content is an empty string, <code>""</code></li>
        </ul>
    </td>
  </tr>
  <tr>
    <td>
        <code>/post/comment</code><br /><br />
        Add a new comment to a forum post.
    </td>
    <td>
        POST
    </td>
    <td>
        <b>Body Parameters</b><br/>
        <code>{postId, sender, comment}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{commentId}</code>
    </td>
    <td>
        Return <code>{error}</code> when any of:
        <ul>
            <li>postId does not refer to a valid post</li>
            <li>sender is an empty string, <code>""</code></li>
            <li>comment is an empty string, <code>""</code></li>
        </ul>
    </td>
  <tr>
    <td>
        <code>/post/view</code>
        Fetch all details about a single forum post.
        <br /><br />
        Comments in the post are sorted such that the most recent comment will
        appear at index 0. For example, if three comments are made in the order
        <code>c1</code>, <code>c2</code> and <code>c3</code>, the returned list
        will contain <code>[c3, c2, c1]</code>.
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{postId}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{post}</code>
    </td>
    <td>
        Return <code>{error}</code> when 
        postId does not refer to a valid post
    </td>
  <tr>
    <td>
        <code>/posts/view</code><br /><br />
        Fetch brief details about all forum posts.
        <br /><br />
        Posts are sorted such that the most recent post will
        appear at index 0. For example, if three posts are made in the order
        <code>p1</code>, <code>p2</code> and <code>p3</code>, the returned list
        will contain <code>[p3, p2, p1]</code>.
    </td>
    <td>
        GET
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{posts}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>/clear</code><br /><br />
        Clear all data and returns an empty object.
    </td>
    <td>
        DELETE
    </td>
    <td>
        <b>Query Parameters</b><br/>
        <code>{}</code>
        <br/><br/>
        <b>Return Object</b><br/>
        <code>{}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
</table>

#### Note:

For this lab, while you can continue to 
```javascript
return { error: 'error' }
```

we will also accept your custom error messages, e.g.
```javascript
return { 'error': 'Invalid postId' }
```

To account for the above, our auto-marking tests will be of the form:
```javascript
expect(someFunctionThatReturnsError()).toStrictEqual({ error: expect.any(String) });
```

This is so that you have the option to use different error messages which will be displayed on our [frontend](#frontend) if you wish to.


### Interface: Data Types
| Variable Name | Type |
| --- | --- |
| is exactly **error** | `string` |
| contains suffix **Id** | `number`, specifically integer |
| is exactly **message** | `string` |
| is exactly **sender** | `string` |
| is exactly **title** | `string` |
| is exactly **content** | `string` |
| is exactly **comment** | `string` |
| contains the prefix **time** | `number`, specifically an [**integer UNIX timestamp**](https://flaviocopes.com/how-to-get-timestamp-javascript/) in **seconds** (not milliseconds!). |
| is exactly **comments** | `Array` of objects, where each `object` contains the keys `{commentId, sender, comment, timeSent}` |
| is exactly **post** | `object` containing keys `{postId, sender, title, timeSent, content, comments}` |
| is exactly **posts** | `Array` of objects, where each `object` contains the keys `{postId, sender, title, timeSent}` |

## Task

### Testing

See [src/root.test.ts](src/root.test.ts) and [src/echo.test.ts](src/echo.test.ts) for examples of how you can write HTTP tests with [sync-request](https://www.npmjs.com/package/sync-request). **Make sure to remove the redundant tests and uncomment the correct ones**.

Reminder: Use `qs` for GET/DELETE requests and `json` for PUT/POST requests.

To test your code, you will need to use two different terminals:

<table>
    <tr>
        <th><b>Terminal 1 - Server</b></th>
        <th><b>Terminal 2 - Test</b></th>
    </tr>
    <tr>
        <td>
            <code>$ npm run ts-node src/server.ts</code>
        </td>
        <td>
            <code>$ npm test</code>
        </td>
    </tr>
</table>

For Terminal 1, you can also use the command below if you've added the optional start script which utilises [nodemon](https://www.npmjs.com/package/nodemon):
```shell
$ npm start
```

#### Tip

When testing UNIX timestamps, you should try to account for delays between requests. One approach could be:
```javascript
const expectedTimeSent = 1652454539;

const timeSent = ... // get value from a post or comment's timeSent
expect(timeSent).toBeGreaterThanOrEqual(expectedTimeSent);
// Allow for 1 second delay
expect(timeSent).toBeLessThan(expectedTimeSent + 1);
```
Writing tests for this could be time consuming, so you may not want to check the timestamp for every test.

#### Implementation

In this lab, we recommend keeping your routes in [src/server.ts](src/server.ts) as wrappers around other functions.
For example, for the route `/echo/echo`, the implementation is abstracted away into the `echo` function
which is imported from [src/echo.ts](src/echo.ts).

Also, a reminder that for GET requests, data is transferred through the query string, whereas for PUT/POST/DELETE, this is done through the JSON body.

### Frontend

A prototype frontend for the forum application is hosted at:
- https://comp1531frontend.Gitlab.io/forum

To use the frontend, simply paste your backend URL (e.g. http://127.0.0.1:49152) into the input box.

While additional error checking has been built into the frontend, it is not uncommon to encounter a blank/white screen. This is usually attributed to having an incorrect return type in one of the routes from your backend, most commonly from `GET` requests such as `post/view` or `posts/view`.

### Share your experience!

Share your thoughts [HERE](https://cgi.cse.unsw.edu.au/~cs1531/redirect_activity/?activity=lab05_forum) on any of the following:
1. How did you find this activity? What were the challenges?
1. What is something you learned from this activity?
1. What are some limitations of our current forum app? How can it be improved?
1. Without spoiling the lab, do you have any tips or resources that may help other students?

## Submission

- Use `git` to `add`, `commit`, and `push` your changes on your master branch.
- Check that your code has been uploaded to your Gitlab repository on this website (you may need to refresh the page).

**If you have pushed your latest changes to master on Gitlab no further action is required! At the due date and time, we automatically collect your work from what's on your master branch on Gitlab.**

## Additional Information

### Sample package.json

<details>

<summary>Click to view our sample package.json</summary><br/>

**Note**: 
1. The main keys to pay attention to are `"scripts"`, `"dependencies"` and `"devDependencies"`.
1. It is fine if the versions of your packages are newer.

```json
{
  "name": "lab05_forum",
  "version": "1.0.0",
  "description": "[TOC]",
  "main": "src/server.ts",
  "scripts": {
    "start": "nodemon src/server.ts",
    "test": "jest src",
    "ts-node": "ts-node",
    "tsc": "tsc --noEmit",
    "lint": "eslint src/**.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/cors": "^2.8.12",
    "@types/express": "^4.17.13",
    "@types/jest": "^27.5.1",
    "@types/morgan": "^1.9.3",
    "@typescript-eslint/eslint-plugin": "^5.23.0",
    "@typescript-eslint/parser": "^5.23.0",
    "eslint": "^8.15.0",
    "eslint-plugin-jest": "^26.2.1",
    "jest": "^28.1.0",
    "nodemon": "^2.0.16",
    "sync-request": "^6.1.0",
    "ts-jest": "^28.0.2",
    "ts-node": "^10.7.0",
    "typescript": "^4.6.4"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "morgan": "^1.10.0"
  }
}
```

</details>

### Miscellaneous

<details>

<summary>Other information that is not core to the course</summary><br/>

You may have noticed that [jest.config.js](jest.config.js) is slightly different from lab04_encanto - it has the added key `maxWorkers: 1`.

This is so that test files run one at a time (i.e. synchronously, as opposed to asynchronously), otherwise we will run into issues with sync-request.

Async is beyond the scope of COMP1531 :).

</details>