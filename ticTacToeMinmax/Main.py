import pygame, os
from pygame.locals import *
from AI import *

# ***INITIALIZE***
os.environ['SDL_VIDEO_CENTERED'] = '1'

pygame.init()
mainClock = pygame.time.Clock()
fps = 60

# creates screen size
w = 600
h = 600
scrn = pygame.display.set_mode((w, h))
stop = False

sW = w / 3
sH = h / 3

grid = {}

E = 0
X = 1
O = 2

# X starts
turn = False
gameWon = False
stale = False

XAI = True
OAI = False


def createGrid():
    for i in xrange(3):
        for j in xrange(3):
            grid[(i, j)] = E


def drawGrid():
    pygame.draw.line(scrn, (255, 255, 0), (w / 3, 0), (w / 3, h), 7)
    pygame.draw.line(scrn, (255, 255, 0), (2 * w / 3, 0), (2 * w / 3, h), 7)
    pygame.draw.line(scrn, (255, 255, 0), (0, h / 3), (w, h / 3), 7)
    pygame.draw.line(scrn, (255, 255, 0), (0, 2 * h / 3), (w, 2 * h / 3), 7)

    for i in xrange(3):
        for j in xrange(3):
            cX = i * sW + (sW / 2)
            cY = j * sH + (sH / 2)
            if grid[(i, j)] == X:
                pygame.draw.line(scrn, (255, 0, 0), (cX - sW / 4, cY - sH / 4), (cX + sW / 4, cY + sH / 4), 7)
                pygame.draw.line(scrn, (255, 0, 0), (cX - sW / 4, cY + sH / 4), (cX + sW / 4, cY - sH / 4), 7)
            if grid[(i, j)] == O:
                if sW > sH:
                    pygame.draw.circle(scrn, (0, 0, 255), (cX, cY), sH / 3, 7)
                else:
                    pygame.draw.circle(scrn, (0, 0, 255), (cX, cY), sW / 3, 7)


def placeShape(x, y):
    global turn, gameWon
    if grid[(x, y)] == E and not gameWon:
        if turn:
            grid[(x, y)] = O
        else:
            grid[(x, y)] = X
        turn = not turn
        printWin()


def reset():
    global turn, gameWon
    createGrid()
    turn = False
    gameWon = False


def checkStale():
    for i in xrange(3):
        for j in xrange(3):
            if grid[(i, j)] == E:
                return False

    return True


def printWin():
    global gameWon
    winner = checkWin(grid)
    if winner == O:
        print 'O wins'
        gameWon = True
    if winner == X:
        print 'X wins'
        gameWon = True


def main():
    global stop, turn, stale
    mainClock.tick(fps)

    scrn.fill((150, 150, 150))

    for event in pygame.event.get():
        if event.type == QUIT:  # user closed the program
            stop = True
        if event.type == KEYDOWN:
            if event.key == K_r:
                reset()
        if event.type == pygame.MOUSEBUTTONDOWN:
            placeShape(event.pos[0] / sW, event.pos[1] / sH)

    drawGrid()
    pygame.display.update()

    if not stale:
        if not turn and XAI:
            grid[implement(X, grid)] = X
            turn = not turn
        if turn and OAI:
            grid[implement(O, grid)] = O
            turn = not turn
        checkStale()
        printWin()


# Main Loop/setup
createGrid()
while not stop:
    main()

pygame.quit()
