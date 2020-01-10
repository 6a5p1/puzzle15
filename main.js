const N = 4;
class Puzzle15 {
    constructor() {
        this.el = document.createElement('div');
        this.el.classList.add('gsp');
        this.el.classList.add('puzzle15');
        this.reset();
    }
    reset() {
        this.init();
        this.shuffle();
        this.render();
    }
    init() {
        let start = 1;
        this.moves = 0;
        this.score = 15;
        this.history = [];
        this.m = Array(N);
        this.free = [N - 1, N - 1];
        for (let i = 0; i < N; i++) {
            this.m[i] = Array(N);
            for (let j = 0; j < N; j++) {
                if (start < N * N) {
                    this.m[i][j] = start++;
                }
            }
        }
    }
    undo() {
        let old = this.history.pop();
        if (!old) return;
        this.m = JSON.parse(old.m);
        this.free = JSON.parse(old.free);
        this.moves = old.moves;
        this.score = old.score;

        this.render();
    }
    shuffle() {
        let m, n, attempts = 100000;
        const DIR = [ [0, 1], [0, -1], [-1, 0], [1, 0] ];
        for (let i = 0; i < 1000; i++) {
            let k = this.free[0], l = this.free[1];
            do {
                let y = Math.round(Math.random() * 3 - 1) + 1;
                m = DIR[y][0];
                n = DIR[y][1];
            } while(attempts-- && (k + m > N - 1 || k + m < 0 || l + n > N - 1 || l + n < 0));
            let aux = this.m[k][l];
            this.m[k][l] = this.m[k + m][l + n];
            this.m[k + m][l + n] = aux;
            this.free = [k + m, l + n];
        }
    }
    onClick(event) {
        let el = event.target;
        let w = Array.from(event.target.parentNode.children).indexOf(event.target);
        let i = Math.floor(w / N);
        let j = w % N;
        if (this.moveAllowed(i, j)) {
            this.history.push({
                m: JSON.stringify(this.m),
                free: JSON.stringify(this.free),
                moves: this.moves,
                score: this.score
            });
            this.m[this.free[0]][this.free[1]] = this.m[i][j];
            this.m[i][j] = null;
            this.free = [i, j];
            this.moves++;
            this.render();
        }
    }
    moveAllowed(i, j) {
        return !(Math.abs(this.free[0] - i) + Math.abs(this.free[1] - j) != 1);
    }
    render() {
        let localScore = 15;
        let board = '', valid = true;
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                board += `<div data-val="${this.m[i][j] || ''}">${this.m[i][j] || ''}</div>`;
                if (this.m[i][j] != i * N + j + 1 && this.m[i][j]) {
                    valid = false;
                    localScore--;
                }
            }
        }
        this.score = localScore * 100 - this.moves;
        if (this.score < 0) this.score = 0;
        let content = `
            <div class="gsp-row gsp-header">
                <div class="gsp-1-3">
                    <div class="gsp-line">
                        <button class="puzzle15-new-game gsp-btn gsp-btn-double gsp-block">New game</button>
                    </div>
                    <div class="gsp-line">
                        <button class="puzzle15-undo gsp-btn gsp-block">Undo</button>
                    </div>
                </div>
                <div class="gsp-1-3">
                    <h1 class="gsp-title">Puzzle 15</h1>
                    <div class="gsp-subtitle">by 6a5p1</div>
                </div>
                <div class="gsp-1-3">
                    <div class="gsp-line">
                        <div class="gsp-score-wr gsp-btn-double gsp-btn gsp-block">Score: <br>${this.score}</div>
                    </div>
                    <div class="gsp-line">
                        <div class="gsp-btn gsp-block">Moves: ${this.moves}</div>
                    </div>
                </div>
            </div>
            <div class="gsp-board">${board}</div>`;
        this.el.innerHTML = content;

        this.el.querySelector('.gsp-board').addEventListener('click', this.onClick.bind(this));
        this.el.querySelector('.puzzle15-new-game').addEventListener('click', this.reset.bind(this));
        this.el.querySelector('.puzzle15-undo').addEventListener('click', this.undo.bind(this));

        this.el.classList.toggle('done', valid);
    }
}