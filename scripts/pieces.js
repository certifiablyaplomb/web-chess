// USE BUILT IN PIECE FUNCTIONS-- THEY ENSURE NO ROW OVERFLOW \\
class Piece{ //super
    type=null //string
    position=null //int
    id=null //int/index
    color=null //string 'w' || 'b'

    newPosition=null
    boardState=null
    // || ERRORS || \\
    selfTakeError = new Error("You're taking your own piece!")
    invalidMoveError = new Error("Invalid Move")



    constructor(type, position, id, color){
        this.type = type;
        this.position = position;
        this.id = id;
        this.color = color;
    }
    
    // || PUBLIC || \\
    attemptMove(newPosition, boardState){
        //passing an int by value in any kind of training sense would get expensive
        this.newPosition= newPosition;
        this.boardState= boardState;
        //this should be at the top of each attemptMovement function 
        const isTaking = this._isTaking()
        if (isTaking && this._isSameColor()){
            throw this.selfTakeError;
        }
        this._assessMove();
        this._updatePosition();
        return true;
        ////////////////////////////////////////////////////////////
    }

    // || PRIVATE || \\ 
    _updatePosition(){
        this.boardState[Number(this.position)] = '';
        this.boardState[this.newPosition] = this;
        this.position = this.newPosition;
    }
    //does not make assumptions on validity of capture
    _isTaking(){ 
        return this.boardState[this.newPosition]? true: false;
    }
    _isSameColor(){
        return this.boardState[this.newPosition].color === this.color? true : false;
    }
    _rowChange(absolute=true){
        const c_row =  Math.floor(this.position / 8); 
        const n_row = Math.floor((this.newPosition) / 8);
        return absolute? Math.abs(c_row - n_row): (c_row - n_row);
    }
    _columnChange(absolute=true){
        const c_col = this.position % 8;
        const n_col = this.newPosition % 8;
        return absolute? (Math.abs(c_col - n_col)): (c_col - n_col);
    }
    
};

// || CHILD CLASSES || \\
//TBD make it impossible to move king if putting king in check 
// --> make super function (tbd post check/checkmate valiudation)
//TBD no obstruction validation 
// --> make super
class Pawn extends Piece{
    direction = null
    constructor(type, position, id, color){
        super(type, position, id, color);
        this.direction = this.color === 'b'? -1 : 1;
    }

    _assessMove(){ //returns true if move is valid, throws error if not
        const isTaking = this._isTaking();
        const rowChange = this._rowChange(false);
        const colChange = this._columnChange(false);

        //prevent self take
        if (isTaking && this._isSameColor()){
            throw this.selfTakeError;
        }
        //prevent horizontal movement and backwards movement
        else if (rowChange != this.direction && rowChange != this.direction * 2){ //also prevents left/right movement
            console.log('test1')
            throw this.invalidMoveError;
        }
        //prevent invalid taking with pawn
        else if (isTaking && ( ((rowChange) != this.direction) || (Math.abs(colChange) != 1)) ){
            throw this.invalidMoveError;
        }
        //prevent diagonal movement
        else if((Math.abs(colChange) > 0) && !isTaking){
            throw this.invalidMoveError;
        }
        //only allow +2 movement on first move 
        else if (Math.abs(rowChange)===2 && !this._isFirstMove()){
            throw this.invalidMoveError;
            
        }
        
        if(this._isEndOfBoard()){
            const promotionUi = window.document.querySelector('.js-promotion-ui');
            promotionUi.style.display='flex';
            promotionUi.dataset.pieceId = this.id;
        }
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
    _isEndOfBoard(){
        if ((0 <= this.newPosition && this.newPosition <=7) && this.color === 'w'){
            return true;
        }
        else if ((56 <= this.newPosition && this.newPosition <=63) && this.color === 'b'){
            return true;
        }
         return false;
    }

}
class Rook extends Piece{
    _assessMove(){
        const isTaking = this._isTaking()
        if (isTaking && this._isSameColor()){
            throw this.selfTakeError;
        }
        else if (this._columnChange() > 0 && this._rowChange() > 0){
            throw this.invalidMoveError;
        }
    }
}
class Knight extends Piece{
    _assessMove(){
        const isTaking = this._isTaking()
        if (isTaking && this._isSameColor()){
            throw this.selfTakeError;
        }
        else if ( !( ((this._columnChange() == 2) && (this._rowChange() == 1)) ||
        ((this._columnChange() == 1) && (this._rowChange() == 2)) )){
            throw this.invalidMoveError;
            }
    }
}
class Bishop extends Piece{
    _assessMove(){
        const isTaking = this._isTaking()
        if (isTaking && this._isSameColor()){
            throw this.selfTakeError;
        }
        else if ((this._columnChange()) != (this._rowChange())){
            throw(this.invalidMoveError)
        } 
    }
}
class King extends Piece{ 
    possibleChange=[1,7,8,9] //positive and negative

    _assessMove(){
        const isTaking = this._isTaking()
        if (isTaking && this._isSameColor()){
            throw this.selfTakeError;
        }
        else if (this._columnChange() > 1 || this._rowChange() > 1){
            throw this.invalidMoveError;
        }
    }
}
class Queen extends Piece{
    _assessMove(){
        const isTaking = this._isTaking()
        if (isTaking && this._isSameColor()){
            throw this.selfTakeError;
        }
        else if ( (this._columnChange() > 0 && this._rowChange() > 0) && 
        (this._columnChange() != this._rowChange())){
            throw this.invalidMoveError;
        }
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
