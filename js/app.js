function validatePhoneInput(input) {
    input.value = input.value.replace(/\D/g, '');
}

// City and street dropdowns
const cityToStreets = {
    "Tel Aviv": ["Allenby St.", "King George St.", "Dizengoff St."],
    "Jerusalem": ["Yafo St.", "Ben Yehuda St.", "Rothschild Blvd."],
    "Haifa": ["Hertzel St.", "Ben Gurion St.", "HaShlosha St."],
    "Eilat": ["Hativat Golani St.", "HaMelah St.", "Haatzmaut St."]
};

const citySelect = document.getElementById('customerCity');
const streetSelect = document.getElementById('customerStreet');
const newCityInput = document.getElementById('newCityInput');
const newStreetInput = document.getElementById('newStreetInput');

// Event listener for city selection
citySelect.addEventListener('change', function () {
    const city = this.value;

    if (city === "Other") {
        newCityInput.style.display = 'block';
    } else {
        newCityInput.style.display = 'none';
        populateStreets(city);
    }
});

streetSelect.addEventListener('change', function () {
    if (this.value === "Other") {
        newStreetInput.style.display = 'block';
    } else {
        newStreetInput.style.display = 'none';
    }
});

function populateStreets(city) {
    const streets = cityToStreets[city] || [];
    streetSelect.innerHTML = '<option value="">Select Street</option>';
    streets.forEach(street => {
        const option = document.createElement('option');
        option.value = street;
        option.textContent = street;
        streetSelect.appendChild(option);
    });
    streetSelect.appendChild(new Option("Other", "Other"));
}

function addNewCity() {
    const newCity = document.getElementById('newCity').value.trim();
    if (newCity) {
        citySelect.appendChild(new Option(newCity, newCity));
        cityToStreets[newCity] = [];
        newCityInput.style.display = 'none';
        document.getElementById('newCity').value = '';
        populateStreets(newCity);
    }
}

function addNewStreet() {
    const newStreet = document.getElementById('newStreet').value.trim();
    if (newStreet) {
        streetSelect.appendChild(new Option(newStreet, newStreet));
        const selectedCity = citySelect.value;
        cityToStreets[selectedCity].push(newStreet);
        newStreetInput.style.display = 'none';
        document.getElementById('newStreet').value = '';
    }
}

let sectionCount = 1;

// Function to handle repair type selection and show/hide custom work type input
function handleRepairTypeChange(sectionId) {
    const repairType = document.getElementById(`repairType${sectionId}`).value;
    const customWorkTypeDiv = document.getElementById(`customWorkTypeDiv${sectionId}`);

    // Show custom input if "Other" is selected, otherwise hide it
    if (repairType === 'Other') {
        customWorkTypeDiv.style.display = 'block';
    } else {
        customWorkTypeDiv.style.display = 'none';
    }
}

// Function to add a new work section dynamically
function addNewWorkSection() {
    sectionCount++;
    const workSectionsDiv = document.getElementById('workSections');
    
    // Create a new section
    const newSection = document.createElement('div');
    newSection.className = 'work-section';
    newSection.id = `workSection${sectionCount}`;
    newSection.innerHTML = `
        <h2>Preparatory Works - Section ${sectionCount}</h2>
        <div class="form-section-icon">
            <label for="repairType${sectionCount}">Select Repair Work:</label>
            <select id="repairType${sectionCount}" onchange="handleRepairTypeChange(${sectionCount})">
                <option value="">Choose Work Type</option>
                <option value="Dismantling Block Walls">Dismantling Block Walls</option>
                <option value="Painting">Painting</option>
                <option value="Tiling">Tiling</option>
                <option value="Other">Other</option>
            </select>

            <!-- Custom work type input, initially hidden -->
            <div id="customWorkTypeDiv${sectionCount}" style="display: none;">
                <label for="customWorkType${sectionCount}">Specify Work Type:</label>
                <input type="text" id="customWorkType${sectionCount}" name="customWorkType${sectionCount}" placeholder="Enter custom work type">
            </div>

            <label for="area${sectionCount}">Square Meters:</label>
            <input type="number" id="area${sectionCount}" name="area${sectionCount}" value="" oninput="calculateCost()" required>

            <label for="cost${sectionCount}">Cost per Square Meter (ILS):</label>
            <input type="number" id="cost${sectionCount}" name="cost${sectionCount}" value="" oninput="calculateCost()" required>
            
            <label for="workCost${sectionCount}">Work Cost (ILS):</label>
            <input type="number" id="workCost${sectionCount}" name="workCost${sectionCount}" readonly>

            <!-- Delete Button for the Section -->
            <button class="sectionDelBtn" onclick="deleteWorkSection(${sectionCount})">Delete Section</button>
        </div>
    `;
    
    // Append the new section to the container
    workSectionsDiv.appendChild(newSection);
}

// Function to delete a work section dynamically
function deleteWorkSection(sectionId) {
    const sectionToDelete = document.getElementById(`workSection${sectionId}`);
    sectionToDelete.remove();
    calculateCost(); // Recalculate total cost after deletion
}

// Calculate total cost for all sections
function calculateCost() {
    let totalCost = 0;
    const sections = document.getElementsByClassName('work-section');
    for (let section of sections) {
        const area = parseFloat(section.querySelector('input[id^="area"]').value);
        const cost = parseFloat(section.querySelector('input[id^="cost"]').value);
        const workCostInput = section.querySelector('input[id^="workCost"]');

        if (!isNaN(area) && !isNaN(cost)) {
            const workCost = area * cost;
            workCostInput.value = workCost.toFixed(2);
            totalCost += workCost;
        }
    }

    document.getElementById('totalCost').value = totalCost.toFixed(2);
}

// Print results in result section
function printResult() {
    const resultContainer = document.getElementById('resultChoase');
    resultContainer.innerHTML = '';
    const sections = document.getElementsByClassName('work-section');
    let totalCost = 0;

    for (let section of sections) {
        const workType = section.querySelector('select').value;
        const area = section.querySelector('input[id^="area"]').value;
        const cost = section.querySelector('input[id^="cost"]').value;
        const workCost = section.querySelector('input[id^="workCost"]').value;

        if (workType && area && cost && workCost) {
            const workDetails = document.createElement('div');
            workDetails.classList.add('work-details');
            workDetails.innerHTML = `
                <p><strong>Work Type:</strong> ${workType}</p>
                <p><strong>Area:</strong> ${area} m²</p>
                <p><strong>Cost per m²:</strong> ${cost} ILS</p>
                <p><strong>Work Cost:</strong> ${workCost} ILS</p>
            `;
            resultContainer.appendChild(workDetails);

            totalCost += parseFloat(workCost);
        }
    }

    const totalCostElement = document.createElement('div');
    totalCostElement.classList.add('total-cost');
    totalCostElement.innerHTML = `<h3>Total Cost: ${totalCost.toFixed(2)} ILS</h3>`;
    resultContainer.appendChild(totalCostElement);
}
