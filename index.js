
class Spaces {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        this.len = 1;
        this.direction = "right";
        this.used = false;
    }
}

let findSpaces = (grid, minLength) => {

    let spaceList = [];
    let gLen = 10;

    // Horizantal scan
    for (let i = 0; i < gLen; i++) {
        for (let j = 0; j < gLen; j++) {
            let c = grid[i][j];
            if (c === '-') {
                let s = new Spaces(i, j);
                while (grid[i][++j] === '-') s.len++;

                if (s.len >= minLength) {
                    spaceList.push(s)
                }
            }

        }
    }

    //vertical scan
    for (let i = 0; i < gLen; i++) {
        for (let j = 0; j < gLen; j++) {
            let c = grid[j][i];
            if (c === '-') {
                let s = new Spaces(j, i);
                s.direction = "down";
                while (++j < gLen && grid[j][i] === '-') s.len++;

                if (s.len >= minLength) {
                    spaceList.push(s)
                }
            }

        }
    }
    return spaceList;
}


let isValidSpace = (grid, space, word) => {
    if (space.used === true) return false;

    for (let i = 0; i < space.len; i++) {
        if (space.direction === "right") {
            if (grid[space.r][space.c + i] !== word[i] && grid[space.r][space.c + i] !== "-")
                return false;
        } else {
            if (grid[space.r + i][space.c] !== word[i] && grid[space.r + i][space.c] !== "-")
                return false;
        }
    }

    return true;
}



let forward = (grid, space, word) => {
    let added_spaces = [];
    for (let i = 0; i < space.len; i++) {
        if (space.direction === "right") {
            if (grid[space.r][space.c + i] === "-") added_spaces.push([space.r, space.c + i])
            grid[space.r][space.c + i] = word[i];
        } else {
            if (grid[space.r + i][space.c] === "-") added_spaces.push([space.r + i, space.c])
            grid[space.r + i][space.c] = word[i];
        }
    }
    return added_spaces;
}

let backward = (grid, addedSpaces) => {
    for (let i = 0; i < addedSpaces.length; i++) {
        let as = addedSpaces[i];
        grid[as[0]][as[1]] = '-';
    }
}


let solve = (grid, spaces, words) => {

    if (words.length === 0) {
        return true;
    }

    let w = words.shift();
    let possibleLocations = [];

    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i].len === w.length) {
            possibleLocations.push(spaces[i]);
        }
    }

    for (let i = 0; i < possibleLocations.length; i++) {
        let sp = possibleLocations[i];

        if (isValidSpace(grid, sp, w)) {
            sp.used = true;
            let added_spaces = forward(grid, sp, w);
            if (solve(grid, spaces, words)) return true;
            backward(grid, added_spaces);
            sp.used = false;
        }
    }
    words.push(w);
    return false;
}


let crosswordPuzzle = (crossword, words) => {

    let grid = [];
    for (let i = 0; i < crossword.length; i++) {
        grid.push(crossword[i].split(''))
    }
    words.sort((a, b) => { return b.length - a.length; })

    let spaces = findSpaces(grid, words[words.length - 1].length);

    solve(grid, spaces, words);

    let result = [];
    for (let i = 0; i < grid.length; i++) {
        result[i] = grid[i].join('');
    }
    return result;


}




let arr = [
    '++++++++++',
    '+------+++',
    '+++-++++++',
    '+++-++++++',
    '+++-----++',
    '+++-++-+++',
    '++++++-+++',
    '++++++-+++',
    '++++++-+++',
    '++++++++++']


let arr1 = ['+-++++++++',
    '+-++++++++',
    '+-++++++++',
    '+-----++++',
    '+-+++-++++',
    '+-+++-++++',
    '+++++-++++',
    '++------++',
    '+++++-++++',
    '+++++-++++']

let arr3 = ['XXXXXX-XXX',
    'XX------XX',
    'XXXXXX-XXX',
    'XXXXXX-XXX',
    'XXX------X',
    'XXXXXX-X-X',
    'XXXXXX-X-X',
    'XXXXXXXX-X',
    'XXXXXXXX-X',
    'XXXXXXXX-X']

console.log(crosswordPuzzle(arr, ["POLAND", "LHASA", "SPAIN", "INDIA"]));
console.log(crosswordPuzzle(arr1, ["LONDON", "DELHI", "ICELAND", "ANKARA"]));
console.log(crosswordPuzzle(arr3, ["ICELAND", "MEXICO", "PANAMA", "ALMATY"]));