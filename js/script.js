// Luhn algorithm implementation
function luhnCheck(num) {
    let arr = (num + '')
        .split('')
        .reverse()
        .map(x => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
        (acc, val, idx) => idx % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val), 0);
    sum += lastDigit;
    return sum % 10 === 0;
}

// Generate random expiration date (MM/YY)
function generateExpiration() {
    let month = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2);
    let year = (new Date().getFullYear() + Math.floor(Math.random() * 5) + 1).toString().slice(-2);
    return `${month}/${year}`;
}

// Generate random CVV
function generateCVV() {
    return ('000' + Math.floor(Math.random() * 1000)).slice(-3);
}

// Generate CC numbers
function generateCC(bin, quantity) {
    let ccNumbers = [];
    for (let i = 0; i < quantity; i++) {
        let cc = bin + Math.floor(Math.random() * Math.pow(10, (16 - bin.length - 1))).toString();
        let checksum = getChecksum(cc);
        let fullCC = cc + checksum;
        let expiration = generateExpiration();
        let cvv = generateCVV();
        ccNumbers.push(`${fullCC}|${expiration}|${cvv}`);
    }
    return ccNumbers;
}

// Calculate the checksum digit
function getChecksum(cc) {
    let arr = cc.split('').map(x => parseInt(x));
    let sum = arr.reduce((acc, val, idx) => idx % 2 === 0 ? acc + ((val *= 2) > 9 ? val - 9 : val) : acc + val, 0);
    return (10 - (sum % 10)) % 10;
}

// Save generated CCs to a text file
function saveToFile(data) {
    let blob = new Blob([data], { type: 'text/plain' });
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = '1337.txt';
    link.click();
}

// Event listener for form submission
document.getElementById('cc-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let bin = document.getElementById('bin').value;
    let quantity = document.getElementById('quantity').value;
    let results = generateCC(bin, quantity);
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Generated CC Numbers</h3><ul>' + results.map(cc => '<li>' + cc + '</li>').join('') + '</ul>';

    // Add the data to a hidden element for saving
    document.getElementById('save-btn').dataset.ccData = results.join('\n');
});

// Event listener for save button
document.getElementById('save-btn').addEventListener('click', function() {
    let ccData = this.dataset.ccData;
    if (ccData) {
        saveToFile(ccData);
    } else {
        alert('No CC data to save. Please generate CC numbers first.');
    }
});


document.getElementById('download-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const url = document.getElementById('video-url').value;
    const statusMessage = document.getElementById('status-message');
    const downloadLink = document.getElementById('download-link');

    statusMessage.textContent = 'Processing...';
    downloadLink.hidden = true;

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        const result = await response.json();
        if (result.success) {
            statusMessage.textContent = 'Download ready!';
            downloadLink.href = result.file;
            downloadLink.hidden = false;
        } else {
            statusMessage.textContent = 'Failed to download MP3. Try again.';
        }
    } catch (error) {
        statusMessage.textContent = 'Error processing the request.';
    }
});
