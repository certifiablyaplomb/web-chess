// USE BUILT IN PIECE FUNCTIONS-- THEY ENSURE NO ROW OVERFLOW \\
class Piece{ //super
    type=null //string
    position=null //int
    id=null //int/index
    color=null //string 'w' || 'b'

    constructor(type, position, id, color){
        this.type = type;
        this.position = position;
        this.id = id;
        this.color = color;
    }
    
    // || PUBLIC || \\
    assessMoves(boardState, checkValidation=false){ //checkValidation is a strange parameter, SPECIAL CASE USE (PIECE SPECIFIC)
        //passing an int by value in any kind of training sense would get expensive
        this.boardState= boardState;

        const allMoves = checkValidation ? this._findAllMoves(checkValidation) : this._findAllMoves();
        //delete afterwards cause why not 
        delete this.boardState;
        
        return allMoves;
        ////////////////////////////////////////////////////////////
    }

    // || PRIVATE || \\     

    _findLimitHV(direction){ //['u','d','l','r'] //Horizontal Vertical
        let availableMoves=[];
        //HORIZONTAL 
        if (direction==='r' || direction==='l'){
            const cCol = this.position % 8;
            const availableCount = direction==='r'? (7 - cCol) : (cCol);
            if (availableCount > 0){
                const normalized = direction==='r'? 1 : -1;
                for (let i=1; i <= availableCount; i++){
                    availableMoves.push(this.position + (i * normalized))
                }
            }
        }
        else if (direction==='u' || direction==='d'){
            const cRow =  Math.floor(this.position / 8);
            const availableCount = direction==='u'? (cRow) : (7-cRow)
            if (availableCount > 0){
                const normalized = direction==='u'? -1 : 1;
                for (let i=1; i <= availableCount; i++){
                    availableMoves.push(this.position + ((i * normalized) * 8))
                }
            }
        }
        return availableMoves;
    }
    _findLimitD(direction){ //['ul','ur','dl','dr']
        let availableMoves=[];
        let cPos = this.position;
        let maxTraversable
        if (direction === 'dr' || direction === 'ul'){
            const cCol = this.position % 8;
            const cRow =  Math.floor(this.position / 8);
            if (direction ==='dr'){
                maxTraversable = Math.min(7 - cCol, 7 - cRow);
                 // :O
            }
            else{
                maxTraversable = Math.min(cCol, cRow);
            }
            if( maxTraversable > 0){
                const normalized = direction ==='dr'? 1 : -1;
                for (let i = 0; i < maxTraversable; i++){
                    availableMoves.push(cPos += (9 * normalized));
                }    
            }
        }
        //figuring these out hurt
        else if (direction === 'ur' || direction === 'dl'){
            const cCol = this.position % 8;
            const cRow =  Math.floor(this.position / 8);
            if (direction ==='ur'){
                maxTraversable = (Math.min(7 - cCol, cRow));
            }
            else{
                maxTraversable = Math.min(cCol, 7 - cRow);
            }
            if( maxTraversable > 0){
                const normalized = direction ==='ur'? -1 : 1;
                for (let i = 0; i < maxTraversable; i++){
                    availableMoves.push(cPos += (7 * normalized));
                }    
            }
        }
        return availableMoves;
    }
    //finds max distance a piece can travel given a vector of available moves
    _findMax(movesArray, distance=0, forwardPawn=false, forCheckValidation=false){
        if (distance){
            movesArray = movesArray.splice(0, distance);
        }
        let max;
        
        if(!forCheckValidation){
            for (let i = 0; i < movesArray.length; i++){
                if (this.boardState[movesArray[i]]){
                        max = ((this.color === this.boardState[movesArray[i]].color) || forwardPawn)? 
                            movesArray.splice(0, i) : movesArray.splice(0, i+1);
                        break;
                }
            }
            
        }
        else{ //returns first thing in collision with
            for (let i = 0; i < movesArray.length; i++){
                if (this.boardState[movesArray[i]]){
                    max = this.color != this.boardState[movesArray[i]].color? [movesArray[i]] : [];
                    break;
                }
                else{
                    max = []
                }
            }
        }
        return max? max : movesArray;
    }


};



// || CHILD CLASSES || \\
//TBD make it impossible to move any piece if putting own king in check 
// --> make super function (tbd post check/checkmate valiudation)

class Pawn extends Piece{
    direction = null //what direction that pawn can move
    constructor(type, position, id, color){
        super(type, position, id, color);
        this.direction = this.color === 'b'? -1 : 1;
    }

    _findAllMoves(){ 
        let allAvailableMoves=[];
        const maxMove = this._isFirstMove() ? 2 : 1;
        const letterDirection = this.direction === 1? 'u' : 'd';
        allAvailableMoves.push(...(this._findMax(this._findLimitHV(letterDirection), maxMove, true)));

        const forwardR = (this._findMax(this._findLimitD(`${letterDirection}r`), 1))
        this._isTaking(forwardR[0]) ? allAvailableMoves.push(forwardR[0]) : false;
        const forwardL = (this._findMax(this._findLimitD(`${letterDirection}l`), 1))
        this._isTaking(forwardL[0]) ? allAvailableMoves.push(forwardL[0]) : false;

        return allAvailableMoves;
    }
    // A PUBLIC FUCNTION :0
    isEndOfBoard(position){
        if ((0 <= position && position <=7) && this.color === 'w'){
            return true;
        }
        else if ((56 <= position && position <=63) && this.color === 'b'){
            return true;
        }
         return false;
    }

    _isFirstMove(){
        if ((8 <= this.position && this.position <=15) && this.color === 'b'){
            return true;
        }
        else if ((48 <= this.position && this.position <=55) && this.color === 'w'){
            return true;
        }
        return false;
    }
    
    _isTaking(position){ 
        const piece = this.boardState[position];
        return piece && (piece.color != this.color) ? true: false;
    }
}
class Rook extends Piece{
    _findAllMoves(){
        const directions = ['u','d','l','r']
        let allAvailableMoves=[];

        directions.forEach((direction)=>{
            allAvailableMoves.push(...this._findMax(this._findLimitHV(direction)));
        })
        return allAvailableMoves;

    }
}
export class Knight extends Piece{
     // + -
    
    _findAllMoves(){ 
        let allAvailableMoves =[];
        const moveMap = [
            -6, -10, -15, -17,
            6, 10, 15, 17
        ]
        moveMap.forEach((move)=>{
            const position = move + this.position;
            if (position >=0 && position <=63){
                this._assessMove(position)? allAvailableMoves.push(position) : false;
            }
        })

        return allAvailableMoves.filter((position)=>{
            if(!this._isTakingOwn(position)){
                return position
            }
        });
    }
    
    _assessMove(position){
    if ( ( ((this._columnChange(position) == 2) && (this._rowChange(position) == 1)) ||
        ((this._columnChange(position) == 1) && (this._rowChange(position) == 2)) )){
            return true;
        }
    return false; 
    }

    _rowChange(position, absolute=true){
        const cRow =  Math.floor(this.position / 8); 
        const n_row = Math.floor((position) / 8);
        return absolute? Math.abs(cRow - n_row): (cRow - n_row);
    }
    _columnChange(position, absolute=true){
        const cCol = this.position % 8;
        const n_col = position % 8;
        return absolute? (Math.abs(cCol - n_col)): (cCol - n_col);
    }
    _isTakingOwn(position){ 
        const piece = this.boardState[position];
        return piece && piece.color === this.color;
    }
}
class Bishop extends Piece{
    
    _findAllMoves(){
        let allAvailableMoves = this._findMax(this._findLimitD('ul'));
        allAvailableMoves.push(...this._findMax(this._findLimitD('dr')));
        allAvailableMoves.push(...this._findMax(this._findLimitD('ur')));
        allAvailableMoves.push(...this._findMax(this._findLimitD('dl')));
        return allAvailableMoves;
    }
}
class King extends Piece{ 
    _findAllMoves(){
        let allAvailableMoves = [];
        allAvailableMoves.push(...(this._findMax(this._findLimitHV('u'), 1)));
        allAvailableMoves.push(...(this._findMax(this._findLimitHV('d'), 1)));
        allAvailableMoves.push(...(this._findMax(this._findLimitHV('l'), 1)));
        allAvailableMoves.push(...(this._findMax(this._findLimitHV('r'), 1)));

        allAvailableMoves.push(...(this._findMax(this._findLimitD(`ur`), 1)));
        allAvailableMoves.push(...(this._findMax(this._findLimitD(`ul`), 1)));
        allAvailableMoves.push(...(this._findMax(this._findLimitD(`dr`), 1)));
        allAvailableMoves.push(...(this._findMax(this._findLimitD(`dl`), 1)));

        return allAvailableMoves;
    }
}
export class Queen extends Piece{
    _findAllMoves(checkValidation=false){
        let allAvailableMoves = [];
        allAvailableMoves.push(...(this._findMax(this._findLimitHV('u'), 0, false, checkValidation)));
        allAvailableMoves.push(...(this._findMax(this._findLimitHV('d'), 0, false, checkValidation)));
        allAvailableMoves.push(...(this._findMax(this._findLimitHV('l'), 0, false, checkValidation)));
        allAvailableMoves.push(...(this._findMax(this._findLimitHV('r'), 0, false, checkValidation)));

        allAvailableMoves.push(...(this._findMax(this._findLimitD(`ur`), 0, false, checkValidation)));
        allAvailableMoves.push(...(this._findMax(this._findLimitD(`ul`), 0, false, checkValidation)));
        allAvailableMoves.push(...(this._findMax(this._findLimitD(`dr`), 0, false, checkValidation)));
        allAvailableMoves.push(...(this._findMax(this._findLimitD(`dl`), 0, false, checkValidation)));

        return allAvailableMoves;
    }

}

// PIECE DATA \\
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
        type: 'pawn',
        position: 48,
        id:16,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 49,
        id:17,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 50,
        id:18,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 51,
        id:19,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 52,
        id:20,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 53,
        id:21,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 54,
        id:22,
        color: 'w'
    },
    {
        type: 'pawn',
        position: 55,
        id:23,
        color: 'w'
    },
    {
        type: 'rook',
        position: 56,
        id:24,
        color: 'w'
    },
    {
        type: 'knight',
        position: 57,
        id:25,
        color: 'w'
    },
    {
        type: 'bishop',
        position: 58,
        id:26,
        color: 'w'
    },
    {
        type: 'king',
        position: 59,
        id:27,
        color: 'w'
    },
    {
        type: 'queen',
        position: 60,
        id:28,
        color: 'w'
    },
    {
        type: 'bishop',
        position: 61,
        id:29,
        color: 'w'
    },
    {
        type: 'knight',
        position: 62,
        id:30,
        color: 'w'
    },
    {
        type: 'rook',
        position: 63,
        id:31,
        color: 'w'
    },

    
]

export const pieceMap = {
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

export function makePieces(listToClone=null){
    const objectToCopy = listToClone? listToClone : pieceData;
    const pieceObjects = objectToCopy.map((piece)=>{
    const { type, position, id, color } = piece;
    const pieceClass = pieceMap[type];
    return new pieceClass(type, position, id, color);
    })
    return pieceObjects;
}
    
