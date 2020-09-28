'use strict'

const fs = require('fs');

const getGroupMembers = () => {
    //get all groupParticipants with their name and ID's
    const rawdata = fs.readFileSync('./groupMeData/59528655/conversation.json')
    return JSON.parse(rawdata)
}

const getConversation = () => {
    const rawdata = fs.readFileSync('./groupMeData/59528655/message.json')
    return JSON.parse(rawdata)
}

const getDictionaryOfIdsToNames = () => {
    const dict = getGroupMembers()
    const membersArray = dict['members']
    const idNameDict = {}
    for(let personObject of membersArray) {
        const user_id = personObject['user_id']
        const user_name = personObject['nickname']
        idNameDict[user_id] = user_name
    }
    return idNameDict
}

const convertIdsToNames = (arrayOfArrays) => {
    console.log('arrayOfArrays: ', arrayOfArrays)
    const topMembers = arrayOfArrays
    const TopTenDictWithNames = {}
    const dictOfIdsToNames = getDictionaryOfIdsToNames()
    for(let member of topMembers) {
        console.log('member: ', member)
        const memberName = dictOfIdsToNames[member[0]]
        TopTenDictWithNames[memberName] = member[1]
    }
    return TopTenDictWithNames
}

const getMostActiveMembersFromDict = (dict, numberOfEntries) => {
    let topTenArray = []
    

    for (var user_id in dict) {
        topTenArray.push([user_id, dict[user_id]]);
    }

    topTenArray = topTenArray.sort(function(a, b) {
        return a[1] - b[1];
    })

    topTenArray = topTenArray.splice(topTenArray.length - numberOfEntries, numberOfEntries)

    const sortedMostActiveMembers = convertIdsToNames(topTenArray)
    return sortedMostActiveMembers

}

const printMostActiveMembers = (numberOfEntries) => {
    const conv = getConversation()
    let dict = {}
    for(let message of conv) {
        const sender_id = message['sender_id']
        if(dict[sender_id] === undefined) {
            dict[sender_id] = 1
        } else {
            dict[sender_id] += 1
        }
    }

    return getMostActiveMembersFromDict(dict, numberOfEntries)
    /*
    FORMAT:
    Message:  {
    attachments: [],
    avatar_url: 'https://i.groupme.com/1960x1960.jpeg.79474ec6076b46d4923714c1be94a824',
    created_at: 1600118245,
    favorited_by: [ '12799035', '14926039', '2137491', '21477059', '84752862' ],
    group_id: '59528655',
    id: '160011824569989107',
    name: 'Adil D',
    sender_id: '85454629',
    sender_type: 'user',
    source_guid: 'android-0462bb7c-fe7b-415e-a201-3e21ddd5f897',
    system: false,
    text: 'Please stop the train, I need to exit � ',
    user_id: '85454629',
    platform: 'gm'
}          
*/
}

const topTenMembers = printMostActiveMembers(50)
console.log('topTenMembers: ', topTenMembers)