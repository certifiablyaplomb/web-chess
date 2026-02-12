import { Pawn, Rook, Knight, Bishop, King, Queen } from '../scripts/pieces.js'

const pieceData = [
    {
        type: 'rook',
        position: 0,
        id:0,
        color: 'b'
    },
    {
        type: 'knight',
        position: 1,
        id:1,
        color: 'b'
    },
    {
        type: 'bishop',
        position: 2,
        id:2,
        color: 'b'
    },
    {
        type: 'queen',
        position: 3,
        id:3,
        color: 'b'
    },
    {
        type: 'king',
        position: 4,
        id:4,
        color: 'b'
    },
    {
        type: 'bishop',
        position: 5,
        id:5,
        color: 'b'
    },
    {
        type: 'knight',
        position: 6,
        id:6,
        color: 'b'
    },
    {
        type: 'rook',
        position: 7,
        id:7,
        color: 'b'
    },

    {
        type: 'pawn',
        position: 8,
        id:8,
        color: 'b'
    },
    {
        type: 'pawn',
        position: 9,
        id:9,
        color: 'b'
    },
    {
        type: 'pawn',
        position: 10,
        id:10,
        color: 'b'
    },
    {
        type: 'pawn',
        position: 11,
        id:11,
        color: 'b'
    },
    {
        type: 'pawn',
        position: 12,
        id:12,
        color: 'b'
    },
    {
        type: 'pawn',
        position: 13,
        id:13,
        color: 'b'
    },
    {
        type: 'pawn',
        position: 14,
        id:14,
        color: 'b'
    },
    {
        type: 'pawn',
        position: 15,
        id:15,
        color: 'b'
    },
    {
        type: 'rook',
        position: 48,
        id:16,
        color: 'w'
    },
    {
        type: 'knight',
        position: 49,
        id:17,
        color: 'w'
    },
    {
        type: 'bishop',
        position: 50,
        id:18,
        color: 'w'
    },
    {
        type: 'king',
        position: 51,
        id:19,
        color: 'w'
    },
    {
        type: 'queen',
        position: 52,
        id:20,
        color: 'w'
    },
    {
        type: 'bishop',
        position: 53,
        id:21,
        color: 'w'
    },
    {
        type: 'knight',
        position: 54,
        id:22,
        color: 'w'
    },
    {
        type: 'rook',
        position: 55,
        id:23,
        color: 'w'
    },

    {
        type: 'pawn',
        position: 56,
        id:24,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 57,
        id:25,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 58,
        id:26,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 59,
        id:27,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 60,
        id:28,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 61,
        id:29,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 62,
        id:30,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 63,
        id:31,
        color: 'w'
    }
]

const pieceMap = {
    'pawn': Pawn,
    'rook': Rook,
    'knight': Knight,
    'bishop': Bishop,
    'king': King,
    'queen': Queen
}

export const pieceObjects = pieceData.map((piece)=>{
    const { type, position, id, color } = piece;
    const pieceClass = pieceMap[type];
    return new pieceClass(type, position, id, color);
})
