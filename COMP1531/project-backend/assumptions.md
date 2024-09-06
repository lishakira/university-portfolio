Assume that channelsCreateV1 is to return an error if the channel name has already been taken

In testing channelMessagesV1, we cannot actually test whether the messages being returned are correct or not, since at the moment we do not have any way of pushing or popping messages in a channel without using getData(). Instead, the best we can do is assume that the messages will be return as a new array, in a reverse order from the original channel.messages array. 

Asumption -> authRegister: remove all spaces from firstName, lastName and password

Assume that channelsCreateV1 will initially create a channel with zero messages.

Assume that channelsListV1 is to return an array with an empty object if no classes match the criteria

Assume that userProfileV1 will always take in a valid authUserId, will only
check the uId for validity.

Assume that channelMessagesV1 will always be given a valid authUserId, will
only check the channelId.

Assume that channelsListV1 is to return any channel that the member is in, (staff or member) including if it is private

Assume that channelsListallV1 is to return all channels even if the student is not a part of the channel, including if it is private
