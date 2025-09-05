function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn bg-[#edf7ff] rounded-md">${el}</span>`)
    return (htmlElements.join(" "))
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then((res) => res.json())
        .then((lessons) => displayLessons(lessons.data))
}
loadLessons()

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container")
    levelContainer.innerHTML = ""
    for (let lesson of lessons) {
        const btnDiv = document.createElement("div")
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="lesson-btn btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>
        `
        levelContainer.appendChild(btnDiv)
    }
}
// remove active button
const removeActive = () => {
    const lessonBtns = document.querySelectorAll(".lesson-btn")
    lessonBtns.forEach(lessonBtn => {
        lessonBtn.classList.remove("active")
    })
}
const loadLevelWord = (id) => {
    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive()
            const clickedBtn = document.getElementById(`lesson-btn-${id}`)
            clickedBtn.classList.add("active")
            displayLevelWords(data.data)
        })
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("nothing-lesson").classList.add("hidden");
    }
    else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("nothing-lesson").classList.remove("hidden");
    }
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url)
    const details = await res.json()
    displayWordDetail(details.data)
}
const displayWordDetail = (details) => {
    const detailsBox = document.getElementById("details-box")
    detailsBox.innerHTML = `
        <div class="space-y-2">
            <h2 class="text-2xl font-bold">Eager (<i class="fa-solid fa-microphone-lines"></i>:${details.word})</h2>
        </div>
        <div class="space-y-2">
            <h2 class="text-xl font-semibold">${details.meaning}</h2>
            <p class="text-lg">${details.pronunciation}</p>
        </div>
        <div class="space-y-2">
            <h2 class="text-xl font-semibold">Example</h2>
            <p class="text-[#000000] text-lg">${details.sentence}</p>
        </div>
        <div class="">
            <h2 class="text-2xl font-bold mb-2 hind-siliguri">সমার্থক শব্দ গুলো</h2>
            <div class="">${createElements(details.synonyms)}</div>
        </div>
    `
    document.getElementById("word_modal").showModal()

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
        manageSpinner(false)
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
                        <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]"><i class="fa-solid fa-circle-info"></i></button>
                        <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
            </div>
        `
        manageSpinner(false)
        wordContainer.appendChild(wordDiv)
    }
}

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive()
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWords = data.data
            const filterWords = allWords.filter((word) =>
                word.word.toLowerCase().includes(searchValue))
            displayLevelWords(filterWords)
        })

})
