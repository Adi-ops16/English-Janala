const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then((res) => res.json())
        .then((lessons) => displayLessons(lessons.data))
}

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container")
    levelContainer.innerHTML = ""
    for (let lesson of lessons) {
        const btnDiv = document.createElement("div")
        btnDiv.innerHTML = `
            <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>
        `
        levelContainer.appendChild(btnDiv)
    }
}

//lesson function call
loadLessons()
const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayLevelWords(data.data))
}

const displayLevelWords = (words) => {
    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML = ""
    if (words.length == 0) {
        wordContainer.innerHTML = `
            <div id="nothing-lesson" class="hind-siliguri bg-[#F8F8F8] py-16 px-7 rounded-3xl col-span-full">
                <div id="nothing-container" class="text-center col-span-full">
                    <img class="mx-auto" src="./assets/alert-error.png">
                    <p class="text-sm mb-3 font-light text-[#79716b]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
                    </p>
                    <h1 class="text-3xl font-medium">নেক্সট Lesson এ যান</h1>
                </div>
        `
        return
    }
    for (let word of words) {
        const wordDiv = document.createElement("div")
        wordDiv.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center px-5 py-10">
                <h2 class="text-2xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h2>
                <p class="my-3">Meaning / Pronunciation</p>
                <div class="text-2xl text-[#18181B] font-semibold mb-10">${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায় নি"}</div>
                    <div class="flex justify-between">
                        <button class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]"><i class="fa-solid fa-circle-info"></i></button>
                        <button class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
            </div>
        `
        wordContainer.appendChild(wordDiv)
    }
}