'use strict';

const playlistModel = require('../models/playlist');
const eventModel    = require('../models/event');

this.rooms = [];

this.sortTracksByScore = (tracks) => {
    
    let tmpArray = tracks.reduce( (acc, elem) => {
        if (elem.status === 0) acc['toSort'].push(elem);
        else acc['played'].push(elem);
        return acc
    }, {toSort: [], played: []})
    tmpArray.toSort.sort((a, b) => { 
        return b.like - a.like;
    })
    tracks = tmpArray.played.concat(tmpArray.toSort)
    return tracks
}
module.exports = {
    sendPlaylist: async (playlistId) => {
        try {
            return await playlistModel.findOne({_id: playlistId});
        } catch (err) {
            return err
        }
    },
    getEvent: async (eventId) => {
        try {
            let event = await eventModel.findOne({_id: eventId});
            if (event) {
                return event
            }
            return null
        } catch (err) {
            return err
        }
    },
    updateScore: (room, trackID, points, userID) => {
        room.tracks.forEach((track) => {
            if (track._id.toString() === trackID.toString()) {
                let i = track.userLike.indexOf(userID)
                let j = track.userUnLike.indexOf(userID)
                if ((points === 1 && i !== -1) || (points === -1 && j !== -1))
                    return (room)
                if (i != -1) track.userLike.splice(i, 1);
                if (j != -1) track.userUnLike.splice(j, 1);
                points > 0 ? track.userLike.push(userID) : track.userUnLike.push(userID)
                track.like += points
            } 
        })
        return room
    },
    updateRoom: (tmpRoom) => {
        let ret = null;
        this.rooms.forEach((room) => {
            if (room.id === tmpRoom.id) {
                room.tracks = this.sortTracksByScore(tmpRoom.tracks)
                room.users  = tmpRoom.users;
                ret = room;
            }
        })
        return ret
    },
    updateStatus: async (eventId, trackID) => {
        try {
            return await eventModel.findOneAndUpdate({_id: eventId}, {'isPlaying': trackID}, {new: true})
        }catch (e) {
            return e
        }
    },
    createRoom: async (roomID, userID) => {
        try {
            let event = await eventModel.findOne(
                {_id: roomID,
                $or: [
                    {creator: userID},
                    {'members': {$in: userID}},
                    {'adminMembers': {$in: userID}},
                    {public: true}
                ]})
            if (!event)
                throw new Error('you cannot access to this event')
            let room = {
                id: roomID,
                event,
                tracks: event.playlist.tracks.data,
                users: [userID]
            };
            room.tracks = room.tracks.map((track) => {
                track = {...track._doc, like: 0, status: 0, userLike: [], userUnLike: []}
                return track
            })
            room.tracks[0].status = 1;
            this.rooms.push(room);
            return room
        } catch (e) {
            throw e
        }
    },
    joinRoom: (room, userID) => {
        if (room.users && (room.users.indexOf(userID) === -1)) {
            room.users.push(userID)
            return true
        }
        return false
    },
    deleteRoom: (roomID, userID) => {
        if (this.rooms && this.rooms.length > 0) {
            let ret = -1 ;
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].id === roomID)
                    ret = i
                    break;
            }
            ret == -1  ? null : delete this.rooms.splice(ret, 1);
        }
    },
    getRoom: (roomID) => {
        let ret = null
        if (this.rooms) {
            for (let elem of this.rooms) {
                if (elem.id === roomID) {
                    ret = elem
                    break
                }
            }
        }
        return ret;
    },
    saveNewEvent: async (newEvent) => {
        if (newEvent._id)
            return await eventModel.updateOne({_id: newEvent._id}, newEvent, {new: true})
    },
    updatePlayStatus: async (roomID, value) => {
        if (roomID)
            return await eventModel.updateOne({_id: roomID}, {is_play:value}, {new: true})
    },
    updateEventTracks : async (eventId, tracks) => {
        try {
            return await eventModel.findOneAndUpdate({_id: eventId}, {'playlist.tracks.data': tracks}, {new: true})
        }catch (e) {
            return e
        }
    }
};
