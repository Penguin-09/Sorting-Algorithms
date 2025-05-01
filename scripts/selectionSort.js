/**
 * Selection Sort sorts an array by taking the lowest number from the unsorted part and puts it at the end of the sorted part
 * @param {array} data Shuffled array of numbers
 * @param {number} delayMS Delay in milliseconds between each step of the algorithm
 * @returns {array} Array with report data
 */
export async function selectionSort(data, delayMS = 100) {
    console.debug("Selection sort started");

    let timeElapsed = 0;

    for (let i = 0; i < data.length; i++) {
        let smallestNumberIndex = i;

        // Find the smallest number
        for (let ii = i + 1; ii < data.length; ii++) {
            if (data[ii] < data[smallestNumberIndex]) {
                smallestNumberIndex = ii;
            }
        }

        const smallestNumber = data[smallestNumberIndex];

        // Swap the smallest number with the first unsorted number
        if (smallestNumberIndex !== i) {
            // Store original values before swapping
            const firstValue = data[i];
            const smallestValue = data[smallestNumberIndex];

            // Swap the values in the data array
            [data[i], data[smallestNumberIndex]] = [
                data[smallestNumberIndex],
                data[i],
            ];

            // Update the DOM elements with their new heights
            const firstColumn = document.getElementById(`column-${firstValue}`);
            const smallestColumn = document.getElementById(
                `column-${smallestValue}`
            );

            // Update heights
            firstColumn.style.height = `${
                (smallestValue / data.length) * 100
            }%`;
            smallestColumn.style.height = `${
                (firstValue / data.length) * 100
            }%`;

            // Update IDs to match their new values
            firstColumn.id = `column-${smallestValue}`;
            smallestColumn.id = `column-${firstValue}`;
        }

        // Wait 100 ms
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, delayMS);
        });

        timeElapsed += parseInt(delayMS);

        // Update report
        const timeElement = document.getElementById("timeReportCurrent");
        timeElement.innerHTML = `${timeElapsed / 1000}s`;
    }

    // Enable sort button
    submitButton.disabled = false;
    submitButton.value = "Sort!";
    submitButton.classList.remove("opacity-50", "cursor-not-allowed");
    submitButton.classList.add("customHover");

    return [
        document.getElementById("algorithmType").value,
        document.getElementById("dataSize").value,
        document.getElementById("delay").value,
        timeElapsed / 1000,
    ];
}
