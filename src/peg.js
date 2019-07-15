const pegS = "⬤", empS = "‧";

class PegSolitaire {
    constructor() {
        this.boardIdx = 4;
        this.board;
        this.size;
        this.sel = null;
        this.undo = [];
        this.possibles = [];
        this.drawBoard();
        document.getElementById("back").addEventListener("click", () => {
            this.doUndo();
        });
        document.getElementById("next").addEventListener("click", () => {
            this.newBoard(1);
        });
        document.getElementById("prev").addEventListener("click", () => {
            this.newBoard(-1);
        });
        document.getElementById("reset").addEventListener("click", () => {
            this.drawBoard();
        });
    }

    newBoard(d) {
        this.boardIdx += d;
        const z = boards.length - 1;
        if(this.boardIdx < 0) this.boardIdx = z;
        if(this.boardIdx > z) this.boardIdx = 0;
        this.drawBoard();
    }

    doUndo() {
        if(this.undo.length < 1) return;
        const u = this.undo.pop();
        this.board[u.neu] = 0;
        this.board[u.first] = 1;
        this.board[u.del] = 1;
        if(this.sel) {
            document.getElementById(this.sel).className = "peg";
        }
        this.sel = null;
        const op = document.getElementById(u.first);
        op.innerHTML = pegS;
        op.className = "peg";
        const on = document.getElementById(u.neu);
        on.innerHTML = empS;
        on.className = "emp";
        const de = document.getElementById(u.del);
        de.innerHTML = pegS;
        de.className = "peg";
    }

    markPossibles() {
        this.possibles = [];
        let idx;
        const s = parseInt(this.sel),
        x = s % this.size, y = Math.floor(s / this.size);

        if(x > 1) {
            idx = x - 2 + y * this.size;
            if(this.board[idx] === 0 && this.board[idx + 1] === 1) this.possibles.push(idx);
        }
        if(x < this.size - 2) {
            idx = x + 2 + y * this.size;
            if(this.board[idx] === 0 && this.board[idx - 1] === 1) this.possibles.push(idx);
        }
        if(y > 1) {
            idx = x + (y - 2) * this.size;
            if(this.board[idx] === 0 && this.board[idx + this.size] === 1) this.possibles.push(idx);
        }
        if(y < this.size - 2) {
            idx = x + (y + 2) * this.size;
            if(this.board[idx] === 0 && this.board[idx - this.size] === 1) this.possibles.push(idx);
        }
    }

    select(s) {
        if(s) {
            document.getElementById(this.sel).classList.add("sel");
            this.markPossibles();
            for(let c = 0; c < this.possibles.length; c++) {
                document.getElementById(this.possibles[c]).classList.add("selZ");
            }
        } else {
            document.getElementById(this.sel).className = "peg";
            for(let c = 0; c < this.possibles.length; c++) {
                document.getElementById(this.possibles[c]).className ="emp";
            }
            this.sel = null;
        }
    }

    clicked(idx) {
        if(this.sel === null) {
            if(this.board[idx] === 1) {
                this.sel = idx;
                this.select(true);
            }
        } else {
            if(this.sel === idx) {
                this.select(false);
                this.sel = null;
                return;
            }

            if(this.board[idx] === 1) {
                this.select(false);
                this.sel = idx;
                this.select(true);
                return;
            }

            if(this.board[idx] === 0 && this.checkRule(idx)) {
                this.board[idx] = 1;
                this.board[this.sel] = 0;
                const np = document.getElementById(idx);
                np.innerHTML = pegS;
                np.className = "peg";
                const op = document.getElementById(this.sel);
                op.innerHTML = empS;
                op.className = "emp";
                this.deletePeg(idx);
                this.sel = null;
                for(let c = 0; c < this.possibles.length; c++) {
                    document.getElementById(this.possibles[c]).classList.remove("selZ");
                }
            }
        }
    }

    deletePeg(idx) {
        const p = (parseInt(this.sel) + parseInt(idx)) / 2;
        this.undo.push({
            first: this.sel,
            neu: idx,
            del: p
        });
        const e = document.getElementById(p);
        e.className = "emp";
        e.innerHTML = empS;
        this.board[p] = 0;
        for(let b = 0; b < this.board.length; b++) {
            if(this.board[b] === 1) return;
        }
        document.getElementById("go").style.display = "block";
    }

    checkRule(idx) {
        const dif = Math.abs(this.sel - idx);
        return !(dif !== this.size * 2 && dif !== 2);
    }

    drawBoard() {
        document.getElementById("go").style.display = "none";
        const b = document.getElementById("board");
        while(b.childElementCount) {
            b.removeChild(b.childNodes[0]);
        }
        this.board = [];
        this.undo = [];
        this.size = sizes[this.boardIdx];
        const str = boards[this.boardIdx];
        let idx = 0, cls, inn;
        b.style.width = b.style.height = this.size * 54 + this.size * 2 + "px";
        for(let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let click = true;
                switch(str[idx]) {
                    case "0": 
                        click = false;
                        this.board[idx] = -1;
                        cls = "inv";
                        inn = empS
                    break;
                    case "1":
                    this.board[idx] = 1;
                        cls = "peg";
                        inn = pegS;
                    break;
                    case "2":
                        this.board[idx] = 0;
                        cls = "emp";
                        inn = empS
                    break;
                }
                const div = document.createElement("div");
                div.className = cls;
                div.id = idx;
                div.innerHTML = inn;
                if(click) div.addEventListener("click", (e) =>{
                    this.clicked(div.id);
                }, false);
                b.appendChild(div);
                idx++;
            }
        }
    }
}

function start() {
    const peg = new PegSolitaire();
}