//https://github.com/runningwild/GoLLRB/blob/master/llrb/llrb.go
class LLRB {
    /*
    node: {
        value: any,
        left: node,
        right: node,
        red: bool
    }
     */
    constructor() {
        this.root = null;
    }

    static isRed(node) {
        return node != null && node.red;
    }

    static nRotLeft(node) {
        let x = node.right;
        if (!this.isRed(x)) {
            alert("Cannot rotate left");
            return node;
        } else {
            window.makeOp(`rotateLeft(${node.value})\n`);
            node.right = x.left;
            x.left = node;
            x.red = node.red;
            node.red = true;
            return x;
        }
    }

    static nRotRight(node) {
        let x = node.left;
        if (!this.isRed(x)) {
            alert("Cannot rotate right");
            return node;
        } else {
            window.makeOp(`rotateRight(${node.value})\n`);
            node.left = x.right;
            x.right = node;
            x.red = node.red;
            node.red = true;
            return x;
        }
    }

    static flipColor(node) {
        window.makeOp(`colorFlip(${node.value})\n`);
        node.red = !node.red;
        node.left.red = !node.left.red;
        node.right.red = !node.right.red;
    }

    static nAdd(node, value) {
        if (node == null) {
            return {
                value,
                left: null,
                right: null,
                red: true
            };
        } else {
            if (value < node.value) {
                node.left = this.nAdd(node.left, value);
            } else {
                node.right = this.nAdd(node.right, value);
            }
            if (this.isRed(node.right) && !this.isRed(node.left)) {
                node = this.nRotLeft(node);
            }
            if (this.isRed(node.left) && this.isRed(node.left.left)) {
                node = this.nRotRight(node);
            }
            if (this.isRed(node.left) && this.isRed(node.right)) {
                this.flipColor(node);
            }
            return node;
        }
    }

    static nContains(node, value) {
        if (node == null) {
            return false;
        } else {
            return node.value === value || this.nContains(node.left, value) || this.nContains(node.right, value);
        }
    }

    add(value) {
        window.makeOp(`Add ${value}\n=============\n`);
        this.root = LLRB.nAdd(this.root, value);
        window.makeOp("\n");
    }

    contains(value) {
        return LLRB.nContains(this.root, value);
    }

    rotateLeft() {
        this.root = LLRB.nRotLeft(this.root);
    }

    rotateRight() {
        this.root = LLRB.nRotRight(this.root);
    }

    static nDisplay(node) {
        if (node == null) {
            return "[empty node]";
        } else {
            return `${node.value}`;
        }
    }

    static nNodes(node, x, y, a, b) {
        if (node == null) {
            return [];
        } else {
            let nodes = [
                {
                    value: this.nDisplay(node),
                    origX: x,
                    origY: y,
                    x,
                    y,
                    red: node.red
                }
            ];
            nodes = nodes.concat(this.nNodes(node.left, x - a, y + b, a / 1.2, b));
            nodes = nodes.concat(this.nNodes(node.right, x + a, y + b, a / 1.2, b));
            return nodes;
        }
    }

    static nLinks(node) {
        if (node == null) {
            return [];
        } else {
            let links = [];
            if (node.left != null) {
                links.push({
                    source: this.nDisplay(node),
                    target: this.nDisplay(node.left)
                });
            }
            if (node.right != null) {
                links.push({
                    source: this.nDisplay(node),
                    target: this.nDisplay(node.right)
                });
            }
            links = links.concat(this.nLinks(node.left));
            links = links.concat(this.nLinks(node.right));
            return links;
        }
    }

    nodes(x, y, a, b) {
        return LLRB.nNodes(this.root, x, y, a, b)
    }

    links() {
        return LLRB.nLinks(this.root)
    }
}