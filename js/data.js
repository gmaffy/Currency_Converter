function registeringSW() {
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("Registration Worked!");
    }).catch(() => {
        console.log("Registration failed")
    });
}
 
registeringSW();

const selector = document.getElementsByTagName('select');

console.log(selector);

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
            curlst = [];
            //cur_comb_lst = [];
            for (curr in currencies) {
                //console.log('curr', curr)
                //console.log(currencies[curr].id);
                curlst.push(currencies[curr].id)
                let opt = document.createElement("option");
                let opt2 = document.createElement("option");
                opt.value = currencies[curr].id;
                opt.text = currencies[curr].id;
                opt2.value = currencies[curr].id;
                opt2.text = currencies[curr].id;
                selector[0].appendChild(opt);
                selector[1].appendChild(opt2);
            }
            //console.log(curlst);
            //for (cur of curlst){
            //    for (cur2 of curlst){
            //        pair = cur + '_' + cur2
            //        cur_comb_lst.push(pair)
            //
            //    }
            //}
            //console.log(cur_comb_lst);

        })

    })