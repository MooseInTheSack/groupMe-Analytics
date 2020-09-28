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

const convertIdsToNames = (topTenDictWithIds) => {
    const TopTenDictWithNames = {}
    const dictOfIdsToNames = getDictionaryOfIdsToNames()
    for(let entry of topTenDictWithIds) {
        const entryId = Object.keys(entry)[0]
        const entryName = dictOfIdsToNames[entryId]
        TopTenDictWithNames[entryName] = entry[entryId]
    }
    return TopTenDictWithNames
}

const getMostActiveMembersFromDict = (dict, numberOfEntries) => {
    const topTenArray = []
    for(let key in dict) {
        if(key === 'system') break
        const person = { [key]: dict[key]}
        if(topTenArray.length < numberOfEntries) {
            topTenArray.push(person)
        } else {
            
            for(let topStopIndex in topTenArray) {
                const indexToCheck = topTenArray.length - topStopIndex - 1
                let topSpotInArray = topTenArray[indexToCheck]
                if(topSpotInArray[Object.keys(topSpotInArray)[0]] < person[Object.keys(person)[0]]) {
                    //now we gotta move the spot down but im too lazy rn
                    //let loserSpot = topSpotInArray[topStopIndex]
                    //topSpotInArray[topStopIndex] = person
                    topTenArray[indexToCheck] = person
                    break
                }
            }
        }
    }
    //return topTenArray
    const topTenArrayWithNames = convertIdsToNames(topTenArray)
    return topTenArrayWithNames

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

const topTenMembers = printMostActiveMembers(25)
console.log('topTenMembers: ', topTenMembers)