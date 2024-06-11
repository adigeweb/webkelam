const answer = document.querySelector(".type input.answer"),
      pass_btn = document.querySelector(".type button.pass"),
      text = document.querySelector("p.text"),
      score = document.querySelector("span.score"),
      time = document.querySelector("span.time"),
      start_btn = document.querySelector("button.go"),
      finish_sc = document.querySelector(".finish"),
      last_score = document.querySelector("span.last-score"),
      wps = document.querySelector("span.wps"),
      type_sel = document.querySelector("p.type select"),
      level_sel = document.querySelector("p.level select"),
      restart_btn = document.querySelector("button.restart");

window.addEventListener("keyup", (event) => {
    if (event.key == "Enter") pass_btn.click();
});

window.addEventListener("load", () => {
    var tur;
    var sure;
    var zorluk;
    var liste;
    var sayac;
    const start = () => {
        tur = document.querySelector("p.type select").value;
        sure = parseInt(document.querySelector("p.length select").value);
        zorluk = document.querySelector("p.level select").value;
        fetch("./kelimeler.json")
            .then(res => res.json())
            .then(data => {
                liste = data["kelimeler"][zorluk];
                loadQuestion(tur);
                startTimer(sure);
                document.querySelector(".start").style.display = "none";
            });
    }
    const startTimer = (secs) => {
        time.innerText = secs;
        sayac = setInterval(() => {
            time.innerText--;
            if (time.innerText == 0) finish();
        }, 1000);
    }
    const loadQuestion = (type) => {
        var type2 = type;
        if (type == "karma") type2 = (Math.random() >= .5 ? "anlam" : "atasozu");
        var kelime = liste[Math.floor(Math.random() * liste.length)];
        fetch(`https://sozluk.gov.tr/gts?ara=${kelime}`)
            .then(res => res.json())
            .then(data => {
                switch (type2) {
                    case "anlam":
                        var anlam = data[0]["anlamlarListe"][0]["anlam"];
                        text.innerText = anlam;
                        var placeholder = "";
                        for (let i = 0; i < kelime.length; i++) {
                            placeholder += (Math.random() >= .5 ? kelime.charAt(i) : "_");
                        }
                        answer.placeholder = placeholder;
                        answer.setAttribute("data-kelime", kelime);
                        break;
                    case "atasozu":
                        if (!data[0]["atasozu"]) loadQuestion("atasozu");
                        var atasozu = data[0]["atasozu"][Math.floor(Math.random()* data[0]["atasozu"].length)]["madde"].replaceAll(".", "").replaceAll(/\([^)]*\)/g, "");
                        var atasozuGizli = "";
                        var gizliKelime = atasozu.split(" ")[Math.floor(Math.random() * atasozu.split(" ").length)];
                        var yariGizliKelime = "";
                        for (let i = 0; i < gizliKelime.length; i++) {
                            yariGizliKelime += (Math.random() >= .3 ? gizliKelime.charAt(i) : "_");
                        }
                        atasozuGizli = atasozu.replaceAll(gizliKelime, `<i style="color: darkslateblue;">${yariGizliKelime}</i>`);
                        text.innerHTML = atasozuGizli;
                        answer.placeholder = "";
                        answer.setAttribute("data-kelime", gizliKelime);
                        break;
                    default:
                        break;
                }
            });
    }
    const correct = () => {
        answer.value = "";
        score.innerText++;
        loadQuestion(tur);
    }
    const pass = () => {
        answer.value = "";
        score.innerText--;
        loadQuestion(tur);
    }
    const finish = () => {
        answer.blur();
        answer.disabled = "true";
        finish_sc.style.display = "flex";
        last_score.innerText = score.innerText;
        wps.innerText = (score.innerText / sure).toFixed(1).replace(".", ",");
    }
    pass_btn.addEventListener("click", pass);
    answer.addEventListener("input", () => {
        if (answer.value == answer.getAttribute("data-kelime")) correct();
    });
    start_btn.addEventListener("click", start);
    type_sel.addEventListener("change", () => {
        if (type_sel.value == "atasozu") level_sel.disabled = true;
        else level_sel.disabled = false;
    });
    restart_btn.addEventListener("click", () => { location.reload() });
    var test_mode = false;
    window.addEventListener("keyup", (event) => {
        if (event.key == "F8" && event.shiftKey) {
            if (!test_mode) {
                document.querySelectorAll(".test-mode").forEach(item => {
                    item.style.display = (item.getAttribute("data-custom-display") ? item.getAttribute("data-custom-display") : "block");
                });
            }
            else {
                document.querySelectorAll(".test-mode").forEach(item => {
                    item.style.display = "none";
                });
            }
            test_mode = !test_mode;
        }
    });
});