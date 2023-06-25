// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const URL = "http://jservice.io/api/";
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const NUM_CLUES_PER_QUESTION = 1;

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let response = await axios.get('${URL} categories?count=6');
    let catIds = response.data.map (c => c.id);
    return NUM_CATEGORIES.sampleSize (catIds, NUM_CATEGORIES);
}


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    let response = await axios.get('${URL}category?id=${catId}');
    let cat = response.data;
    let allClues = cat.clues;
    let randomClues = _,samplesize (allClues, NUM_CLUES_PER_QUESTION);
    let clues = randomClues.map (c => ({
        question: c.question,
        answer: c.answer,
        showing: null,
    }));

    return {title: cat.title, clues};

}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    $('#jeopardy thead').epmty();
    let $tr = $("<tr>");
    for (let catIds = 0; catIds < NUM_CATEGORIES; catIds++){
        $tr.append($("<th>").text(categories[catIds].title));
    }
    $("#jeopardy thead").append($tr);

    $("#jeopardy tbody").empty();
    for (letclueIds = 0; clueIds < NUM_CLUES_PER_QUESTION; clueIds++){
        $tr.append($("<td>").attr("id", '${catIds} - ${clueIds}'.text("?")));
    }
    $("#jeopardy tbody").append($tr);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let id = evt.target.id;
    let [catId, clueId] = id.split("-");
    let clue = categories[catId].clues[clueId];

    let msg;

    if (!clue.showing) {
        msg = clue.question;
        clue.showing = "answer";
    }else {
        return
    }
    $('#${catId}-${clueId}').html(msg);
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    let catIds = await getCategoryIds();

    categories = [];

    for (let catId of catIds) {
        categories.push(await getCategory(catId));
    }
    fillTable();
}

/** On click of start / restart button, set up game. */

$("#restart").on("click", setupAndStart);

// TODO

/** On page load, add event handler for clicking clues */

$(async function () {
    setupAndStart();
    $("#jeopardy").on("click", "td", handleClick);
}
);

// TODO
