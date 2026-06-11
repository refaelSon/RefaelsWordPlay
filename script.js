let words;
let text = "blade";
let word = text.toUpperCase();

let row = 0;
let col = 0;
const game = document.getElementById("game_container");
let gameOver = false;
let win = false;
//
let green = "rgb(88, 129, 87)", yellow = "rgb(160, 127, 26)", gray = "rgb(73, 80, 87)";






init();

async function init() {
    words = await getWordList();
    word = await getRandomWord();
    console.log("Random word:", word);

}

async function getWordList() {
    const res = await fetch("words.txt");
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
    console.log("הוקלד:", e.key);
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
        col = col - 1;
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
        console.log("word:", words.includes(temp.toLowerCase()));
        if (words.includes(temp.toLowerCase())) {





            for (let i = 0; i < 5; i++) {

                const curent_box = game.children[row].children[i];
                let curent_btn = document.getElementById(curent_box.value);
                if (word.charAt(i) == curent_box.value) {
                    curent_box.style.backgroundColor = green;
                    curent_btn.style.backgroundColor = green;
                }
                else if (word.includes(curent_box.value)) {
                    curent_box.style.backgroundColor = yellow;
                    if (curent_btn.style.backgroundColor !== green) {


                        curent_btn.style.backgroundColor = yellow;
                    }
                }

                else {
                    curent_box.style.backgroundColor = gray;
                    curent_btn.style.backgroundColor = gray;
                }





            }
            row++;
            col = 0;



            if (temp === word) {
                console.log("win!!")
                win = true;
                gameOver = true;
            }
            else if (row == 6) {
                console.log("lose :(")

                gameOver = true;

            }
        }

    }



}



function isAlphabetic(str) {
    if (str.length != 1)
        return false;

    return (/^[A-Za-z]+$/.test(str));
}



