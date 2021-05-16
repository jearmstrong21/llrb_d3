class BST {
    constructor() {
        this.empty = true;
    }

    add(value) {
        if (this.empty) {
            this.empty = false;
            this.value = value;
            this.left = new BST();
            this.right = new BST();
        } else {
            if (value < this.value) {
                this.left.add(value);
            } else {
                this.right.add(value);
            }
        }
    }

    set(value, left, right) {
        this.empty = false;
        this.value = value;
        this.left = left;
        this.right = right;
    }

    display() {
        if (this.empty) {
            return `empty node`;
        } else {
            return `${this.value}`;
        }
    }

    contains(value) {
        if (this.empty) {
            return false;
        } else {
            return this.value === value || this.left.contains(value) || this.right.contains(value);
        }
    }

    rotateLeft() {
        if (this.right.empty) {
            alert("Cannot rotate left");
        } else {
            let A = this.left;
            let B = this.right.left;
            let C = this.right.right;

            let P = this.value;
            let Q = this.right.value;

            let newP = new BST();
            newP.set(P, A, B);
            this.set(Q, newP, C);
        }
    }

    rotateRight() {
        if (this.left.empty) {
            alert("Cannot rotate right");
        } else {
            let A = this.left.left;
            let B = this.left.right;
            let C = this.right;

            let P = this.left.value;
            let Q = this.value;

            let newQ = new BST();
            newQ.set(Q, B, C);
            this.set(P, A, newQ);
        }
    }

    nodes(x, y, a, b) {
        if (this.empty) {
            return [];
        } else {
            let nodes = [
                {
                    value: this.display(),
                    origX: x,
                    origY: y,
                    x,
                    y
                }
            ];
            nodes = nodes.concat(this.left.nodes(x - a, y + b, a / 1.2, b));
            nodes = nodes.concat(this.right.nodes(x + a, y + b, a / 1.2, b));
            return nodes;
        }
    }

    links() {
        if (this.empty) {
            return [];
        } else {
            let links = [];
            if (!this.left.empty) {
                links.push({
                    source: this.display(),
                    target: this.left.display()
                });
            }
            if (!this.right.empty) {
                links.push({
                    source: this.display(),
                    target: this.right.display()
                });
            }
            links = links.concat(this.left.links());
            links = links.concat(this.right.links());
            return links;
        }
    }
}