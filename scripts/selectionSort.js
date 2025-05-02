/**
 * Selection Sort sorts an array by taking the lowest number from the unsorted part and puts it at the end of the sorted part
 * @param {array} data Shuffled array of numbers
 * @param {number} delayMS Delay in milliseconds between each step of the algorithm
 * @param {function} stopSorting Function to stop the sorting process
 * @returns {array} Array with report data
 */
export async function selectionSort(
    data,
    delayMS = 100,
    shouldStop = () => false
) {
    console.debug("Selection sort started");

    let calculations = 0;

    for (let i = 0; i < data.length; i++) {
        let smallestNumberIndex = i;

        // Stop the algorithm if the stop button is pressed
        if (shouldStop()) {
            console.debug("Selection sort stopped");
            return [
                document.getElementById("algorithmType").value,
                calculations,
                document.getElementById("dataSize").value,
                document.getElementById("delay").value,
            ];
        }

        // Find the smallest number
        for (let ii = i + 1; ii < data.length; ii++) {
            if (data[ii] < data[smallestNumberIndex]) {
                smallestNumberIndex = ii;
            }
        }

        let currentNumber = data[i];

        // Swap the smallest number with the first unsorted number
        if (smallestNumberIndex !== i) {
            // Store original values before swapping
            const firstValue = currentNumber;
            const smallestValue = data[smallestNumberIndex];

            // Swap the values in the data array
            [currentNumber, data[smallestNumberIndex]] = [
                data[smallestNumberIndex],
                currentNumber,
            ];

            // Update the elements with their new heights
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

        // Wait for a specified amount of time
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, delayMS);
        });

        calculations += 1;

        // Update report
        const calculationsElement = document.getElementById(
            "calculationsReportCurrent"
        );
        calculationsElement.innerHTML = `${calculations} / ${data.length}`;
    }

    // Return report data
    return [
        document.getElementById("algorithmType").value,
        calculations,
        document.getElementById("dataSize").value,
        document.getElementById("delay").value,
    ];
}
