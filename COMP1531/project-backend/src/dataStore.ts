// YOU SHOULD MODIFY THIS OBJECT BELOW
import { config } from './users';

let data = {
  users: [

    {
      id: 1,
      nameFirst: 'user1',
      nameLast: 'user1',
      password: 'password',
      email: 'email@hotmail.com',
      enrolledChannels: [],
      enrolledDms: [],
      handler: 'nameFirstandLast',
      globalOwner: false,
      userStats: {
        channelsJoined: [{ numChannelsJoined: 0, timeStamp: 0 }],
        dmsJoined: [{ numDmsJoined: 0, timeStamp: 0 }],
        messagesSent: [{ numMessagesSent: 0, timeStamp: 0 }],
        involvementRate: 0
      },
      notifications: [],
      profileImgUrl: `${config.url}:${config.port}/profiles/startingimage.jpg`
    },

  ],
  channels: [
    /*
    {
        'id': 1,
        'name' : 'channel1',
        'isPublic' : false,
        // String of chat messages
        'messages' : [],
        'ownerMembers' : [],
        'allMembers' : [],
        standup:
      {

        owner: 1;
        channelId: 1,
        timeFinish: 1,
        messages:
        {
          [
            userId: 1,
            message
          ]
        }

      },
      isStandUpActive: false
    },
    */

  ],
  tokens: [
    /*
    {
      token: '',
      authUserId: -1
    },
    */
  ],
  dms: [
    /*
    {
      name: 'ahandle1, bhandle2, chandle3';
      ownerUserId: 1;
      ownerHandle: 'user1';
      memberIds: [];
      messages: [];
      dmId: 1;
    }
    */
  ],
  resetCodes: [
    /*
    {
      authUserId: 1
      resetCode: '',
      valid: true,
    }
    */
  ],
  totalMessages: 0,
  workSpaceStats: {
    channelsExist: [{ numChannelsExist: 0, timeStamp: 10 }],
    dmsExist: [{ numDmsExist: 0, timeStamp: 10 }],
    messagesExist: [{ numMessagesExist: 0, timeStamp: 10 }],
    utilizationRate: 0,
  },
  delayedMessages: [
    /*
      (messageId): 1;
    */
  ],
};

/*
let tokens =
  [{
    token: '',
    authUserId: -1
  }];
*/
// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: any) {
  data = newData;
}

export interface tokenObject {
  token: string;
  authUserId: number;
}

export interface userObject {
  authUserId: number;
  nameFirst: string;
  nameLast: string;
  password: string;
  email: string;
  enrolledChannels: [];
  handler: string;
  globalOwner: false;
}

export interface channelObject {
  channelId: number;
  name: string;
  isPublic: false;
  messages: [];
  ownerMembers: [];
  allMember: [];
}

export interface dmObject {
  name: string;
  ownerUserId: number;
  ownerHandle: string;
  memberIds: number[];
  messages: string[];
  dmId: number;
}

export interface resetCodeObject {
  authUserId: number,
  resetCode: string,
  valid: true,
}

export { getData, setData };
