class Vec2i {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    isEqual(coordinates) {
        return this.x === coordinates.x && this.y === coordinates.y;
    }
}

function heuristicManhattan(source, target) {
    const delta = {
        x: Math.abs(source.x - target.x),
        y: Math.abs(source.y - target.y),
    };
    return (delta.x + delta.y);
}


class Node {
    constructor(coordinates, parent = null) {
        this.G = 0;
        this.H = 0;
        this.coordinates = coordinates;
        this.parent = parent;
    }

    getScore() {
        return this.G + this.H;
    }
}

class AStar {
    constructor() {
        this.direction = [
            { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 },
            { x: -1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 },
        ];
        this.obstacles = [];
        this.worldSize = { x: 0, y: 0 };
    }

    setWorldSize(worldSize) {
        this.worldSize = worldSize;
    }

    direction = 8;

    addCollision(coordinates) {
        this.obstacles.push(coordinates);
    }

    detectCollision(coordinates) {
        if (coordinates.x < 0 || coordinates.x >= this.worldSize.x 
            || coordinates.y < 0 || coordinates.y >= this.worldSize.y) {
            return true;
        }
        return this.obstacles.some((obstacle) => obstacle.isEqual(coordinates));
    }

    findNodeOnList(nodes, coordinates) {
        return nodes.find((node) => node.coordinates.isEqual(coordinates));
    }


    findPath(source, target) {
        const openSet = [];
        const closedSet = [];
        openSet.push(new Node(source));
        console.log(source);
        while (openSet.length > 0) {
            let current = openSet[0];
            let currentIndex = 0;

            for (let i = 0; i < openSet.length; i++) {
                let node = openSet[i];
                if (node.getScore() < current.getScore()) {
                    current = node;
                    currentIndex = i;
                }
            }

            if (current.coordinates.isEqual(target)) {
                let path = [];
                while (current !== null) {
                    path.push(current.coordinates);
                    current = current.parent;
                }
                return path.reverse();
            }

            openSet.splice(currentIndex, 1);
            closedSet.push(current);

            for (let i = 0; i < 8; i++) {
                const newCoordinates = new Vec2i(current.coordinates.x + this.direction[i].x, current.coordinates.y + this.direction[i].y);
                
                if (this.detectCollision(newCoordinates) || this.findNodeOnList(closedSet, newCoordinates)) {
                    continue;
                }

                const totalCost = current.G + (i < 4 ? 1 : 1.4);

                const successor = this.findNodeOnList(openSet, newCoordinates);
                if (!successor) {
                    const newNode = new Node(newCoordinates, current);
                    newNode.G = totalCost;
                    newNode.H = heuristicManhattan(newNode.coordinates, target);
                    openSet.push(newNode);
                } else if (totalCost < successor.G) {
                    successor.parent = current;
                    successor.G = totalCost;
                }
            }
        }

        return [];
    }

}

// 示例使用
const astar = new AStar();
astar.setWorldSize({ x: 10, y: 10 });
astar.addCollision(new Vec2i(2, 2));
astar.addCollision(new Vec2i(2, 3));
astar.addCollision(new Vec2i(3, 3));
const path = astar.findPath(new Vec2i(0, 0), new Vec2i(3,4));
console.log(path);
console.log("输出完成")
