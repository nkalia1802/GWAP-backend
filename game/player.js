const Player = require('../models/player');
const Room = require('../models/room');

let last_room_id = null;
const last_room = Room.findById(last_room_id);

/**
 * Create a room and add player to it
 * @param player_id: player to be added
 * @returns {Promise<T | boolean>}
 * If room is created, return room, else return false
 */
const createRoom  = (player_id) => {
    const room = new Room({
        players: [player_id],
        sessions: [],
        started: false
    });

    return room.save()
        .then(doc => {
            last_room_id = doc._id;
            return doc;
        })
        .catch(error => {
            return false
        });
};

/**
 * Add player to the last room as it has space
 * @param player_id: player to be added
 * @returns {Promise<T | boolean>}
 * Returns room if successfully saved, else returns false
 */
const addToRoom = (player_id) => {
    last_room.players.push(player_id);

    return last_room.save()
        .then(doc => {
            return doc
        })
        .catch(err => {
            return false
        });
};

/**
 * Get room to which player belongs
 * @param player_id: Player to be added to room
 * @returns {Promise<T|boolean>}
 * Returns room if successfully created and found room,
 * else returns false
 */
const getRoom = (player_id) => {
    let room;
    if(last_room_id === null || last_room.players.length === 4) {
        room = createRoom(player_id)
    } else {
        room = addToRoom(player_id)
    }
    return room;
};

/**
 * Create a new player and assign him to a room
 * @param name: Name of the player to be added
 * @returns {{player_obj: Promise<T | boolean>, room: Promise<T|boolean>}}
 */
const createPlayer = (name) => {

    const player = new Player({
        name: name,
        points: 0,
        type: last_room.players.length === 3 ? "G" : "N"
    });

    const player_obj = player.save()
        .then(doc=>{return doc})
        .catch(err=> {return false});

    let room;

    if(player_obj) {
        room = getRoom(player_obj._id)
    }

    return {player_obj, room}
};



module.exports = {createPlayer};