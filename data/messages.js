
messages = { // FI SV EN
    duration: {
        minutes: ["{1} {0} minuuttia", "{1} {0} minuter", "{1} {0} minutes"],
        hours: ["{1} {0} tuntia", "{1} {0} timmar", "{1} {0} hours"],
        hoursminutes: ["{2} {0} tuntia {1} minuuttia", "{2} {0} timmar {1} minuter", "{2} {0} hours {1} minutes"],
        hourminutes: ["{1} 1 tunti {0} minuuttia", "{1} 1 timme {0} minuter", "{1} 1 hour {0} minutes"],
    },
    times: {
        aday: ["{0} kertaa päivässä", "{0} gånger om dagen", "{0} times a day"],
        adaytworoutes: ["{0} {1} kertaa päivässä, {2} lisäksi {3} kertaa päivässä", "{0} {1} gånger om dagen, {2} ytterligare {3} gånger om dagen", "{0} {1} times a day, {2}  additional {3} times a day"],
        aweek: ["{0} kertaa viikossa", "{0} gånger i veckan", "{0} times a week"],
        onceaday: ["kerran päivässä", "en gång om dagen", "once a day"],
        twiceaweek: ["kahdesti viikossa", "två gånger i veckan", "twice a week"],
        anhour: ["{0} kertaa tunnissa", "{0} gånger i timmen", "{0} times an hour"],
        adayaweek: ["{0} kertaa päivässä, {1} {2} kertaa viikossa",
                "{0} gånger om dagen, {1} {2} gånger i veckan", "{0} times a day, {1} {2} times a week"],
        dayminutesnightondemand: ["päivällä aikataulun mukaan {0} minuutin välein, yöllä tarvittaessa",
            "dagtid enligt tidtabellen varje {0} minuter, nattetid vid behov",
            "daytime with schedule every {0} minutes, nighttime runs on demand"],
        dayminutesnightonorder: ["päivällä aikataulun mukaan {0} minuutin välein",
            "dagtid enligt tidtabellen varje {0} minuter",
            "daytime with schedule every {0} minutes"],
        ondemandwithpauses: ["Liikennöi tarvittaessa, tauot: {0} {1} {2} {3}", "Trafikerar vid behov, pauser: {0} {1} {2} {3}", "Runs when needed, breaks {0} {1} {2} {3}"],
        ondemandcheckpauses: ["Liikennöi tarvittaessa, tarkista tauot aikataulusta", "Trafikerar vid behov, pauser i tidtabellen", "Runs when needed, check the breaks in the schedule"],
    },
    booking: {
        cannot: ["ei voi varata", "kan inte bokas", "booking not possible"],
    },
    order: {
        pieronly: ["{0} vain tilauksesta", "{0} bara på beställning", "{0} on demand only"],
        only: ["vain tilauksesta", "bara på beställning", "On demand only"],
        partly: ["osa vuoroista vain tilauksesta", "några turer bara på beställning", "Pre-order required for certain trips"],
        nighttime: ["Yöllä vain tilauksesta", "Nattetid bara på beställning", "Pre-order required in night time"],
        extra: ["Lisävuoroja sopimuksen mukaan", "Ekstra turer enligt överenskommelse", "Additional tours by appointment"],
    },
    cost: {
        applies: [ "Maksullinen", "Avgiftsbelagd", "Fee applies" ],
    },
    seasonal: {
        summers: [ "Vain kesäisin", "Bara på sommaren", "Only in summer"],
        summerspier: [ "{0} vain kesäisin", "{0} bara på sommaren", "{0} only in summer"]
    },
    limit: {
        mc_bikes_only: ["Vain moottoripyöriä ja polkupyöriä", "Bara motorcyklar och cyklar", "Only motorcycles and bicycles"],
    },
    contactinfo: [ "Yhteystiedot", "Kontaktuppgifter", "Contact Information"],
    timetables: [ "Aikataulut", "Tidtabeller", "Schedules"],
    unofficialcopy: ["Tämä on epävirallinen kopio. Tarkista muutokset, poikkeukset ja lisätiedot",
        "Detta är en inofficiell kopia. Kontrollera om ändringar, undantag och ytterligare information",
        "This is an unofficial copy. Check for changes, exceptions, and additional information"],
    fromoriginal: ["alkuperäisestä aikataulusta", "från den ursprungliga tidtabellen", "in the original schedule"],
    openzoomable: ["Avaa zoomattava aikataulu uuteen ikkunaan klikkaamalla", "Klicka för att öppna tidtabellen i ett nytt fönster", "Click a timetable image to open it in a new window"],
    seealso: ['Katso myös <a href="{0}">{1}</a>', 'Se också <a href="{0}">{1}</a>', 'See also <a href="{0}">{1}</a>'],
    live: {
        loading: ['Ladataan...', 'Laddas...', 'Loading...'],
        notavailable: ['Livedata ei saatavilla', 'Livedata icke tillgängliga', 'Live data not available'],
        notvisible: ['Ei aluksia kartan alueella', 'Inga fartyg på kartan', 'No vessels within the map bounds'],
        zoomin: ['Lähennä nähdäksesi alusten sijainnit', 'Zooma in för att se fartygens lägen', "Zoom in for vessels' positions"],
        delay1: ['Viive ~ {0} min', 'Försening ~ {0} min', "Delay ~ {0} min"],
        delay2: ['Viive {0} - {1} min', 'Försening {0} - {1} min', "Delay {0} - {1} min"],
    }
}

console.log(JSON.stringify(messages));