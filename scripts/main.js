import { selectionSort } from "./selectionSort.js";

const dataSizeInput = document.getElementById("dataSize");
let stopSorting = false;

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

    console.debug("Graph drawn");
}

/**
 * Print either the current or previous report
 * @param {string} reportType Dictates the report type. Either "current" or "previous"
 * @param {*} report report data, only needed for previous report
 */
function printReport(reportType = "current") {
    let previousReport = null;
    if (reportType === "previous") {
        previousReport = JSON.parse(localStorage.getItem("report"));
        console.debug("Previous report found: ", previousReport);
    }

    // Get elements to fill with report data
    const algorithmElement =
        reportType === "current"
            ? document.getElementById("algorithmReportCurrent")
            : document.getElementById("algorithmReportPrevious");
    const calculationsElement =
        reportType === "current"
            ? document.getElementById("calculationsReportCurrent")
            : document.getElementById("calculationsReportPrevious");
    const delayElement =
        reportType === "current"
            ? document.getElementById("delayReportCurrent")
            : document.getElementById("delayReportPrevious");

    // Fill elements with report data
    algorithmElement.innerHTML =
        reportType === "current"
            ? document.getElementById("algorithmType").value
            : previousReport[0];
    calculationsElement.innerHTML =
        reportType === "current"
            ? `0 / ${data.length}`
            : `${previousReport[1]} / ${previousReport[2]}`;
    delayElement.innerHTML =
        reportType === "current"
            ? `${document.getElementById("delay").value}ms`
            : `${previousReport[3]}ms`;

    console.debug("Report printed: ", reportType);
}

/**
 * Redraw the graph when the data size input changes
 * @param {*} event The event object that is used to prevent default behavior
 */
function dataSizeInputHandler(event) {
    const newValue = event.target.value;
    console.debug("Data size changed: ", newValue);
    data = fillAndShuffleData(newValue);
    drawGraph(data);
    changeButtonState("submit", "enable");
}

/**
 * Handler to stop the sorting process
 * @param {*} event The event object that is used to prevent default behavior
 */
function stopButtonHandler(event) {
    event.preventDefault();
    console.debug("Stop button clicked");
    stopSorting = true;
}

/**
 * Handler to reshuffle the data
 * @param {*} event The event object that is used to prevent default behavior
 */
function reshuffleButtonHandler(event) {
    event.preventDefault();
    console.debug("Reshuffle button clicked");
    data = fillAndShuffleData(dataSizeInput.value);
    drawGraph(data);
    changeButtonState("submit", "enable");
}

/**
 * Enable or disable the specified button
 * @param {*} buttonType Either "submit" or "stop"
 * @param {*} state Either "enable" or "disable"
 */
function changeButtonState(buttonType = "submit", state = "enable") {
    const button = document.getElementById(buttonType + "Button");

    if (state === "enable") {
        button.disabled = false;
        button.classList.remove("opacity-50", "cursor-not-allowed");
        button.classList.add("customHover");
    } else if (state === "disable") {
        button.disabled = true;
        button.classList.add("opacity-50", "cursor-not-allowed");
        button.classList.remove("customHover");
    }

    if (buttonType === "submit") {
        submitButton.value = state === "enable" ? "Sort!" : "Sorting...";
    }

    console.debug(`${buttonType} button ${state}d`);
}

/**
 * Enable or disable the form elements
 * @param {string} state Either "enable" or "disable"
 */
function changeFormState(state = "enable") {
    document.getElementById("dataSize").disabled =
        state === "disable" ? true : false;
    document.getElementById("delay").disabled =
        state === "disable" ? true : false;
    document.getElementById("algorithmType").disabled =
        state === "disable" ? true : false;

    console.debug(`Form ${state}d`);
}

/**
 * The handler for the submit button. Starts the sorting proccess
 * @param {*} event The event object that is used to prevent default behavior
 */
async function submitButtonHandler(event) {
    event.preventDefault();
    console.debug("Sort button clicked");
    stopSorting = false;

    // Print reports
    if (localStorage.getItem("report")) printReport("previous");
    printReport("current");

    // Change button states
    changeButtonState("submit", "disable");
    changeButtonState("stop", "enable");
    changeButtonState("reshuffle", "disable");

    // Disable form elements
    changeFormState("disable");

    // Start sorting
    let report = null;

    switch (document.getElementById("algorithmType").value) {
        case "selectionSort":
            report = await selectionSort(
                data,
                document.getElementById("delay").value,
                () => stopSorting
            );
            break;
        default:
            console.error("Invalid algorithm type selected");
            break;
    }

    console.debug("Sorting finished: ", report);
    localStorage.setItem("report", JSON.stringify(report));

    // Change button states
    changeButtonState("stop", "disable");
    changeButtonState("reshuffle", "enable");
    document.getElementById("submitButton").value = "Sorted!";

    // Enable form elements
    changeFormState("enable");
}

// Draw graph on page load
let data = fillAndShuffleData(dataSizeInput.value);
drawGraph(data);

// Print previous report if needed
if (localStorage.getItem("report")) printReport("previous");

// Data size input element
dataSizeInput.addEventListener("input", (event) => dataSizeInputHandler(event));

// Stop button
const stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", stopButtonHandler);

// Reshuffle button
const reshuffleButton = document.getElementById("reshuffleButton");
reshuffleButton.addEventListener("click", (event) =>
    reshuffleButtonHandler(event)
);

// Sort button
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", (event) => submitButtonHandler(event));
