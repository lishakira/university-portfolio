import { BACKEND_PORT } from './config.js';

// import * as constant from './main.js';

const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';
const METHOD_DELETE = 'DELETE';
const METHOD_GET = 'GET';

const SUB_AUTH = 'auth';
const SUB_CHANNEL = 'channel';
const SUB_USER = 'user';
const SUB_MESSAGE = 'message';

const HTTP_HOST = `http://localhost:${BACKEND_PORT}`;

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

// TO DO: FIX redundancy
export const showPage = (pageName) => {
    document.getElementById('page-dashboard').hidden = true;
    document.getElementById('page-login').hidden = true;
    document.getElementById('page-register').hidden = true;
    document.getElementById(`page-${pageName}`).hidden = false;
}

export const showHeader = (isAuthed) => {
    document.getElementById('navbar-not-authed').hidden = true;
    document.getElementById('navbar-authed').hidden = true;
    document.getElementById(`navbar-${isAuthed}`).hidden = false;
}

export const showChannels = (isAuthed) => {
    document.getElementById('channel-side-bar').hidden = isAuthed;
}

export const errorPopupAuth = (errorPopup, message) => {
    document.getElementById('error-message').textContent = message;
    errorPopup.show();
}

export const apiCallWithBody = (method, subdirectory, path, body, token, authed=true) => {
    return new Promise((resolve, reject) => {
        fetch(`${HTTP_HOST}/${subdirectory}/${path}`, {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Authorization': authed ? `Bearer ${token}` : undefined
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .then((data) => {
            (data.error) ? reject(data.error) : resolve(data);
        });
    })
}

export const apiCallWithoutBody = (method, subdirectory, path, token, authed=true) => {
    return new Promise((resolve, reject) => {
        fetch(`${HTTP_HOST}/${subdirectory}/${path}`, {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Authorization': authed ? `Bearer ${token}` : undefined
            },
        })
        .then((res) => res.json())
        .then((data) => {
            (data.error) ? reject(data.error) : resolve(data);
        });
    })
};

// Channel Helper Functions
export const createNewChannelHtml = (channel, channelType) => {
    const newChannel = document.createElement('button');
    newChannel.textContent = channel.name;
    newChannel.type = 'button';
    newChannel.setAttribute('class', 'list-group-item list-group-item-action');
    newChannel.setAttribute('name', 'channel-page');
    newChannel.setAttribute('channel-id', channel.id);
    document.getElementById(`channel-list-${channelType}`).appendChild(newChannel);
}

// Message Helper Functions
// For Displaying Messages
export const createNewMessage = (message, messageType, globalToken, hasFooter=true) => {
    const newMessage = document.createElement('div');
    newMessage.id = `${messageType}-message-${message.id}`;
    // Reference: https://getbootstrap.com/docs/5.3/components/list-group/#custom-content
    newMessage.setAttribute('class', 'list-group-item list-group-item-action');
    document.getElementById(`${messageType}-messages`).appendChild(newMessage);

    createNewMessageHeader(message, messageType, newMessage.id, globalToken);
    createNewMessageContent(message,messageType,  newMessage.id);
    if (hasFooter) createNewMessageFooter(message, messageType, newMessage.id);
}

const createNewMessageHeader = (message, messageType, messageId, globalToken) => {
    const header = document.createElement('div');
    header.id = `${messageType}-message-header-${message.id}`;
    header.setAttribute('class', 'd-flex w-100 justify-content-between');
    document.getElementById(messageId).appendChild(header);

    createNewMessageHeaderContent(message, globalToken, header.id);
}

const createNewMessageHeaderContent = (message, globalToken, headerId) => {
    createNewSenderLinkHtml(message, globalToken, headerId);
    createNewSentDateHtml(message, headerId);
}

const createNewSenderLinkHtml = (message, globalToken, headerId) => {
    const sender = document.createElement('a');
    sender.href = '#';
    sender.setAttribute('name', 'user-profile');
    sender.setAttribute('class', 'mb-1');
    sender.setAttribute('user-id', message.sender);
    sender.setAttribute('data-bs-toggle', 'modal');
    sender.setAttribute('data-bs-target', '#user-profile-details');

    apiCallWithoutBody(METHOD_GET, SUB_USER, message.sender, globalToken)
    .then((data) => {
        sender.textContent = data.name;
    })

    document.getElementById(headerId).appendChild(sender);
}

const createNewSentDateHtml = (message, headerId) => {
    const sentDate = document.createElement('small');
    const date = (message.sentAt).split('T')[0];
    sentDate.textContent = `Sent: ${date}`;
    document.getElementById(headerId).appendChild(sentDate);
}

const createNewMessageContent = (message, messageType, messageId) => {
    const messageContent = document.createElement('p');
    messageContent.id = `${messageType}-message-content-${message.id}`;
    messageContent.setAttribute('class', 'mb-1 text-wrap text-break');
    messageContent.textContent = message.message;
    document.getElementById(messageId).appendChild(messageContent);
}

const createNewMessageFooter = (message, messageType, messageId) => {
    if (message.editedAt !== null) createNewLastEditedHtml(message, messageId);
    createNewMessageOptionsContainer(message, messageType, messageId);
}

const createNewLastEditedHtml = (message, messageId) => {
    const editedDate = document.createElement('small');
    const date = (message.editedAt).split('T')[0];
    editedDate.textContent = `Last Edited: ${date}`;
    document.getElementById(messageId).appendChild(editedDate);
}

const createNewMessageOptionsContainer = (message, messageType, messageId) => {
    const userId = parseInt(localStorage.getItem('userId'));
    const footer = document.createElement('div');
    footer.id = `${messageType}-message-footer-${message.id}`;
    footer.setAttribute('class', 'd-flex');
    document.getElementById(messageId).appendChild(footer);

    if (message.sender === userId) userIsSenderDisplay(message, footer.id);
    createPinLinkHtml(message, footer.id)
    createOptionsSeparatorHtml(footer.id);
    createReactButton(message, messageType, footer.id, 'heart');
    createReactButton(message, messageType, footer.id, 'crying');
    createReactButton(message, messageType, footer.id, 'clown');
    createReactButton(message, messageType, footer.id, 'angry');
}

const createEditLinkHtml = (message, footerId) => {
    const editLink = document.createElement('a');
    editLink.href = '#';
    editLink.setAttribute('name', 'message-edit');
    editLink.setAttribute('class', 'text-body-secondary');
    editLink.setAttribute('message-id', message.id);
    editLink.setAttribute('data-bs-toggle', 'modal');
    editLink.setAttribute('data-bs-target', '#message-edit');
    editLink.textContent = 'Edit'
    document.getElementById(footerId).appendChild(editLink);
}

const createDeleteLinkHtml = (message, footerId) => {
    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    deleteLink.setAttribute('name', 'message-delete');
    deleteLink.setAttribute('class', 'text-body-secondary');
    deleteLink.setAttribute('message-id', message.id);
    deleteLink.textContent = 'Delete'
    document.getElementById(footerId).appendChild(deleteLink);
}

const createPinLinkHtml = (message, footerId) => {
    const pinMessage = document.createElement('a');
    pinMessage.href = '#';
    pinMessage.setAttribute('name', 'message-pin');
    pinMessage.setAttribute('class', 'text-body-secondary');
    pinMessage.setAttribute('message-id', message.id);
    pinMessage.textContent = (message.pinned) ? 'Unpin' : 'Pin';
    document.getElementById(footerId).appendChild(pinMessage);
}

const createReactButton = (message, messageType, footerId, reactType) => {
    const numReacts = generateNumReacts(message, reactType);
    const react = document.getElementById(`message-react-${reactType}`).cloneNode(true);
    react.id = `${messageType}-message-react-${reactType}-${message.id}`;
    react.setAttribute('message-id', message.id);
    react.hidden = false;
    if (isReactedByUser(message, reactType)) reactedByUserDisplay(react);
    if (numReacts !== 0) numReactsDisplay(react, numReacts);
    document.getElementById(footerId).appendChild(react);
}

const isReactedByUser = (message, reactType) => {
    const userId = parseInt(localStorage.getItem('userId'));
    const reactedMessages = message.reacts.filter(react => react.user === userId && react.react === reactType);
    return (reactedMessages.length !== 0) ? true : false;
}

const reactedByUserDisplay = (react) => {
    react.setAttribute('class', 'btn btn-outline-primary react-button active');
}

const generateNumReacts = (message, reactType) => {
    return message.reacts.filter(react => react.react === reactType).length;
}

const numReactsDisplay = (react, numReacts) => {
    const numReactsContainer = react.childNodes[1];
    numReactsContainer.textContent = numReacts;
}

const userIsSenderDisplay = (message, footerId) => {
    createEditLinkHtml(message, footerId);
    createOptionsSeparatorHtml(footerId);
    createDeleteLinkHtml(message, footerId);
    createOptionsSeparatorHtml(footerId);
}

const createOptionsSeparatorHtml = (footerId) => {
    const separationDot = document.createElement('img');
    separationDot.src = 'assets/dot.svg';
    separationDot.alt = 'separation-dot-icon';
    document.getElementById(footerId).appendChild(separationDot);
}