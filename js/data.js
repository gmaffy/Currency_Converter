const dbPromise = idb.open('curr_converter1-db', 2, function (upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            const currStore = upgradeDb.createObjectStore('currency');
            currStore.put("world", "hello");
        
        case 1:
            upgradeDb.createObjectStore('FR_TO', { keyPath: 'fr_to' });
    }
});

function registeringSW() {
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("Registration Worked!");
    
    }).catch(() => {
        console.log("Registration failed")
    });
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

registeringSW();

const selector = document.getElementsByTagName('select');

console.log(selector);

dbPromise.then(function (db) {
    fetch("https://free.currencyconverterapi.com/api/v5/currencies")
        .then(function (response) {
            if (response.status !== 200) {
                console.warn('Sorry, there is a problem. Status code: ', response.status);
                return;
            }

            response.json().then(function (data) {
                let currencies = data.results;
                //console.log('HERE ARE THE CURRENCIES');
                //console.log(currencies);
                //const curlst = [];
                //cur_comb_lst = [];
                for (curr in currencies) {
                    //console.log('curr', curr)
                    //console.log(currencies[curr].id);
                    //curlst.push(currencies[curr].id)
                    let opt = document.createElement("option");
                    let opt2 = document.createElement("option");
                    opt.value = currencies[curr].id;
                    opt.text = currencies[curr].id;

                    //console.log(currencies[curr].currencyName);
                    opt2.value = currencies[curr].id;
                    opt2.text = currencies[curr].id;
                    selector[0].appendChild(opt);
                    selector[1].appendChild(opt2);
                    const tx = db.transaction("currency", "readwrite");
                    const keyValStore = tx.objectStore("currency");
                    keyValStore.put(currencies[curr].id, currencies[curr].currencyName);       
                }

            })

        });
    
});