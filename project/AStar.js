//构件坐标类
class Vec2i {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    isEqual(coordinates) {
        return this.x === coordinates.x && this.y === coordinates.y;
    }
}

//使用曼哈顿距离作为启发函数
function heuristicManhattan(source, target) {
    const delta = {
        x: Math.abs(source.x - target.x),
        y: Math.abs(source.y - target.y),
    };
    return (delta.x + delta.y);
}

/*
    G:起点到当前点距离
    H:当前点到终点的估算距离
    cooedinates:坐标
    parent:上一个父节点
*/
class Node {
    constructor(coordinates, parent = null) {
        this.G = 0;
        this.H = 0;
        this.coordinates = coordinates;
        this.parent = parent;
    }

    //用坐标向量表示当前点指向的方向，用于计算夹角
    vector_x = this.parent == null ? 0 : coordinates.x - parent.x;
    vector_y = this.parent == null ? 0 : coordinates.y - parent.y;

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

    //检测是否有障碍物
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

    //自定义安全的弯折度数
    setAngle(safeAngle) {
        this.safeAngle = 180 - safeAngle;
    }

    //检测所选路径是大于安全的弯折度数
    checkAngle(current, direction) {
        if (current.parent == null) return true;
        let x1 = current.coordinates.x - current.parent.coordinates.x;
        let y1 = current.coordinates.y - current.parent.coordinates.y;
        let x2 = direction.x;
        let y2 = direction.y;


        let angle = Math.acos((x1 * x2 + y1 * y2)
            / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2)))
            * (180 / Math.PI);

        let final_angle = parseFloat(angle.toFixed(2));

        if (final_angle <= this.safeAngle) {
            return true;
        } else {
            return false;
        }
    }


    //添加安全距离
    addSafeDistance(){}


    /**
     * 
     * @param {coordinates} source 起点
     * @param {coordinates} target 终点
     * @returns 
     */
    findPath(source, target) {
        const openSet = [];
        const closedSet = [];
        openSet.push(new Node(source));

        while (openSet.length > 0) {
            let current = openSet[0];
            let currentIndex = 0;

            //当前最短路径
            for (let i = 0; i < openSet.length; i++) {
                let node = openSet[i];
                if (node.getScore() < current.getScore()) {
                    current = node;
                    currentIndex = i;
                }
            }

            //保留路径上的必要节点并返回给threejs
            if (current.coordinates.isEqual(target)) {
                let path = [];
                //先放入终点
                path.push(current.coordinates);
                current = current.parent;
                //遍历剩下非起点的点
                while (current.parent !== null) {
                    if (current.vector_x != current.parent.vector_x || current.vector_y != current.parent.vector_y) {
                        path.push(current.coordinates);
                        path.push(current.parent.coordinates);
                        current = current.parent;
                    }
                    current = current.parent;
                }
                //放入起点
                path.push(source);
                path.reverse();
                //将path转变为数组返回
                let result = [];
                for (const item of path) {
                    result.push([item.x, item.y]);
                }
                return result;
            }

            openSet.splice(currentIndex, 1);
            closedSet.push(current);

            for (let i = 0; i < 8; i++) {
                if (!this.checkAngle(current, this.direction[i])) {
                    continue;
                }

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

//返回路径用于3D建模
export function aStarFindPath(world_x, world_y, safeAngle, startPoint, endPoint, passByPoints) {
    const astar = new AStar();
    astar.setWorldSize({ x: world_x, y: world_y });
    astar.setAngle(safeAngle);

    const path = astar.findPath(new Vec2i(startPoint[0], startPoint[1]), new Vec2i(endPoint[0], endPoint[1]));
    return path;
}
