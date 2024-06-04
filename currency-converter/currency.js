document.addEventListener("DOMContentLoaded", function () {
    // Load currency options and set default currencies
    loadCurrencyOptions()
        .then(() => {
            // Set default currencies
            document.getElementById("sourceCurrency").value = "gbp";
            document.getElementById("destinationCurrency").value = "ngn";

            // Manually trigger change events for the default currencies
            document.getElementById("sourceCurrency").dispatchEvent(new Event("change"));
            document.getElementById("destinationCurrency").dispatchEvent(new Event("change"));

            // Set default amount of transaction
            document.getElementById("sourceAmount").value = "1";

            // Update conversion on page load
            updateConversion();
        })
        .catch(error => console.error("Error loading currency options:", error));
});

function loadCurrencyOptions() {
    return new Promise((resolve, reject) => {
        Promise.all([
            fetch("https://www.floatrates.com/daily/eur.json").then(response => response.json()),
            fetch("countries.json").then(response => response.json())
        ])
        .then(data => {
            const currencyData = data[0];
            const countriesData = data[1];

            const currencyOptions = Object.keys(currencyData);

            // Add currency options to the dropdowns
            currencyOptions.forEach(currency => {
                const option1 = document.createElement("option");
                option1.value = currency;
                option1.textContent = currency;

                const option2 = document.createElement("option");
                option2.value = currency;
                option2.textContent = currency;

                document.getElementById("sourceCurrency").appendChild(option1);
                document.getElementById("destinationCurrency").appendChild(option2);
            });

            // Update flag images based on the selected currencies
            document.getElementById("sourceCurrency").addEventListener("change", function () {
                const selectedCurrency = this.value;
                const flagUrl = getFlagUrl(selectedCurrency, countriesData);
                document.getElementById("sourceFlag").src = flagUrl;
            });

            document.getElementById("destinationCurrency").addEventListener("change", function () {
                const selectedCurrency = this.value;
                const flagUrl = getFlagUrl(selectedCurrency, countriesData);
                document.getElementById("destinationFlag").src = flagUrl;
            });

            resolve(); // Resolve the promise once currency options are loaded
        })
        .catch(error => reject(error)); // Reject the promise if there's an error during the loading process
    });
}


function getFlagUrl(currencyCode, countriesData) {
    const country = countriesData.find(country => country.currency.toLowerCase() === currencyCode);
    return country ? country.flag : '';
}


// function to updateConversion
function updateConversion() {
    const sourceCurrency = document.getElementById("sourceCurrency").value;
    const destinationCurrency = document.getElementById("destinationCurrency").value;
    const sourceAmount = parseFloat(document.getElementById("sourceAmount").value) || 0;
    // Define upper limit
    const upperLimit = 1000000;

    // Update upper limit info on the page
    document.getElementById("upperLimitInfo").textContent = `Upper Limit for Source Amount: ${sourceCurrency} ${upperLimit.toFixed(2)}`;

    // Check if the source amount is zero or negative
     if (sourceAmount <= 0 || isNaN(sourceAmount)) {
        document.getElementById("error").textContent = "Error: Please enter a valid source amount";
        // Clear the conversion details
        document.getElementById("exchangeRate").textContent = "";
        document.getElementById("calculationTimestamp").textContent = "";
        document.getElementById("convertedAmount").textContent = "";
        return; // Return early and do not perform the conversion
    }

    // Check if the source amount exceeds the upper limit
    if (sourceAmount > upperLimit) {
        document.getElementById("error").textContent = `Error: Source amount should be less than or equal to ${upperLimit}`;
        // Clear the conversion details
        document.getElementById("exchangeRate").textContent = "";
        document.getElementById("calculationTimestamp").textContent = "";
        document.getElementById("convertedAmount").textContent = "";
        return; // Return early and do not perform the conversion
    }

    // Fetch exchange rates from the API
    fetch(`https://www.floatrates.com/daily/${sourceCurrency.toLowerCase()}.json`)
        .then(response => response.json())
        .then(data => {
            const exchangeRate = data[destinationCurrency].rate;
            const convertedAmount = (sourceAmount * exchangeRate).toFixed(2);
            const timestamp = new Date().toLocaleString("en-GB", { timeZone: "GMT" });
            // Get the date of the last exchange rate
            const lastUpdate = data.date ? new Date(data.date).toLocaleString("en-GB", { timeZone: "GMT" }) : "N/A";

            // Update the UI with the conversion details
            document.getElementById("exchangeRate").textContent = `Current Exchange Rate: 1 ${sourceCurrency} = ${exchangeRate} ${destinationCurrency}`;
            document.getElementById("calculationTimestamp").textContent = `Calculation Timestamp: ${timestamp}`;
            document.getElementById("lastUpdate").textContent = `Last Update Date: ${lastUpdate}`;
            document.getElementById("convertedAmount").textContent = `Amount of transaction: ${sourceAmount} ${sourceCurrency} = ${convertedAmount} ${destinationCurrency}`;
            document.getElementById("error").textContent = "";
        })
        .catch(error => console.error("Error updating conversion:", error));
}
