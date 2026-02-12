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
};
export class Pawn extends Piece{
    
}
export class Rook extends Piece{}
export class Knight extends Piece{}
export class Bishop extends Piece{}
export class King extends Piece{}
export class Queen extends Piece{}