import { selectionSort } from "./selectionSort.js";

/**
 * Fill and shuffle an array of data
 * @param {int} dataSize Size of the array to be filled and shuffled
 * @returns Shuffled array of numbers from 1 to dataSize
 */
function fillAndShuffleData(dataSize) {
    let data = [];

    // Fill array
    for (let i = 1; i <= dataSize; i++) {
        data.push(i);
    }

    // Shuffle array
    let currentIndex = data.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [data[currentIndex], data[randomIndex]] = [
            data[randomIndex],
            data[currentIndex],
        ];
    }

    console.debug("Data shuffled: ", data);
    return data;
}

/**
 * Draw the graph on the canvas
 * @param {array} data Shuffled array of numbers
 */
function drawGraph(data) {
    const canvas = document.getElementById("canvas");
    canvas.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const column = document.createElement("div");
        column.classList.add("rounded", "rounded-b-none", "bg-slate-600");
        column.style.height = `${(data[i] / data.length) * 100}%`;
        column.style.width = `${100 / data.length}%`;
        column.id = `column-${data[i]}`;

        canvas.appendChild(column);
    }
}

/**
 * Print a report of the current graph on the current report element except for time calculation
 */
function printCurrentReport() {
    // Algorithm type
    const algorithmElement = document.getElementById("algorithmReportCurrent");
    algorithmElement.innerHTML = document.getElementById("algorithmType").value;

    // Data size
    const dataSizeElement = document.getElementById("dataSizeReportCurrent");
    dataSizeElement.innerHTML = dataSizeInput.value;

    // Delay
    const delayElement = document.getElementById("delayReportCurrent");
    delayElement.innerHTML = document.getElementById("delay").value;
}

/**
 * Print a report of the previous graph on the previous report element
 */
function printPreviousReport() {
    if (localStorage.getItem("report")) {
        const previousReport = JSON.parse(localStorage.getItem("report"));
        console.debug("Previous report found: ", previousReport);

        // Algorithm type
        const algorithmElement = document.getElementById(
            "algorithmReportPrevious"
        );
        algorithmElement.innerHTML = previousReport[0];

        // Data size
        const dataSizeElement = document.getElementById(
            "dataSizeReportPrevious"
        );
        dataSizeElement.innerHTML = previousReport[1];
        const delayElement = document.getElementById("delayReportPrevious");
        delayElement.innerHTML = previousReport[2];

        // Update report
        const timeElement = document.getElementById("timeReportPrevious");
        timeElement.innerHTML = `${previousReport[3]}s`;
    }
}

const dataSizeInput = document.getElementById("dataSize");

/* Draw graph on page load */
let data = fillAndShuffleData(dataSizeInput.value);
drawGraph(data);

/* Print previous report if needed */
printPreviousReport();

/* Data size input element */
dataSizeInput.addEventListener("input", (event) => {
    const newValue = event.target.value;
    console.debug("Data size changed: ", newValue);
    data = fillAndShuffleData(newValue);
    drawGraph(data);
});

/* Sort button */
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    /* Print reports */
    printPreviousReport();
    printCurrentReport();

    // Disable form elements
    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;
    submitButton.value = "Sorting...";
    submitButton.classList.add("opacity-50", "cursor-not-allowed");
    submitButton.classList.remove("customHover");

    document.getElementById("dataSize").disabled = true;
    document.getElementById("delay").disabled = true;
    document.getElementById("algorithmType").disabled = true;

    // Selection sort
    let report = await selectionSort(
        data,
        document.getElementById("delay").value
    );

    console.debug("Sorting finished: ", report);
    localStorage.setItem("report", JSON.stringify(report));

    // Enable form elements
    document.getElementById("dataSize").disabled = false;
    document.getElementById("delay").disabled = false;
    document.getElementById("algorithmType").disabled = false;
});
