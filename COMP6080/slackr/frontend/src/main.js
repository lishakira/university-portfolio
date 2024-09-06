import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import {
    fileToDataUrl,
    showHeader,
    showPage,
    showChannels,
    errorPopupAuth,
    apiCallWithBody,
    apiCallWithoutBody,
    createNewChannelHtml,
    createNewMessage,
} from './helpers.js';

import * as constant from './constants.js';

const IS_AUTHED = false;
const IS_NOT_AUTHED = true;
const LOGGED_IN = 'authed';
const LOGGED_OUT = 'not-authed';
const PRIVATE_CHANNEL = 'private';
const PUBLIC_CHANNEL = 'public';

const REDIRECT_PATH_NAME = 'redirect-to';
const UNMATCHED_PASSWORD_ERROR_MESSAGE = 'Passwords do not match';

const errorPopup = new bootstrap.Modal(document.getElementById('popup-error'));

let globalToken = null;
let isAuthenticated = false;
let channelId = -1;
let messageId = -1;
let numMessages = 0;

showPage(constant.PATH_LOGIN);
(!isAuthenticated) ? showHeader(LOGGED_OUT) : showHeader(LOGGED_IN);
(!isAuthenticated) ? showChannels(IS_NOT_AUTHED) : showChannels(IS_AUTHED);

///////////////////////
// AUTH Subdirectory //
///////////////////////
document.getElementById('register-submit').addEventListener('click', () => {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        errorPopupAuth(errorPopup, UNMATCHED_PASSWORD_ERROR_MESSAGE);
    } else {
        apiCallWithBody(constant.METHOD_POST, constant.SUB_AUTH, constant.PATH_REGISTER, {
            email: email,
            name: name,
            password: password
        }, IS_NOT_AUTHED)
        .then((data) => {
            globalToken = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            isAuthenticated = true;
            showPage(constant.PATH_DASHBOARD);
            showHeader(LOGGED_IN);
            showChannels(IS_AUTHED);
            listChannels();
        })
        .catch((message) => {
            errorPopupAuth(errorPopup, message);
        });
    }
})

document.getElementById('login-submit').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    apiCallWithBody(constant.METHOD_POST, constant.SUB_AUTH, constant.PATH_LOGIN, {
        email: email,
        password: password
    }, IS_NOT_AUTHED)
    .then((data) => {
        globalToken = data.token;
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem("scrollPosition", 0);
        isAuthenticated = true;
        showPage(constant.PATH_DASHBOARD);
        showHeader(LOGGED_IN);
        showChannels(IS_AUTHED);
        listChannels();
    })
    .catch((message) => {
        errorPopupAuth(errorPopup, message);
    });
})

document.getElementById('logout-submit').addEventListener('click', () => {
    apiCallWithBody(constant.METHOD_POST, constant.SUB_AUTH, constant.PATH_LOGOUT, {}, globalToken)
    .then(() => {
        globalToken = null;
        localStorage.clear();
        isAuthenticated = false;
        channelId = -1;
        showPage(constant.PATH_LOGIN);
        showHeader(LOGGED_OUT);
        showChannels(IS_NOT_AUTHED);
        document.getElementById('channel-pages').hidden = true;
        document.getElementById('channel-member-options').hidden = true;
        document.getElementById('channel-non-member-options').hidden = true;
        document.getElementById('pinned-messages-button').hidden = true;
        document.getElementById('channel-name').textContent = 'No channel selected.';
    })
    .catch((message) => {
        errorPopupAuth(errorPopup, message);
    });
})

//////////////////////////
// CHANNEL Subdirectory //
//////////////////////////
const listChannels = () => {
    document.querySelectorAll('form').forEach(formInput => formInput.reset());
    document.getElementById('channel-list-public').innerHTML = '';
    document.getElementById('channel-list-private').innerHTML = '';
    document.getElementById('channel-pages').hidden = false;
    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_CHANNEL, constant.PATH_EMPTY, globalToken)
    .then((data) => {
        displayChannels(data.channels);
    })
}

const displayChannels = (channelList) => {
    const userId = localStorage.getItem('userId');
    const privateChannelList = channelList.filter(channel => (channel.private && (channel.members).includes(parseInt(userId))));
    const publicChannelList = channelList.filter(channel => !channel.private);
    privateChannelList.forEach(channel => {
        createNewChannelHtml(channel, PRIVATE_CHANNEL);
    })

    publicChannelList.forEach(channel => {
        createNewChannelHtml(channel, PUBLIC_CHANNEL);
    });

    getChannelDetails();
}

const getChannelDetails = () => {
    document.getElementsByName('channel-page').forEach(page => {
        page.addEventListener('click', () => {
            document.getElementById('channel-pages').hidden = false;
            document.getElementById('channel-details').hidden = true;
            document.getElementById('pinned-messages-button').hidden = false;
            channelId = page.getAttribute('channel-id');
            getChannelFromId(channelId, page);
        })
    })
}

const getChannelFromId = (channelId, page) => {
    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_CHANNEL, channelId, globalToken)
    .then((data) => {
        displayChannelDetails(data);
    })
    .catch(() => {
        document.getElementById('channel-name').textContent = page.textContent;
        document.getElementById('channel-non-member-options').hidden = false;
        document.getElementById('channel-member-options').hidden = true;
    })
}

const displayChannelDetails = (channelDetail) => {
    const userId = localStorage.getItem('userId');
    if ((channelDetail.members).includes(parseInt(userId))) {
        document.getElementById('channel-non-member-options').hidden = true;
        document.getElementById('channel-member-options').hidden = false;
        document.getElementById('channel-name').textContent = channelDetail.name;
        getMessage(channelId);
    }
}

const generateCreationInfo = (channel) => {
    const dateCreated = (channel.createdAt).split('T')[0];

    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_USER, channel.creator, globalToken)
    .then((data) => {
        document.getElementById('channel-edit-created-info').textContent = `Created by ${data.name} on ${dateCreated}.`
    })
}

document.getElementById('channel-create-submit').addEventListener('click', () => {
    const name = document.getElementById('channel-create-name').value;
    const description = document.getElementById('channel-create-description').value;
    const isPrivate = document.getElementById('channel-create-private').checked;

    apiCallWithBody(constant.METHOD_POST, constant.SUB_CHANNEL, constant.PATH_EMPTY, {
        name: name,
        private: isPrivate,
        description: description
    }, globalToken)
    .then((data) => {
        listChannels();
    })
})

document.getElementById('channel-edit-button').addEventListener('click', () => {
    document.getElementById('channel-pages').hidden = true;
    document.getElementById('channel-details').hidden = false;

    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_CHANNEL, channelId, globalToken)
    .then((data) => {
        generateCreationInfo(data);
        document.getElementById('channel-edit-name').value = data.name;
        document.getElementById('channel-edit-description').value = data.description;
        document.getElementById('channel-edit-private').checked = data.private;
    })
})

document.getElementById('channel-save-changes').addEventListener('click', () => {
    document.getElementById('channel-pages').hidden = false;
    document.getElementById('channel-details').hidden = true;

    const name = document.getElementById('channel-edit-name').value;
    const description = document.getElementById('channel-edit-description').value;

    apiCallWithBody(constant.METHOD_PUT, constant.SUB_CHANNEL, channelId, {
        name: name,
        description: description
    }, globalToken)
    .then(() => {
        listChannels();
        document.getElementById('channel-name').textContent = name;
    })
})

document.getElementById('channel-edit-cancel').addEventListener('click', () => {
    document.getElementById('channel-pages').hidden = false;
    document.getElementById('channel-details').hidden = true;
})

document.getElementById('channel-join-button').addEventListener('click', () => {
    apiCallWithBody(constant.METHOD_POST, constant.SUB_CHANNEL, `${channelId}/${constant.PATH_JOIN}`, {}, globalToken)
    .then(() => {
        document.getElementById('channel-non-member-options').hidden = true;
        document.getElementById('channel-member-options').hidden = false;
        setScrollPosition();
        getMessage(channelId);
    })
})

document.getElementById('channel-leave-button').addEventListener('click', () => {
    apiCallWithBody(constant.METHOD_POST, constant.SUB_CHANNEL, `${channelId}/${constant.PATH_LEAVE}`, {}, globalToken)
    .then(() => {
        document.getElementById('channel-non-member-options').hidden = true;
        document.getElementById('channel-member-options').hidden = true;
        document.getElementById('pinned-messages-button').hidden = true;
        document.getElementById('channel-name').textContent = 'No channel selected.';
        listChannels();
    })
})

//////////////////////////
// MESSAGE Subdirectory //
//////////////////////////
document.getElementById('message-send').addEventListener('keypress', (e) => {
    const message = document.getElementById('message-send').value;

    if (e.key === 'Enter' && message.trim() !== '') {
        apiCallWithBody(constant.METHOD_POST, constant.SUB_MESSAGE, channelId, {
            message: message,
            image: ''
        }, globalToken)
        .then((data) => {
            document.getElementById('message-send').value = '';
            setScrollPosition();
            getMessage(channelId);
        })
    }
})

document.getElementById('message-send-submit').addEventListener('click', (e) => {
    const message = document.getElementById('message-send').value;

    if (message.trim() !== '') {
        apiCallWithBody(constant.METHOD_POST, constant.SUB_MESSAGE, channelId, {
            message: message,
            image: ''
        }, globalToken)
        .then((data) => {
            document.getElementById('message-send').value = '';
            setScrollPosition();
            getMessage(channelId);
        })
    }
})

const getMessage = (channelId) => {
    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_MESSAGE, `${channelId}?start=${numMessages}`, globalToken)
    .then((data) => {
        window.scroll(0, localStorage.getItem('scrollPosition'));
        document.getElementById('channel-messages').innerHTML = '';
        for (const message of data.messages) {
            createNewMessage(message, 'channel', globalToken);
        }

        messageActions();
    })
}

const messageActions = () => {
    let oldMessage = '';

    document.getElementsByName('message-edit').forEach(message => {
        message.addEventListener('click', () => {
            messageId = message.getAttribute('message-id');
            oldMessage = document.getElementById(`channel-message-content-${messageId}`).textContent;
            document.getElementById('message-editor').value = oldMessage;
        })
    })

    document.getElementById('message-edit-submit').addEventListener('click', () => {
        const newMessage = document.getElementById('message-editor').value;

        if (newMessage.trim() !== oldMessage.trim()) {
            apiCallWithBody(constant.METHOD_PUT, constant.SUB_MESSAGE, `${channelId}/${messageId}`, {
                message: newMessage,
                image: null
            }, globalToken)
            .then(() => {
                const editedDate = document.createElement('small');
                editedDate.textContent = 'Last Edited:';
                document.getElementById(`channel-message-${messageId}`).appendChild(editedDate);
                setScrollPosition();
                getMessage(channelId);
            })
        }
    })

    document.getElementsByName('message-delete').forEach(message => {
        message.addEventListener('click', () => {
            messageId = message.getAttribute('message-id');
            apiCallWithoutBody(constant.METHOD_DELETE, constant.SUB_MESSAGE, `${channelId}/${messageId}`, globalToken)
            .then(() => {
                setScrollPosition();
                getMessage(channelId);
            })
        })
    })

    document.getElementsByName('message-pin').forEach(message => {
        message.addEventListener('click', () => {
            messageId = message.getAttribute('message-id');
            const isPinned = message.textContent;

            if (isPinned === 'Pin') {
                apiCallWithBody(constant.METHOD_POST, constant.SUB_MESSAGE, `${constant.PATH_PIN}/${channelId}/${messageId}`, {}, globalToken)
                .then(() => {
                    setScrollPosition();
                    getMessage(channelId);
                })
            } else {
                apiCallWithBody(constant.METHOD_POST, constant.SUB_MESSAGE, `${constant.PATH_UNPIN}/${channelId}/${messageId}`, {}, globalToken)
                .then(() => {
                    setScrollPosition();
                    getMessage(channelId);
                })
            }
        })
    })

    reactChange('message-react-heart', 'heart');
    reactChange('message-react-crying', 'crying');
    reactChange('message-react-clown', 'clown');
    reactChange('message-react-angry', 'angry');

    document.getElementsByName('user-profile').forEach(user => {
        user.addEventListener('click', () => {
            const userId = user.getAttribute('user-id');

            apiCallWithoutBody(constant.METHOD_GET, constant.SUB_USER, userId, globalToken)
            .then((data) => {
                let bio = data.bio;
                if (data.bio === null) bio = 'No written bio.';

                document.getElementById('user-profile-name').textContent = data.name;
                document.getElementById('user-profile-email').textContent = data.email;
                document.getElementById('user-profile-bio').textContent = bio;
            })
        })
    })
}

const reactChange = (elementName, react) => {
    document.getElementsByName(elementName).forEach(message => {
        message.addEventListener('click', () => {
            const messageId = message.getAttribute('message-id');

            if (message.classList.contains('active')) {
                apiCallWithBody(constant.METHOD_POST, constant.SUB_MESSAGE, `${constant.PATH_UNREACT}/${channelId}/${messageId}`, {
                    react: react
                }, globalToken)
                .then(() => {
                    setScrollPosition();
                    getMessage(channelId);
                })
            } else {
                apiCallWithBody(constant.METHOD_POST, constant.SUB_MESSAGE, `${constant.PATH_REACT}/${channelId}/${messageId}`, {
                    react: react
                }, globalToken)
                .then(() => {
                    setScrollPosition();
                    getMessage(channelId);
                })
            }
        })
    })
}

document.getElementById('pinned-messages-button').addEventListener('click', () => {
    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_MESSAGE, `${channelId}?start=0`, globalToken)
    .then((data) => {
        document.getElementById('pinned-messages').innerHTML = '';
        const pinnedMessageList = data.messages.filter(message => message.pinned);
        pinnedMessageList.forEach(message => {
            createNewMessage(message, 'pinned', globalToken, false);
        })
    })
})

// User Invite
document.getElementById('channel-invite-button').addEventListener('click', () => {
    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_CHANNEL, channelId, globalToken)
    .then((dataChannel) => {
        apiCallWithoutBody(constant.METHOD_GET, constant.SUB_USER, constant.PATH_EMPTY, globalToken)
        .then((dataUser) => {
            const nonMemberUsers = dataUser.users.filter(user => !dataChannel.members.includes(user.id));

            document.getElementById('user-invite-list').innerHTML = '';
            nonMemberUsers.forEach(user => {
                const listUser = document.createElement('li');
                listUser.id = `user-invite-${user.id}`;
                listUser.setAttribute('class', 'list-group-item');
                document.getElementById('user-invite-list').appendChild(listUser);

                const listCheckbox = document.createElement('input');
                listCheckbox.id = `user-invite-select-${user.id}`;
                listCheckbox.setAttribute('class', 'form-check-input me-1');
                listCheckbox.type = 'checkbox';
                document.getElementById(listUser.id).appendChild(listCheckbox);

                const listName = document.createElement('label');
                listName.setAttribute('class', 'form-check-label');
                listName.setAttribute('for', listCheckbox.id);
                apiCallWithoutBody(constant.METHOD_GET, constant.SUB_USER, user.id, globalToken)
                .then((data) => {
                    listName.innerHTML = data.name;
                })
                document.getElementById(listUser.id).appendChild(listName);
            })

            document.getElementById('invite-users-button').addEventListener('click', () => {
                const nonMemberUsers = dataUser.users.filter(user => !dataChannel.members.includes(user.id));

                nonMemberUsers.forEach(user => {
                    const isSelected = document.getElementById(`user-invite-select-${user.id}`).checked;
                    if (isSelected) dataChannel.members.push(parseInt(user.id));
                })
            })
        })
    })
})

document.getElementById('view-profile-button').addEventListener('click', () => {
    const userId = localStorage.getItem('userId');

    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_USER, userId, globalToken)
    .then((data) => {
        document.getElementById('user-profile-edit-name').value = data.name;
        document.getElementById('user-profile-edit-email').value = data.email;
        document.getElementById('user-profile-edit-bio').value = data.bio;
    })
})

document.getElementById('user-profile-edit-submit').addEventListener('click', () => {
    const userId = localStorage.getItem('userId');
    let name = document.getElementById('user-profile-edit-name').value;
    let email = document.getElementById('user-profile-edit-email').value;
    let bio = document.getElementById('user-profile-edit-bio').value;
    apiCallWithoutBody(constant.METHOD_GET, constant.SUB_USER, userId, globalToken)
    .then((data) => {
        if (name === data.name) name = null;
        if (email === data.email) email = '';
        if (bio === data.bio) bio = null;
    })

    apiCallWithBody(constant.METHOD_PUT, constant.SUB_USER, constant.PATH_EMPTY, {
        email: email,
        password: null,
        name: name,
        bio: bio,
        image: ''
    }, globalToken)
})

document.getElementById('user-change-password-submit').addEventListener('click', () => {
    const newPassword = document.getElementById('user-new-password').value;

    apiCallWithBody(constant.METHOD_PUT, constant.SUB_USER, constant.PATH_EMPTY, {
        email: '',
        password: newPassword,
        name: null,
        bio: null,
        image: ''
    }, globalToken)

    document.getElementById('user-new-password').value = '';
    document.getElementById('user-new-password').type = 'password';
    document.getElementById('show-password').checked = false;
})

document.getElementById('show-password').addEventListener('change', () => {
    const isChecked = document.getElementById('show-password').checked;
    document.getElementById('user-new-password').type = (isChecked) ? 'text' : 'password';
})

// Reference: https://css-tricks.com/memorize-scroll-position-across-page-loads/
// Author: Chris Coyier
const setScrollPosition = () => {
    localStorage.setItem("scrollPosition", window.scrollY);
}

document.getElementsByName('redirect-link').forEach(redirect => {
    redirect.addEventListener('click', () => {
        document.querySelectorAll('form').forEach(formInput => formInput.reset());
        const path = redirect.getAttribute(REDIRECT_PATH_NAME);
        showPage(path);
    })
})