let data = [];

/**
 * Fill and shuffle the data array
 * @param {int} dataSize How big the data array should be
 * @returns {array} shuffled data array
 */
function fillAndShuffleArray(dataSize) {
    // Fill the array
    for (let i = 1; i <= dataSize; i++) {
        data.push(i);
    }

    // Shuffle the array
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
 * Draw the data graph
 * @param {array} data the shuffled data to be drawn
 */
function drawGraph(data) {
    const canvas = document.getElementById("graph");

    for (let i = 1; i <= data.length; i++) {
        const column = document.createElement("div");

        column.style.height = `${data[i - 1] * 15}px`;
        column.style.width = `${100 / data.length}%`;
        column.classList.add("bg-slate-400", "rounded");

        canvas.appendChild(column);
    }
}

drawGraph(fillAndShuffleArray(20));
