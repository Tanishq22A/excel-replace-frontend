// PUT YOUR RENDER BACKEND URL HERE
const BACKEND = "https://YOUR-BACKEND-URL";

const uploadScreen = document.getElementById("uploadScreen");
const replaceScreen = document.getElementById("replaceScreen");
const continueScreen = document.getElementById("continueScreen");
const downloadScreen = document.getElementById("downloadScreen");


async function uploadFile(){

    const file = document.getElementById("fileInput").files[0];

    if(!file){
        alert("Please select a file");
        return;
    }

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(BACKEND + "/upload", {
        method:"POST",
        body: form
    });

    const data = await res.json();

    if(!res.ok){
        alert(data.error || "Upload failed");
        return;
    }

    const sel = document.getElementById("columnSelect");
    sel.innerHTML = "";

    data.columns.forEach(c => {
        const o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        sel.appendChild(o);
    });

    uploadScreen.classList.add("hidden");
    replaceScreen.classList.remove("hidden");
}


function toggleColumn(){

    const mode =
        document.querySelector('input[name="mode"]:checked').value;

    document.getElementById("columnSelect").disabled =
        (mode === "find");
}


async function doReplace(){

    const findVal = document.getElementById("findVal").value;

    if(!findVal){
        alert("Enter value to find");
        return;
    }

    const mode =
        document.querySelector('input[name="mode"]:checked').value;

    const payload = {
        mode: mode,
        find: document.getElementById("findVal").value,
        replace: document.getElementById("replaceVal").value,
        column: document.getElementById("columnSelect").value
    };

    const res = await fetch(BACKEND + "/replace",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if(!res.ok){
        alert(data.error || "Replacement failed");
        return;
    }

    replaceScreen.classList.add("hidden");
    continueScreen.classList.remove("hidden");
}


function continueReplacing(){

    document.getElementById("findVal").value = "";
    document.getElementById("replaceVal").value = "";

    continueScreen.classList.add("hidden");
    replaceScreen.classList.remove("hidden");
}


function finishReplacing(){

    continueScreen.classList.add("hidden");
    downloadScreen.classList.remove("hidden");
}


function downloadExcel(){
    window.open(BACKEND + "/download/excel","_blank");
}

function downloadPDF(){
    window.open(BACKEND + "/download/pdf","_blank");
}
