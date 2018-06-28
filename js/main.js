
function btnClicked() {
    const fromCurVal = document.getElementById("CURR_FR_VAL");
    const fromcur = document.getElementById("CURR_FR");
    const toCur = document.getElementById("CURR_TO")
    let toCurVal = document.getElementById("CURR_VAL");
    toCurVal.value = "";
    const fromTo = fromcur.value + '_' + toCur.value;
    const url = "https://free.currencyconverterapi.com/api/v5/convert?q=" + fromTo + "&compact=y";
    fetch(url)
        .then((response) =>{
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
