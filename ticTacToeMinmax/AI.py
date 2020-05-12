E = 0
X = 1
O = 2


def checkWin(board):
    # check columns
    for i in xrange(3):
        match = True
        shape = board[(i, 0)]
        for j in xrange(2):
            if board[(i, j + 1)] != shape:
                match = False
        if match:
            return shape

    # rows
    for i in xrange(3):
        match = True
        shape = board[(0, i)]
        for j in xrange(2):
            if board[(j + 1, i)] != shape:
                match = False
        if match:
            return shape

    # diagonals
    match = True
    shape = board[(0, 0)]
    for i in xrange(2):
        if board[(i + 1, i + 1)] != shape:
            match = False
    if match:
        return shape

    match = True
    shape = board[(2, 0)]
    for i in xrange(2):
        if board[(1 - i, i + 1)] != shape:
            match = False
    if match:
        return shape

#main AI
def minMax(board, turn):
    if turn == O:
        oTurn = X
    else:
        oTurn = O

    winner = checkWin(board)
    if winner == turn:
        return 1
    elif winner == oTurn:
        return -1


    move = -1
    score = -2
    for i in xrange(3):
        for j in xrange(3):
            if board[(i, j)] == E:
                newBoard = board.copy()
                newBoard[(i, j)] = turn
                nScore = -minMax(newBoard, oTurn)

                if nScore > score:
                    score = nScore
                    move = (i, j)

    if move == -1:
        return 0

    return score

def implement(turn, board):
    move = -1
    score = 100

    if turn == O:
        oTurn = X
    else:
        oTurn = O
    for i in xrange(3):
        for j in xrange(3):
            if board[(i, j)] == E:
                nBoard = board.copy()
                nBoard[(i, j)] = turn
                nScore = minMax(nBoard, oTurn)
                if nScore < score:
                    move = (i, j)
                    score = nScore

    return move