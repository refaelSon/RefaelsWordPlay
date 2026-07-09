let words;
let text = "blade";
let word = text.toUpperCase();
let history = [];

let row = 0;
let col = 0;
let jibCount = 0;
const game = document.getElementById("game_container");
const snackBar = document.getElementById("snackbar");
let share = '';

//d

init();
console.log(document.getElementById("score"));

// const score;
// const erors;d



let gameOver = false;
let win = false;

let green = "rgb(88, 129, 87)", yellow = "rgb(160, 127, 26)", gray = "rgb(73, 80, 87)";










async function init() {
    words = await getWordList();
    word = await getRandomWord();
    console.log("Random word:", word);









    fetch("winWindo.html")
        .then(r => r.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);

            // נותן לדפדפן זמן לעדכן את ה‑DOM
            requestAnimationFrame(() => {
                const score = document.getElementById("score");
                const erors = document.getElementById("erors");

                // console.log("FOUND:", score, erors);
            });
        });



}

async function getWordList() {
    const res = await fetch("wordlist_fives.txt");
    const text = await res.text();
    const words = text.split(/\r?\n/).filter(w => w.trim() !== "");


    return words;


}

async function getRandomWord() {


    const random = await words[Math.floor(Math.random() * words.length)];

    return random.toUpperCase();
}



document.addEventListener("keydown", function (event) {
    getInput(event);

});


function getInput(e) {
    // console.log("הוקלד:", e.key);
    let key = e.key;
    if (gameOver)
        console.log("you cant play' game over");


    else if (key === "Backspace")
        del();

    else if (key === "Enter") {
        checkWord();

    }

    else if (col != 5 && isAlphabetic(key)) {

        key = key.toUpperCase();

        let curent_box = game.children[row].children[col];
        if (curent_box.value === "") {
            curent_box.value = key;
            step();
        }
    }



}



function presKey(key) {
    const down = new KeyboardEvent("keydown", { key });
    document.dispatchEvent(down);

    setTimeout(() => {
        const up = new KeyboardEvent("keyup", { key });
        document.dispatchEvent(up);
    }, 50);
}


function step() {
    if (col != 5)
        col++;

}
function del() {
    if (col != 0) {
        col--;
        let curent_box = game.children[row].children[col];
        curent_box.value = '';
    }
}

function checkWord() {
    if (col == 5) {
        //האם המילה קיימת
        let temp = "";
        for (let i = 0; i < 5; i++) {
            const curent_box = game.children[row].children[i];
            temp += curent_box.value;

        }

        if (history.includes(temp)) {
            msg(' You have already tried this!');
            return;
        }
        else if (!words.includes(temp.toLowerCase())) {
            msg('The word is not in the word list');
            jibCount++;
            return;
        }



        const counts = {};
        for (let ch of word) {
            counts[ch] = (counts[ch] || 0) + 1;
        }

        // for (let ch in counts) {
        //     console.log(ch, counts[ch]);
        // }


        //בדיקת ירוקים
        for (let i = 0; i < 5; i++) {
            const curent_box = game.children[row].children[i];
            let curent_btn = document.getElementById(curent_box.value);
            if (word.charAt(i) == curent_box.value) {
                curent_box.style.backgroundColor = green;
                curent_btn.style.backgroundColor = green;
                counts[curent_box.value]--;
                share += '🟢';

            }
        }
        //בדיקה שחורים צהובים
        for (let i = 0; i < 5; i++) {
            const curent_box = game.children[row].children[i];
            let curent_btn = document.getElementById(curent_box.value);
            if (curent_box.style.backgroundColor != green && word.includes(curent_box.value) && counts[curent_box.value] > 0) {
                curent_box.style.backgroundColor = yellow;
                if (curent_btn.style.backgroundColor !== green) {

                    curent_btn.style.backgroundColor = yellow;

                }
                counts[curent_box.value]--;
                share += '🟡';

            }
            else if (curent_box.style.backgroundColor != green) {
                curent_box.style.backgroundColor = gray;
                if (curent_btn.style.backgroundColor !== green && curent_btn.style.backgroundColor !== yellow) {

                    curent_btn.style.backgroundColor = gray;

                }
                share += '⚫';

            }

        }







        // for (let i = 0; i < 5; i++) {

        //     const curent_box = game.children[row].children[i];
        //     let curent_btn = document.getElementById(curent_box.value);
        //     if (word.charAt(i) == curent_box.value) {
        //         curent_box.style.backgroundColor = green;
        //         curent_btn.style.backgroundColor = green;
        //         share += '🟢';
        //     }
        //     else if (word.includes(curent_box.value)) {
        //         curent_box.style.backgroundColor = yellow;
        //         if (curent_btn.style.backgroundColor !== green) {

        //             curent_btn.style.backgroundColor = yellow;

        //         }
        //         share += '🟡';

        //     }

        //     else {
        //         curent_box.style.backgroundColor = gray;
        //         curent_btn.style.backgroundColor = gray;
        //         share += '⚫';

        //     }

        // }
        history[history.length] = temp;
        row++;
        col = 0;
        share += '\n';



        if (temp === word) {
            winSequ();
        }
        else if (row == 6) {
            snackBar.textContent = word;
            snackBar.className = "show";
            gameOver = true;




        }


    }
    else {
        msg('The word is not long enough');
    }



}

function winSequ() {
    snackBar.textContent = "You won!";
    snackBar.className = "show";
    win = true;
    gameOver = true;
    score.textContent = (row) + "/6";
    erors.textContent = jibCount;

    const today = new Date().toLocaleDateString();
    console.log(today);

    share = "word play " + today + "\n" + share;
    console.log(share);




    document.getElementById("btnMenu").style.display = "flex";
    openModal();


}



function isAlphabetic(str) {
    if (str.length != 1)
        return false;

    return (/^[A-Za-z]+$/.test(str));
}

function msg(str) {


    // Add the "show" class to DIV
    snackBar.textContent = str;
    snackBar.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { snackBar.className = snackBar.className.replace("show", ""); }, 3000);
}

function openModal() {
    document.getElementById("overlay").style.display = "flex";
}

function closeModal() {
    document.getElementById("overlay").style.display = "none";
}
function copyRes() {


    navigator.clipboard.writeText(share);
}


