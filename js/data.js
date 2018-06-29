registeringSW();
//loadCurrencies();
loadCurFromDB();



// Opening IDB
function openDatabase() {
    if (!navigator.serviceWorker) {
        return Promise.resolve();
    }
    return idb.open('curr_converter1-db', 3, function (upgradeDb) {
        switch (upgradeDb.oldVersion) {
            case 0:
                upgradeDb.createObjectStore('currency', {keyPath: "ABV"});
            case 1:
                upgradeDb.createObjectStore('conversions');
        }
    });
};


//Registering SW
function registeringSW() {
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("Registration Worked!");
        if (!navigator.serviceWorker.controller) {
            return;
        }

        if (reg.waiting) {
            updateReady(reg.waiting);
            return;
        }

        if (reg.installing) {
            trackInstalling(reg.installing);
            return;
        }

        reg.addEventListener('updatefound', function () {
            trackInstalling(reg.installing);
        });
    })
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}




//update ready

function updateReady(worker) {
    if (confirm("New version available")) {
        worker.postMessage({ action: 'skipWaiting' });
    } else {
      return;
    }
}; 

// Track installing

function trackInstalling(worker) {
    const indexController = this;
    worker.addEventListener('statechange', function () {
        if (worker.state == 'installed') {
            indexController._updateReady(worker);
        }
    });
};

const selector = document.getElementsByTagName('select');

console.log(selector);

function loadCurrencies() {
    const dbPromise = openDatabase();
    dbPromise.then(function (db) {
        fetch("https://free.currencyconverterapi.com/api/v5/currencies")
            .then(function (response) {
                if (response.status !== 200) {
                    console.warn('Sorry, there is a problem. Status code: ', response.status);
                    return;
                }

                response.json().then(function (data) {
                    let currencies = data.results;
                    for (curr in currencies) {
                        let opt = document.createElement("option");
                        let opt2 = document.createElement("option");
                        opt.value = currencies[curr].id;
                        opt.text = currencies[curr].currencyName;

                        //console.log(currencies[curr].currencyName);
                        opt2.value = currencies[curr].id;
                        opt2.text = currencies[curr].currencyName;
                        selector[0].appendChild(opt);
                        selector[1].appendChild(opt2);
                        const tx = db.transaction("currency", "readwrite");
                        const curStore = tx.objectStore("currency");
                        const cur = { ABV: currencies[curr].id, name: currencies[curr].currencyName }
                        curStore.put(cur);
                    }

                })

            });

    });
}

function loadCurFromDB() {
    const dbPromise = openDatabase();
    dbPromise.then((db) => {
        const tx = db.transaction("currency");
        const curStore = tx.objectStore("currency");
        return curStore.getAll();
    }).then( (currency) => {
        for (cur of currency) {
        console.log('kakaka',cur)
        let opt = document.createElement("option");
        let opt2 = document.createElement("option");
        opt.value = cur['ABV'];
        opt.text = cur['name'];
        //console.log(currencies[curr].currencyName);
        opt2.value = cur['ABV'];
        opt2.text = cur['name'];
        selector[0].appendChild(opt);
        selector[1].appendChild(opt2);
        }
    })
   
}

function convertCur() {
    const dbPromise = openDatabase();
    dbPromise.then((db) => {
        const fromCurVal = document.getElementById("CURR_FR_VAL");
        const fromCur = document.getElementById("CURR_FR");
        const toCur = document.getElementById("CURR_TO");
        let toCurVal = document.getElementById("CURR_VAL");
        toCurVal.value = "";
        const fromTo = fromCur.value + "_" + toCur.value;
        const url = "https://free.currencyconverterapi.com/api/v5/convert?q=" + fromTo + "&compact=y";
        fetch(url).then(response => {
            response.json().then(data => {
                console.log("DATA", data);
                console.log("the value", data[fromTo].val);
                const tx = db.transaction("conversions", "readwrite");
                const convStore = tx.objectStore("conversions");
                convStore.put(data[fromTo].val, fromTo);
                toCurVal.value = parseFloat(fromCurVal.value) * data[fromTo].val;
            });
        });
        //console.log('THIS IS THE AMT', fromCurVal.value);
        //console.log('THIS IS THE  FROM CURRENCY', fromCur.value);
        //console.log('THIS IS THE TO CURRENCY', toCur.value);
        //console.log('THIS IS THE CONVERTED CURRENCY', toCurVal.value);

    })
    
};

function btnClicked() {
    const fromCurVal = document.getElementById("CURR_FR_VAL");
    const fromCur = document.getElementById("CURR_FR");
    const toCur = document.getElementById("CURR_TO")
    let toCurVal = document.getElementById("CURR_VAL");
    toCurVal.value = "";
    const fromTo = fromCur.value + '_' + toCur.value;
    const url = "https://free.currencyconverterapi.com/api/v5/convert?q=" + fromTo + "&compact=y";
    fetch(url)
        .then((response) => {
            response.json().then((data) => {
                console.log('DATA', data);
                console.log('the value', data[fromTo].val);
                toCurVal.value = parseFloat(fromCurVal.value) * data[fromTo].val;
            })
        })
    //console.log('THIS IS THE AMT', fromCurVal.value);
    //console.log('THIS IS THE  FROM CURRENCY', fromcur.value);
    //console.log('THIS IS THE TO CURRENCY', toCur.value);
    //console.log('THIS IS THE CONVERTED CURRENCY', toCurVal.value);
};

function convertFromDB() {
    const dbPromise = openDatabase();
    
}