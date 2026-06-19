async function calculate() {
    
    // Get form values
    const name =
        document.getElementById("name").value.trim();

    const birthDateText =
        document.getElementById("birthDate").value;

    const gender =
        document.getElementById("gender").value;

    const bpjsClass =
        document.getElementById("bpjsClass").value;

    const retirementAge =
        Number(document.getElementById("retirementAge").value);

    const savingAge =
        Number(document.getElementById("savingAge").value);

    const interest =
        Number(document.getElementById("interest").value);

    document.getElementById("result-name").innerHTML =
    `Halo, ${name || "User"}`;

    document.getElementById("result").innerHTML =
`
<div class="spinner"></div>

<div class="calculating-text">
    Calculating...
</div>
`;

    // ===== Required Field Validation =====

    if (!name) {
        alert("Mohon masukkan nama.");
        return;
    }

    if (!birthDateText) {
        alert("Mohon masukkan tanggal lahir.");
        return;
    }

    if (!gender) {
        alert("Mohon pilih jenis kelamin.");
        return;
    }

    if (!bpjsClass) {
        alert("Mohon pilih kelas BPJS.");
        return;
    }

    if (isNaN(retirementAge)) {
        alert("Mohon masukkan usia pensiun.");
        return;
    }

    if (isNaN(savingAge)) {
        alert("Mohon masukkan usia akhir investasi.");
        return;
    }

    if (isNaN(interest)) {
        alert("Mohon masukkan tingkat suku bunga.");
        return;
    }


    // ===== Age Calculation =====

    const [day, month, year] =
    birthDateText.split("/");

    const birthDate =
    new Date(year, month - 1, day);

    const today = new Date();

    let currentAge =
        today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
        today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        currentAge--;
    }


    // ===== Validation Rules =====

    if (retirementAge < 0) {
        alert("Usia pensiun harus positif.");
        return;
    }

    if (savingAge < 0) {
        alert("Usia akhir investasi harus positif.");
        return;
    }

    if (interest < 0) {
        alert("Tingkat suku bunga harus positif.");
        return;
    }

    if (savingAge <= currentAge) {
        alert(
            `Usia akhir investasi harus lebih besar dari usia sekarang (${currentAge}).`
        );
        return;
    }

    if (retirementAge <= savingAge) {
        alert(
            "Usia pensiun harus lebih besar dari usia akhir investasi."
        );
        return;
    }


    // ===== Data Sent To Apps Script =====

    const data = {
        name: name,
        birthDate: birthDateText,
        gender: gender,
        bpjsClass: bpjsClass,
        retirementAge: retirementAge,
        savingAge: savingAge,
        interest: interest
    };


    try {

        document.getElementById("result").innerText =
            "Calculating...";

        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbwf7imkDW354TGCCWPPH6xQUfhlQb0Wffc4rX08XM-DMh9KQYWul6BL3yrOHXbqGXM/exec",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        const investment =
    Math.round(Number(result.investment));

document.getElementById("result-card").style.display =
    "block";

document.getElementById("result-name").innerHTML =
    "";

document.getElementById("result").innerHTML =
`
<div class="spinner"></div>

<div class="result-title">
    Calculating...
</div>
`;

document.getElementById("result-name").innerHTML =
    `Halo, <strong>${name}</strong>`;

document.getElementById("result").innerHTML =
`
<div class="result-title">
    Investasi yang dibutuhkan
</div>

<div class="result-value">
    Rp${investment.toLocaleString("id-ID")}/tahun 
</div>

<div style="
    margin-top: 15px;
    font-size: 1.2rem;
    color: #555;
">
    hingga usia ${savingAge}
</div>
`;


    } catch (error) {

        console.error(error);

        document.getElementById("result").innerText =
            "Error connecting to calculator.";

    }

    function saveInputs() {

    const data = {
        name: document.getElementById("name").value,
        birthDate: document.getElementById("birthDate").value,
        gender: document.getElementById("gender").value,
        bpjsClass: document.getElementById("bpjsClass").value,
        retirementAge: document.getElementById("retirementAge").value,
        savingAge: document.getElementById("savingAge").value,
        interest: document.getElementById("interest").value
    };

    localStorage.setItem(
        "bpjsCalculator",
        JSON.stringify(data)
    );
}

function loadInputs() {

    const saved =
        localStorage.getItem("bpjsCalculator");

    if (!saved) return;

    const data = JSON.parse(saved);

    document.getElementById("name").value =
        data.name || "";

    document.getElementById("birthDate").value =
        data.birthDate || "";

    document.getElementById("gender").value =
        data.gender || "";

    document.getElementById("bpjsClass").value =
        data.bpjsClass || "";

    document.getElementById("retirementAge").value =
        data.retirementAge || "";

    document.getElementById("savingAge").value =
        data.savingAge || "";

    document.getElementById("interest").value =
        data.interest || "";
}

window.onload = loadInputs;

document
    .querySelectorAll("input, select")
    .forEach(element => {

        element.addEventListener(
            "input",
            saveInputs
        );

        element.addEventListener(
            "change",
            saveInputs
        );

    });
}

const birthDateInput =
    document.getElementById("birthDate");

birthDateInput.addEventListener("input", function () {

    let value =
        this.value.replace(/\D/g, "");

    if (value.length > 2) {
        value =
            value.substring(0, 2) +
            "/" +
            value.substring(2);
    }

    if (value.length > 5) {
        value =
            value.substring(0, 5) +
            "/" +
            value.substring(5);
    }

    this.value = value.substring(0, 10);
});