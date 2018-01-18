
messages = {
    duration: {
        minutes: ["{0} minuuttia", "{0} minuter", "{0} minutes"],
        hours: ["{0} tuntia", "{0} timmar", "{0} hours"],
        hoursminutes: ["{0} tuntia {1} minuuttia", "{0} timmar {1} minuter", "{0} hours {1} minutes"],
    },
    times: {
        aday: ["{0} kertaa päivässä", "{0} gånger om dagen", "{0} times a day"],
        aweek: ["{0} kertaa viikossa", "{0} gånger om vecka", "{0} times a week"],
        onceaday: ["kerran päivässä", "en gång om dagen", "once a day"],
        anhour: ["{0} kertaa tunnissa", "{0} gånger om timme", "{0} times an hour"],
    },
    booking: {
        cannot: ["ei voi varata", "kan inte bokas", "booking not possible"],
    },
    order: {
        partly: ["osa vuoroista vain tilauksesta", "delvis beställningturer", "Pre-order required for certain trips"],
    },
    cost: {
        applies: [ "Maksullinen", "Avgiftsbelagd", "Fee applies" ],
    },
    seasonal: {
        summers: [ "Vain kesäisin", "Under sommar", "Summer only"]
    },
    limit: {
        cars_mc_bikes_only: ["Vain henkilöautoja, moottoripyöriä ja polkupyöriä", "Bara personbilar, motorcyklar och cyklar", "Only cars, motorcycles, and bicycles"],
    },
    contactinfo: [ "Yhteystiedot", "Kontaktuppgifter", "Contact Information"],
    timetables: [ "Aikataulut", "Tidtabeller", "Schedules"],
    unofficialcopy: ["Tämä on epävirallinen kopio. Tarkista muutokset, poikkeukset ja lisätiedot",
        "Detta är en inofficiell kopia. Kontrollera om ändringar, undantag och ytterligare information",
        "This is an unofficial copy. Check for changes, exceptions, and additional information"],
    fromoriginal: ["alkuperäisestä aikataulusta", "från den ursprungliga tidtabellen", "in the original schedule"],
    openzoomable: ["Avaa zoomattava aikataulu uuteen ikkunaan klikkaamalla", "Klicka för att öppna tidtabellen i ett nytt fönster", "Click a timetable image to open it in a new window"]
}

function deepGet (obj, properties) {
    if (obj === undefined || obj === null || properties.length === 0) {
        return obj;
    } else {
        return deepGet(obj[properties[0]], properties.slice(1));
    }
}

var localize_languages = ["fi", "sv", "en"];

function localize(lang, args) {
    console.log('localize', lang, args, typeof args);
    if (!(args instanceof Array)) args = [args];
    var message = deepGet(messages, args[0].split("."))[localize_languages.indexOf(lang)];
    var i = 0;
    args.slice(1).forEach(function(arg) {
        var str = "{" + i + "}";
        message = message.replace(str, arg);
        i++;
    });
    return message;
}

L = localize;

console.log(L("fi", ["duration.hours", "10"]));
console.log(L("en", ["times.aday", "10"]));
console.log(L("sv", ["booking.cannot"]));

ferries = {
    skiftet: {
        name: "M/S Skiftet",
        features: {
            access: true,
            cafe: true
        },
        capacity: {
            persons: 200,
            cars: 20,
            trucks: 4
        },
        contact: {
            phones: [ '+358 (0)400 350 265', {name: 'Café', tel: '+358 (0)405 515 645'}]
        },
    },
    gudingen: {
        name: "M/S Gudingen",
        features: {
            access: true,
            cafe: true,
        },
        capacity: {
            persons: 195,
            cars: 20,
            trucks: 4
        },
        contact: {
            phones: [ '+358 (0)40 769 3687', {name: 'Café', tel: '+358 (0)405 505 059'}]
        },
    },
    ejdern: {
        name: "M/S Ejdern",
        features: {
            access: false,
            cafe: false,
        },
        capacity: {
            persons: 144,
            cars: 16,
            trucks: 4,
        },
        contact: {
            phones: ['+358 (0)40 0229 260']
        },
    },
    skarven: {
        name: "M/S Skarven",
        features: {
            access: true,
            cafe: true,
        },
        capacity: {
            persons: 250,
            cars: 60,
            trucks: 4,
        },
        contact: {
            phones: ['+358 (0)40 173 3600',{name: 'Café', tel: '+358 (0)457 3439 301'}]
        },
    },
    alfageln: {
        name: "M/S Alfågeln",
        features: {
            access: true,
            cafe: true,
        },
        capacity: {
            persons: 244,
            cars: 50,
            trucks: 4,
        },
        contact: {
            phones: ['+358 (0)40 768 2108',{name: 'Café', tel: '+358 (0)40 637 8500'}]
        },
    },
    knipan: {
        name: "M/S Knipan",
        features: {
            access: true,
            cafe: false,
        },
        capacity: {
            persons: 157,
            cars: 20,
            trucks: 4,
        },
        contact: {
            phones: ['+358 (0)40 0229 261']
        },
    },
    viggen: {
        name: "M/S Viggen",
        features: {
            access: true,
            cafe: true,
        },
        capacity: {
            persons: 250,
            cars: 50,
            trucks: 4,
        },
        contact: {
            phones: ['+358 (0)40 0330 455',{name: 'Café', tel: '+358 (0)40 7658 453'}]
        },
    },
    doppingen: {
        name: "M/S Doppingen",
        features: {
            access: false,
            cafe: false,
        },
        capacity: {
            persons: 70,
            cars: 18,
            trucks: 2,
        },
        contact: {
            phones: ['+358 (0)40 7082 136']
        },
    },
    rosala: {
        name: "M/S Rosala II",
        features: {
            access: false,
            cafe: false,
        },
        capacity: {
            persons: 65,
            cars: 6,
            trucks: 1,
        },
        contact: {
            phones: ['+358 (0)40 0492 739']
        },
    },
    frida: {
        name: "M/S Frida II",
        features: {
            access: false,
            cafe: false,
        },
        capacity: {
            persons: 17,
            cars: 18,
            trucks: 2,
        },
        contact: {
            phones: ['+358 (0)457 3613 394']
        },
    },
    odin: {
        name: "M/S Odin",
        features: {
            access: true,
            cafe: false,
        },
        capacity: {
            persons: 80,
            cars: 45,
            trucks: 3,
        },
        contact: {
            phones: ['+358 (0)40 4840 352']
        },
    },
    hammaronsalmi: {
        name: "Lautta #185",
        features: {
        },
        capacity: {
            cars: 14,
        },
        contact: {
            phones: ['+358 40 558 2773']
        },
    },
    hogsar: {
        name: "Lautta #182",
        features: {
        },
        capacity: {
            cars: 10,
        },
        contact: {
            phones: ['+358 40 558 4412']
        },
    },
    hogsara: {
        name: "Lautta #151",
        features: {
        },
        capacity: {
            cars: 14,
        },
        contact: {
            phones: ['+358 40 706 6291']
        },
    },
    aura: {
        name: "M/S Aura",
        features: {
        },
        capacity: {
            cars: 52,
            persons: 197,
        },
        contact: {
            phones: ['+358 400 320 093']
        },
    },
    aurora: {
        name: "M/S Aurora",
        features: {
        },
        capacity: {
            cars: 52,
            persons: 197,
        },
        contact: {
            phones: ['+358 400 320 092']
        },
    },
    keistio: {
        name: "Lautta #177",
        features: {
        },
        capacity: {
            cars: 10,
        },
        contact: {
            phones: ['+358 40 846 9500']
        },
    },
    kivimolossi: {
        name: "Lautta #167",
        features: {
        },
        capacity: {
            cars: 14,
        },
        contact: {
            phones: ['+358 400 292 691']
        },
    },
    kokkila: {
        name: "Lautta #199",
        features: {
        },
        capacity: {
            cars: 21,
        },
        contact: {
            phones: ['+358 40 568 4911']
        },
    },
    stellakorppoo: {
        name: "M/S Stella",
        features: {
        },
        capacity: {
            cars: 65,
        },
        contact: {
            phones: ['+358 400 114 291']
        },
    },
    mergus: {
        name: "M/S Mergus",
        features: {
        },
        capacity: {
            cars: 27,
        },
        contact: {
            phones: ['+358 400 533 461']
        },
    },
    mossala: {
        name: "Lautta #176",
        features: {
        },
        capacity: {
            cars: 14,
        },
        contact: {
            phones: ['+358 40 553 1534']
        },
    },
    prostvik1: {
        name: "M/S Prostvik 1",
        features: {
        },
        capacity: {
            cars: 30,
        },
        contact: {
            phones: ['+358 400 864 268']
        },
    },
    nagu2: {
        name: "M/S Nagu 2",
        features: {
        },
        capacity: {
            cars: 16,
        },
        contact: {
            phones: ['+358 400 882 614']
        },
    },
    falko: {
        name: "M/S Falkö",
        features: {
        },
        capacity: {
            cars: 8,
            persons: 110,
        },
        contact: {
            phones: ['+358 400 320 097']
        },
    },
    palva: {
        name: "Lautta #179",
        features: {
        },
        capacity: {
            cars: 10,
        },
        contact: {
            phones: ['+358 400 525 901']
        },
    },
    elektra: {
        name: "M/S Elektra",
        features: {
        },
        capacity: {
            cars: 90,
            persons: 450,
        },
        contact: {
            phones: ['+358 40 662 1320']
        },
    },
    sterna: {
        name: "M/S Sterna",
        features: {
        },
        capacity: {
            cars: 66,
        },
        contact: {
            phones: ['+358 400 127 999']
        },
    },
    falco: {
        name: "M/S Falco",
        features: {
        },
        capacity: {
            cars: 54,
        },
        contact: {
            phones: ['+358 400 110 114']
        },
    },
    viken: {
        name: "M/S Viken",
        features: {
        },
        capacity: {
            cars: 14,
            persons: 73,
        },
        contact: {
            phones: ['+358 400 320 099']
        },
    },
    antonia: {
        name: "M/S Antonia",
        features: {
        },
        capacity: {
            cars: 27,
        },
        contact: {
            phones: ['+358 400 320 049']
        },
    },
    saverkeit: {
        name: "Lautta #181",
        features: {
        },
        capacity: {
            cars: 10,
        },
        contact: {
            phones: ['+358 40 553 1072']
        },
    },
    vartsala: {
        name: "Lautta #198",
        features: {
        },
        capacity: {
            cars: 36,
        },
        contact: {
            phones: ['+358 400 138 239']
        },
    },
    velkuanmaa: {
        name: "Lautta #171",
        features: {
        },
        capacity: {
            cars: 10,
        },
        contact: {
            phones: ['+358 400 525 902']
        },
    },
    mskivimo: {
        name: "M/S Kivimo",
        features: {
        },
        capacity: {
            cars: 8,
            persons: 50,
        },
        contact: {
            phones: ['+358 400 320 095']
        },
    },
    vano: {
        name: "Lautta #201",
        features: {
        },
        capacity: {
            cars: 21,
        },
        contact: {
            phones: ['+358 500 827 157']
        },
    },
    skagen: {
        name: "Vikare",
        features: {
        },
        capacity: {
            cars: 10,
        },
        contact: {
            phones: ['+358 10 271 7915']
        },
    },
    sorpo: {
        name: "Sorpo",
        features: {
        },
        capacity: {
            cars: 10,
        },
        contact: {
            phones: ['+358 40 569 2620']
        },
    },
    pettu: {
        name: "Pettu",
        features: {
        },
        capacity: {
            cars: 10,
        },
        contact: {
            phones: ['+358 50 354 2488']
        },
    },
    satava: {
        name: "M/S Satava",
        features: {
        },
        capacity: {
            cars: 8,
            persons: 80,
        },
        contact: {
            phones: ['+358 40 849 5140']
        },
    },
    nordep: {
        name: "M/S Nordep",
        features: {
        },
        capacity: {
            cars: 2,
            persons: 78,
        },
        contact: {
            phones: ['+358 45 129 4779']
        },
    },
    karolina: {
        name: "M/S Karolina",
        features: {
        },
        capacity: {
            persons: 30,
        },
        contact: {
            phones: ['+358 40 717 3455 ']
        },
    },
    cheri: {
        name: "M/S Cheri",
        features: {
        },
        capacity: {
            persons: 12,
        },
        contact: {
            phones: ['+358 400 217 053', '+358 400 227 722']
        },
    },
    myrskylintu: {
        name: "M/S Myrskylintu",
        features: {
        },
        capacity: {
            persons: 28,
        },
        contact: {
            phones: ['+358 400 217 053', '+358 400 227 722']
        },
    },
    fisko: {
        name: "Y/A Fiskö",
        features: {
        },
        capacity: {
            cars: 2,
            persons: 36,
        },
        contact: {
            phones: ['+358 44 761 8000'],
            email: 'info@saaristolinjat.fi',
            email_sv: 'info@skargardslinjer.fi'
        },
    },
    isla: {
        name: "M/S Isla",
        features: {
        },
        capacity: {
            cars: 8,
            persons: 100,
        },
        contact: {
            phones: ['+358 40 673 6697'],
            fb: 'https://www.facebook.com/MS-Isla-401567819993437/'
        },
    },
    stella_hiittinen: {
        name: "M/S Stella",
        features: {
        },
        capacity: {
            cars: 8,
            persons: 100,
        },
        contact: {
            phones: ['+358 40 675 6441'],
            fb: 'https://www.facebook.com/MS-Stella-1408172536122848/'
        },
    },
    alva: {
        name: "M/S Alva",
        features: {
        },
        capacity: {
            persons: 20,
        },
        contact: {
            phones: ['+358 40 413 1574']
        },
    },
    eivor: {
        name: "M/S Eivor",
        features: {
            cafe: true
        },
        capacity: {
            cars: 19,
            persons: 195
        },
        contact: {
            phones: ['+358 44 5000 503', {name: 'Café', tel: '+358 44 5000 506'}],
            email: 'eivor@rosita.fi',
            fb: 'https://www.facebook.com/mseivor/'
        }
    },
    ostern: {
        name: "M/S Östern",
        features: {
            cafe: true
        },
        capacity: {
            cars: 17,
            persons: 126
        },
        contact: {
            phones: ['+358 400 720 606'],
            email: 'info@ostern.fi',
            fb: 'https://www.facebook.com/YhteysalusOstern'
        }
    },
    silvana: {
        name: "M/S Silvana",
        capacity: {
            bikes: 50,
            persons: 50
        },
        contact: {
            phones: ['+358 400 229149']
        }
    }
}

operators = {
    alandstrafiken: {
        name: "Ålandstrafiken",
        logo: "alandstrafiken.png",
        contact: {
            phones: ['+358-18-25 600'],
            fax: '+358-18-17815',
            address: 'Styrmansgatan 1, AX-22100 MARIEHAMN',
            fb: 'https://www.facebook.com/%C3%85landstrafiken-trafikinformation-159908027409016/',
            email: 'info@alandstrafiken.ax',
            www: 'http://www.alandstrafiken.ax',
            www_fi: 'http://www.alandstrafiken.ax/fi',
            www_sv: 'http://www.alandstrafiken.ax/sv',
            www_en: 'http://www.alandstrafiken.ax/en',
        },
    },
    finferries: {
        name: "Finferries",
        logo: "finferries.png",
        contact: {
            phones: ['+358 207 118 750', {name: "Timetables", name_fi: "Aikatauluneuvonta", name_sv: "Tidtabellsinformation", tel: '+358 400 117 123'}],
            address: 'Puutarhakatu 55-57, PL 252, 20101 Turku',
            www: 'http://www.finferries.fi/',
            www_fi: 'http://www.finferries.fi/',
            www_sv: 'http://www.finferries.fi/sv',
            www_ev: 'http://www.finferries.fi/en'
        },
    },
    ncl: {
        name: "Nordic Coast Line / Nordic Jetline",
        logo: "ncl.png",
        contact: {
            address: 'Mannerheiminkatu 20, 06100 Porvoo',
            phones: ['+358 19 536 2200'],
            fax: '+358 19 536 2201',
            email: 'info@nordiccoastline.fi',
            www: 'http://www.ncl.fi/fi',
            www_fi: 'http://www.ncl.fi/fi',
            www_sv: 'http://www.ncl.fi/sv',
            www_en: 'http://www.ncl.fi/en'
        },
    },
    ferryway: {
        name: "JS Ferryway Ltd Oy",
        logo: "ferryway.png",
        contact: {
            phones: [],
            email: 'info@ferryway.fi',
            address: 'Äpplö, 21760 Houtskari',
            www: 'https://www.ferryway.fi/'
        },
    },
    al: {
        name: "Archipelago Lines",
        logo: "archipelagolines.png",
        contact: {
            phones: ['+358 41 456 4828', '+358 45 124 5551'],
            email: 'info@a-lines.fi',
            www: 'http://www.saaristolinjat.fi/',
            www_fi: 'http://saaristolinjat.fi/',
            www_sv: 'http://skargardslinjer.fi/'
        },
    },
    savolainen: {
        name: "Kuljetus Savolainen Oy",
        logo: 'kuljetussavolainen.png',
        contact: {
            phones: ['+358 6 533 0542', '+358 400 849444'],
            fax: '+358 6 5350500',
            email: 'info@kuljetus-savolainen.fi',
            www: 'https://kuljetus-savolainen.fi/yhteysalusliikenne/'
        },
    },
    sinv: {
        name: "Sundqvist Investment Oy",
        logo: "sinv.png",
        contact: {
            phones: [{name: "CEO", tel: '+358 442 510 297'}],
            email: 'mats.sundqvist@sinv.eu',
            www: 'http://www.ostern.fi/en',
            www_fi: 'http://www.ostern.fi/',
            www_sv: 'http://www.ostern.fi/',
        },
    },
    rosita: {
        name: "Rosita Oy",
        logo: "rosita.png",
        contact: {
            phones: ['+358 2 213 1500'],
            email: 'info@rosita.fi',
            address: 'Formaalintie 10, 20780 Kaarina',
            www: 'http://www.rosita.fi/',
            www_fi: 'http://www.rosita.fi/',
            www_sv: 'http://www.rosita.fi/Hemsida'
        },
    }
}

piers = {
    svino: {
        name: "Svinö",
        mun: "Lumparland",
        type: "1",
        distances: [
            {
                to: "Mariehamn",
                to_fi: "Maarianhamina",
                dist: 27
            },{
                to: "Långnäs",
                dist: 7.1
            }
        ]
    },
    degerby: {
        name: "Degerby",
        mun: "Föglö",
        type: "1",
        distances: [
            {
                to: "Överö",
                dist: 17
            }
        ]
    },
    hummelvik: {
        name: "Hummelvik",
        mun: "Vårdö",
        type: "1",
    },
    enklinge: {
        name: "Enklinge",
        mun: "Kumlinge",
        type: "2"
    },
    kumlinge: {
        name: "Kumlinge",
        mun: "Kumlinge",
        type: "1",
    },
    lappo: {
        name: "Lappo",
        mun: "Brändö",
        type: "2"
    },
    torsholma: {
        name: "Torsholma",
        mun: "Brändö",
        type: "1",
    },
    asterholma: {
        name: "Asterholma",
        mun: "Brändö",
        type: "2"
    },
    ava: {
        name: "Åva",
        mun: "Brändö",
        type: "1",
    },
    jurmob: {
        name: "Jurmo",
        mun: "Brändö",
        type: "2"
    },
    vuosnainen: {
        name: "Vuosnainen",
        name_sv: "Osnäs",
        mun: "Kustavi",
        mun_sv: "Gustavs",
        type: "1",
    },
    langnas: {
        name: "Långnäs",
        mun: "Lumparland",
        type: "1"
    },
    overo: {
        name: "Överö",
        mun: "Föglö",
        type: "1"
    },
    sottunga: {
        name: "Sottunga",
        mun: "Sottunga",
        type: "2"
    },
    huso: {
        name: "Husö",
        mun: "Sottunga",
        type: "2"
    },
    kyrkogardso: {
        name: "Kyrkogårdsö",
        mun: "Kökar",
        type: "2"
    },
    kokar: {
        name: "Kökar",
        mun: "Kökar",
        type: "2"
    },
    galtby: {
        name: "Galtby",
        mun: "Korpo",
        mun_fi: "Korppoo",
        type: "1"
    },
    bergo: {
        name: "Bergö",
        mun: "Lumparland",
        type: "2"
    },
    snacko: {
        name: "Snäckö",
        mun: "Kumlinge",
        type: "1"
    },
    kannvik: {
        name: "Kannvik",
        mun: "Iniö",
        type: "1"
    },
    heponiemi: {
        name: "Heponiemi",
        mun: "Kustavi",
        mun_sv: "Gustavs",
        type: "1"
    },
    dalen: {
        name: "Dalen",
        mun: "Iniö",
        type: "1"
    },
    mossala: {
        name: "Mossala",
        mun: "Houtskär",
        mun_fi: "Houtskari",
        type: "1"
    },
    kittuis: {
        name: "Kittuis",
        mun: "Houtskär",
        mun_fi: "Houtskari",
        type: "1"
    },
    olofsnas: {
        name: "Olofsnäs",
        mun: "Norrskata",
        type: "1"
    },
    retais: {
        name: "Retais",
        mun: "Korpo",
        mun_fi: "Korppoo",
        type: "1"
    },
    parnas: {
        name: "Pärnäs",
        name_fi: "Pärnäinen",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "1"
    },
    nagu: {
        name: "Nagu",
        name_fi: "Nauvo",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "1"
    },
    hanka: {
        name: "Hanka",
        mun: "Rymättylä",
        mun_fi: "Rimito",
        type: "1"
    },
    teersalo: {
        name: "Teersalo",
        mun: "Velkua",
        type: "1"
    },
    hakkenpaa: {
        name: "Hakkenpää",
        mun: "Taivassalo",
        mun_sv: "Tövsala",
        type: "1"
    },
    kasnäs: {
        name: "Kasnäs",
        mun: "Kimitoön",
        mun_fi: "Kemiönsaari",
        type: "1"
    },
    långnäsh: {
        name: "Långnäs",
        mun: "Hitis",
        mun_fi: "Hiittinen",
        type: "1"
    },
    haapala: {
        name: "Haapala",
        mun: "Rymättylä",
        mun_fi: "Rimito",
        type: "1"
    },
    verkan: {
        name: "Verkan",
        mun: "Korpo",
        mun_fi: "Korppoo",
        type: "1"
    },
    kirjais: {
        name: "Kirjais",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "1"
    },
    granvik: {
        name: "Granvik",
        mun: "Pargas",
        mun_fi: "Parainen",
        type: "1"
    },
    prostvik: {
        name: "Prostvik",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "1"
    },
    lillmalo: {
        name: "Lillmälö",
        mun: "Pargas",
        mun_fi: "Parainen",
        type: "1"
    },
    dalsbruk: {
        name: "Dalsbruk",
        name_fi: "Taalintehdas",
        mun: "Kimitoön",
        mun_fi: "Kemiönsaari",
        type: "1"
    },

    keso: {
        name: "Keso varvet",
        name_fi: "Keson telakka",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "1"
    },
    seili: {
        name: "Själö",
        name_fi: "Seili",
        mun: "Nagu",
        mun: "Nauvo",
        type: "2"
    },
    innamo: {
        name: "Innamo",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "2"
    },
    jarvsor: {
        name: "Järvsor",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "2"
    },
    maskinnamo: {
        name: "Maskinnamo",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "2"
    },
    avensor: {
        name: "Åvensor",
        name_fi: "Ahvensaari",
        mun: "Nagu",
        mun_fi: "Nauvo",
        type: "2"
    },
    lavarn: {
        name: "Lavarn",
        mun: "Houtsala",
        type: "1"
    },
}

timetables = {
    none: [],
    foglolinjen: [
        { validFrom: "2018-01-01", validTo: "2018-05-31", tables: ["FoglolinjenVinter2018_1.png", "FoglolinjenVinter2018_2.png"]},
        { validFrom: "2018-06-01", validTo: "2018-08-31", tables: ["FoglolinjenSommar2018_1.png", "FoglolinjenSommar2018_2.png"]},
        { validFrom: "2018-09-01", validTo: "2018-12-31", tables: ["FoglolinjenVinter2018_1.png", "FoglolinjenVinter2018_2.png"]}
    ],
    norralinjen: [
        { validFrom: "2018-01-03", validTo: "2018-04-29", tables: ["NorraVinter2018_1.png", "NorraVinter2018_2.png", "NorraVinter2018_3.png"]},
        { validFrom: "2018-04-30", validTo: "2018-06-17", tables: ["NorraVar2018_1.png", "NorraVar2018_2.png", "NorraVar2018_3.png"]},
        { validFrom: "2018-06-18", validTo: "2018-08-12", tables: ["NorraSommar2018_1.png", "NorraSommar2018_2.png"]},
        { validFrom: "2018-08-13", validTo: "2018-09-30", tables: ["NorraVar2018_1.png", "NorraVar2018_2.png", "NorraVar2018_3.png"]},
        { validFrom: "2018-10-01", validTo: "2018-12-31", tables: ["NorraVinter2018_1.png", "NorraVinter2018_2.png", "NorraVinter2018_3.png"]},
    ],  
    enklingelinjen: [
        { validFrom: "2018-01-01", validTo: "2018-04-29", tables: ["EnklingeVinter2018.png"]},
        { validFrom: "2018-04-30", validTo: "2018-06-17", tables: ["EnklingeVar2018.png"]},
        { validFrom: "2018-06-18", validTo: "2018-08-12", tables: ["EnklingeSommar2018.png"]},
        { validFrom: "2018-08-13", validTo: "2018-09-30", tables: ["EnklingeVar2018.png"]},
        { validFrom: "2018-10-01", validTo: "2018-12-31", tables: ["EnklingeVinter2018.png"]},
    ],
    asterholmalinjen: [
        { validFrom: "2018-01-01", validTo: "2018-04-29", tables: ["FridaVinter2018_1.png", "FridaVinter2018_2.png", "FridaVinter2018_3.png"]},
        { validFrom: "2018-04-30", validTo: "2018-06-17", tables: ["FridaVar2018_1.png", "FridaVar2018_2.png", "FridaVar2018_3.png"]},
        { validFrom: "2018-06-18", validTo: "2018-08-12", tables: ["FridaSommar2018_1.png", "FridaSommar2018_2.png", "FridaSommar2018_3.png"]},
        { validFrom: "2018-08-13", validTo: "2018-09-30", tables: ["FridaVar2018_1.png", "FridaVar2018_2.png"]},
        { validFrom: "2018-10-01", validTo: "2018-12-31", tables: ["FridaVinter2018_1.png", "FridaVinter2018_2.png", "FridaVinter2018_3.png"]},
    ],
    avajurmo: [
        { validFrom: "2018-01-01", validTo: "2018-04-29", tables: ["DoppingenVinter2018_1.png", "DoppingenVinter2018_2.png", "DoppingenVinter2018_3.png"]},
        { validFrom: "2018-04-30", validTo: "2018-06-17", tables: ["DoppingenVar2018_1.png", "DoppingenVar2018_2.png", "DoppingenVar2018_3.png"]},
        { validFrom: "2018-06-18", validTo: "2018-08-12", tables: ["DoppingenSommar2018_1.png", "DoppingenSommar2018_2.png", "DoppingenSommar2018_3.png"]},
        { validFrom: "2018-08-13", validTo: "2018-09-30", tables: ["DoppingenVar2018_1.png", "DoppingenVar2018_2.png"]},
        { validFrom: "2018-10-01", validTo: "2018-12-31", tables: ["DoppingenVinter2018_1.png", "DoppingenVinter2018_2.png", "DoppingenVinter2018_3.png"]},
    ],  
    osnasava: [
        { validFrom: "2018-01-01", validTo: "2018-04-29", tables: ["ViggenVinter2018_1.png", "ViggenVinter2018_2.png", "ViggenVinter2018_3.png"]},
        { validFrom: "2018-04-30", validTo: "2018-06-17", tables: ["ViggenVar2018_1.png", "ViggenVar2018_2.png"]},
        { validFrom: "2018-06-18", validTo: "2018-08-12", tables: ["ViggenSommar2018_1.png", "ViggenSommar2018_2.png"]},
        { validFrom: "2018-08-13", validTo: "2018-09-30", tables: ["ViggenVar2018_1.png"]},
        { validFrom: "2018-10-01", validTo: "2018-12-31", tables: ["ViggenVinter2018_1.png", "ViggenVinter2018_2.png", "ViggenVinter2018_3.png"]},
    ],
    sodralinjen: [
        { validFrom: "2018-01-03", validTo: "2018-04-29", tables: ["SodraVinter2018_1.png", "SodraVinter2018_2.png"]},
        { validFrom: "2018-04-30", validTo: "2018-06-17", tables: ["SodraVar2018_1.png", "SodraVar2018_2.png"]},
        { validFrom: "2018-06-18", validTo: "2018-08-12", tables: ["SodraSommar2018_1.png", "SodraSommar2018_2.png", "SodraSommar2018_3.png", "SodraSommar2018_4.png", "SodraSommar2018_5.png", "SodraSommar2018_6.png"]},
        { validFrom: "2018-08-13", validTo: "2018-09-30", tables: ["SodraVar2018_1.png", "SodraVar2018_2.png"]},
        { validFrom: "2018-10-01", validTo: "2018-12-31", tables: ["SodraVinter2018_1.png", "SodraVinter2018_2.png"]},
    ],  
    tvarlinjen: [
        { validFrom: "2018-01-03", validTo: "2018-04-29", tables: ["OdinVinter2018_1.png", "OdinVinter2018_2.png"]},
        { validFrom: "2018-04-30", validTo: "2018-06-17", tables: ["OdinVar2018_1.png", "OdinVar2018_2.png"]},
        { validFrom: "2018-06-18", validTo: "2018-08-12", tables: ["OdinSommar2018_1.png", "OdinSommar2018_2.png", "OdinSommar2018_3.png"]},
        { validFrom: "2018-08-13", validTo: "2018-09-30", tables: ["OdinVar2018_1.png", "OdinVar2018_2.png"]},
        { validFrom: "2018-10-01", validTo: "2018-12-31", tables: ["OdinVinter2018_1.png", "OdinVinter2018_2.png"]},
    ],  

    iniokustavi: [
        { validFrom: "2018-01-01", validTo: "2018-06-18", tables: ["AuraVinter2018.png"]},
        { validFrom: "2018-06-19", validTo: "2018-08-14", tables: ["AuraSommar2018.png"]},
        { validFrom: "2018-08-15", validTo: "2018-12-31", tables: ["AuraVinter2018.png"]},
    ],
    houtskarinio: [
        { validFrom: "2018-05-25", validTo: "2018-08-26", tables: ["AntoniaSommar2018.png"]},
    ],
    nauvohanka: [
        { validFrom: "2018-05-18", validTo: "2018-09-02", tables: ["Ostern2018_fisv.png"]},
    ],
    nauvohankaen: [
        { validFrom: "2018-05-18", validTo: "2018-09-02", tables: ["Ostern2018_ende.png"]},
    ],

    nagunorra: [
        { validFrom: "2017-10-02", validTo: "2018-05-17", tables: ["FalkoVinter2018.png"]}
    ]
}

pricelists = {
    alandstrafiken: [
        { validFrom: "2018-01-01", validTo: "2018-12-31", lists: ["AlandstrafikenPricelist2018_1.png", "AlandstrafikenPricelist2018_2.png"]}
    ]
}

routes = {
    foglolinjen: {
        name: "Föglölinjen",
        name_fi: "Föglön linja",
        name_en: "Föglo line",
        specifier: "Svinö - Degerby",
        piers: ["ref_piers_svino", "ref_piers_degerby"],
        operator: "ref_operators_alandstrafiken",
        vessels: ["ref_ferries_skarven"],
        features: {
            interval_L: ["times.aday", "8-12"],
            booking_L: "booking.cannot",
            cost_L: "cost.applies",
            duration_L: ["duration.minutes", "35"]
        },
        timetables: "ref_timetables_foglolinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "ref_pricelists_alandstrafiken"
    },
    norralinjen: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Hummelvik - Enklinge - Kumlinge - Lappo - Torsholma",
        piers: ["ref_piers_hummelvik", "ref_piers_enklinge", "ref_piers_kumlinge", "ref_piers_lappo", "ref_piers_torsholma"],
        operator: "ref_operators_alandstrafiken",
        vessels: ["ref_ferries_alfageln", "ref_ferries_knipan"],
        features: {
            interval_L: ["times.aday", "3-4"],
            cost_L: "cost.applies",
            duration_L: ["duration.hours", "2.5"],
        },
        timetables: "ref_timetables_norralinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "ref_pricelists_alandstrafiken"
    },
    enklingelinjen: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Enklinge - Kumlinge",
        piers: ["ref_piers_enklinge", "ref_piers_kumlinge"],
        operator: "ref_operators_alandstrafiken",
        vessels: ["ref_ferries_rosala"],
        features: {
            interval_L: ["times.aday", "~ 10"],
            booking_L: "booking.cannot",
            duration_L: ["duration.minutes", "15"]
        },
        timetables: "ref_timetables_enklingelinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "ref_pricelists_alandstrafiken"
    },
    asterholmalinjen: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Asterholma - Lappo - Torsholma",
        piers: ["ref_piers_asterholma", "ref_piers_lappo", "ref_piers_torsholma"],
        operator: "ref_operators_alandstrafiken",
        vessels: ["ref_ferries_frida"],
        features: {
            interval_L: ["times.aday", "~ 10"],
            order_L: "order.partly",
            duration_L: ["duration.minutes", "35"]
        },
        timetables: "ref_timetables_asterholmalinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "ref_pricelists_alandstrafiken"
    },
    avajurmo: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Åva - Jurmo",
        piers: ["ref_piers_ava", "ref_piers_jurmob"],
        operator: "ref_operators_alandstrafiken",
        vessels: ["ref_ferries_doppingen"],
        features: {
            interval_L: ["times.aday", "10-15"],
            order_L: "order.partly",
            duration_L: ["duration.minutes", "10"]
        },
        timetables: "ref_timetables_avajurmo",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "ref_pricelists_alandstrafiken"
    },
    osnasava: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Vuosnainen - Åva",
        specifier_sv: "Osnäs - Åva",
        piers: ["ref_piers_vuosnainen", "ref_piers_ava"],
        operator: "ref_operators_alandstrafiken",
        vessels: ["ref_ferries_viggen"],
        features: {
            interval_L: ["times.aday", "3-4"],
            cost_L: "cost.applies",
            duration_L: ["duration.minutes", "40"]
        },
        timetables: "ref_timetables_osnasava",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "ref_pricelists_alandstrafiken"
    },
    sodralinjen: {
        name: "Södra linjen",
        name_fi: "Eteläinen linja",
        name_en: "Southern line",
        specifier: "Långnäs - Överö - Sottunga - Kökar - Galtby",
        piers: ["ref_piers_langnas", "ref_piers_overo", "ref_piers_sottunga", "ref_piers_huso", "ref_piers_kyrkogardso", "ref_piers_kokar", "ref_piers_galtby"],
        operator: "ref_operators_alandstrafiken",
        vessels: ["ref_ferries_gudingen", "ref_ferries_skiftet"],
        features: {
            interval_L: ["times.aday", "Långnäs - Kökar 3-4, Kökar - Galtby 0-2 "],
            cost_L: "cost.applies",
            duration: "Långnäs - Kökar 2.5&nbsp;hours, Kökar - Galtby 2.5&nbsp;hours",
            duration_fi: "Långnäs - Kökar 2,5&nbsp;tuntia, Kökar - Galtby 2,5&nbsp;tuntia",
            duration_sv: "Långnäs - Kökar 2,5&nbsp;timmar, Kökar - Galtby 2,5&nbsp;timmar",
        },
        timetables: "ref_timetables_sodralinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "ref_pricelists_alandstrafiken"
    },
    tvarlinjen: {
        name: "Tvärgående linjen",
        name_fi: "Poikittainen linja",
        name_en: "Cross line",
        specifier: "Långnäs - Överö - Sottunga - Snäckö",
        piers: ["ref_piers_langnas", "ref_piers_bergo", "ref_piers_overo", "ref_piers_sottunga", "ref_piers_snacko" ],
        operator: "ref_operators_alandstrafiken",
        vessels: ["ref_ferries_odin"],
        features: {
            interval_L: ["times.aday", "1-2"],
            cost_L: "cost.applies",
            duration_L: ["duration.hoursminutes", "1", "45"],
        },
        notes: [
            { 
                content: "<div>Bergö and Sottunga are not served regularly</div>",
                content_fi: "Bergössä ja Sottungassa poiketaan vain harvoin",
                content_sv: "Bergö och Sottunga trafikeras onvanligen"
            }
        ],
        timetables: "ref_timetables_tvarlinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "ref_pricelists_alandstrafiken"
    },

    iniokustavi: {
        name: "Iniö - Kustavi",
        name_sv: "Iniö - Gustavs",
        specifier: "",
        piers: ["ref_piers_kannvik", "ref_piers_heponiemi"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_aura"],
        features: {
            interval_L: ["times.aday", "5-8"],
            duration_L: ["duration.minutes", "25"],
        },
        timetables: "ref_timetables_iniokustavi",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/inio-kustavi-aura.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/inio-gustavs-aura.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/inio-kustavi-aura.html#timetables",
    },

    houtskarinio: {
        name: "Houtskär - Iniö",
        name_fi: "Houtskari - Iniö",
        specifier: "",
        piers: ["ref_piers_mossala", "ref_piers_dalen"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_antonia"],
        features: {
            interval_L: ["times.aday", "3-4"],
            duration_L: ["duration.minutes", "50"],
            seasonal_L: "seasonal.summers",
            cost_L: "cost.applies",
        },
        timetables: "ref_timetables_houtskarinio",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/saariston-rengastie-houtskari-inio.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/skargardens-ringvag-houtskar-inio.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/the-archipelago-houtskari-inio.html#timetables",
    },

    korpohoutskar: {
        name: "Korpo - Houtskär",
        name_fi: "Korppoo - Houtskari",
        specifier: "",
        piers: ["ref_piers_galtby", "ref_piers_kittuis"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_stellakorppoo", "ref_ferries_mergus"],
        features: {
            interval_L: ["times.aday", "10-12"],
            order_L: "order.partly",
            duration_L: ["duration.minutes", "35"],
        },

        timetables: null,
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/korppoo-houtskari.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/korpo-houtskar.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/korppoo-houtskari.html#timetables",
    },

    nagukorpo: {
        name: "Nagu - Korpo",
        name_fi: "Nauvo - Korppoo",
        specifier: "",
        piers: ["ref_piers_parnas", "ref_piers_retais"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_prostvik1", "ref_ferries_nagu2"],
        features: {
            interval_L: ["times.anhour", "1-4"],
            duration_L: ["duration.minutes", "5"],
        },

        timetables: null,
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/nauvo-korppoo.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/nagu-korpo.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/nauvo-korppoo.html#timetables",
    },

    pargasnagu: {
        name: "Pargas - Nagu",
        name_fi: "Parainen - Nauvo",
        specifier: "",
        piers: ["ref_piers_lillmalo", "ref_piers_prostvik"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_elektra", "ref_ferries_sterna", "ref_ferries_falco"],
        features: {
            interval_L: ["times.anhour", "1-4"],
            duration_L: ["duration.minutes", "10"],
        },

        timetables: null,
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/parainen-nauvo.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/pargas-nagu.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/parainen-nauvo.html#timetables",
    },

    nauvohanka: {
        name: "Lilla ringvägen",
        name_fi: "Pieni rengastie",
        specifier: "Nagu - Själö - Hanka",
        specifier_fi: "Nauvo - Seili - Hanka",
        piers: ["ref_piers_nagu", "ref_piers_seili", "ref_piers_hanka"],
        operator: "ref_operators_sinv",
        vessels: ["ref_ferries_ostern"],
        features: {
            interval_L: ["times.aday", "3"],
            duration_L: ["duration.minutes", "60"],
            seasonal_L: "seasonal.summers",
            cost_L: "cost.applies",
        },
        timetables: "ref_timetables_nauvohanka",
//        timetables_en: "ref_timetables_nauvohankaen",
        timetableslink: "http://www.ostern.fi/aikataulu",
        timetableslink_sv: "http://www.ostern.fi/aikataulu",
        timetableslink_en: "http://www.ostern.fi/en/schedule-fahrplan",
    },

    velkuataivassalo: {
        name: "Velkuan reitti",
        name_sv: "Velkua rutt",
        name_en: "Velkua route",
        specifier: "Teersalo - Hakkenpää",
        piers: ["ref_piers_teersalo", "ref_piers_hakkenpaa"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_mskivimo"],
        features: {
            interval_L: ["times.aday", "1-2"],
            duration_L: ["duration.minutes", "50"],
            seasonal_L: "seasonal.summers",
            note_fi: 'Osa <a href="#velkuanreitti">Velkuan reittiä</a>',
            note_sv: "Del av Velkua rutt",
            note_en: "Part of Velkua route",
            limit_L: "limit.cars_mc_bikes_only"
        },

        timetables: null,
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/velkuan-reitti-kivimo.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/velkua-rutt-kivimo.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/velkua-route-kivimo.html#timetables",
    },

    nagunorra: {
        name: "Nagu norra rutt",
        name_fi: "Nauvon pohjoinen reitti",
        name_en: "Nagu Northern Route",
        specifier: "",
        piers: ["ref_piers_nagu", "ref_piers_keso", "ref_piers_seili", "ref_piers_innamo", "ref_piers_jarvsor", "ref_piers_maskinnamo", "ref_piers_avensor", "ref_piers_lavarn"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_falko"],
        features: {
            interval_L: ["times.aday", "1-2"],
            order_L: "order.partly",
            duration: "Nagu - Åvensor 2&nbsp;hours",
            duration_fi: "Nauvo - Ahvensaari 2&nbsp;tuntia",
            duration_sv: "Nagu - Åvensor 2&nbsp;timmar"
        },
        notes: [
            { 
                content: "<div class=\"alert alert-danger\"><strong>Note!</strong> During the re-construction of Nagu harbour (spring 2018), Keso Varvet is used instead</div>",
                content_fi: "<div class=\"alert alert-danger\"><strong>Huom!</strong> Nauvon sataman muutostöiden ajan (kevät 2018) liikennöidään Keson telakalta</div>",
                content_sv: "<div class=\"alert alert-danger\"><strong>Obs!</strong> Under Nagu hamns renovering (vår 2018), används Keso varvet i stället</div>",
            }
        ],
        timetables: "ref_timetables_nagunorra",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/nauvon-pohjoinen-reitti-falko.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/nagu-norra-rutt-falko.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/nauvo-northern-route-falko.html#timetables",
    }

}

ferrydata = {
    routes: routes,
    ferries: ferries,
    operators: operators,
    piers: piers,
    timetables: timetables,
    pricelists: pricelists,
}

function sanitizePhone(num) {
    return num.replace(/\(.*\)/g, "").replace(/[-]/g, " ");
}

function phoneUri(num) {
    return "tel:" + num.replace(/\(.*\)/g, "").replace(/[ -]/g, "");
}

function getPhones(item) {
    if (item.phones) {
        var phones = Array.isArray(item.phones)? item.phones: [item.phones];
        return phones.map(function(phone) {
            if (typeof phone === 'object') {
                return { class: "phone", specifier: " - " + phone.name, text: sanitizePhone(phone.tel), uri: phoneUri(phone.tel) };
            } else {
                return { class: "phone", specifier: "", text: sanitizePhone(phone), uri: phoneUri(phone) };
            }
        });
    } else {
        return [];
    }
}

function getLocalizedItem(item, lang) {
    
    if (!(item instanceof Object)) {
        if (typeof item === 'string' && item.startsWith("ref_")) {
            console.log(item);
            var parts = item.split("_");
            var sub = ferrydata[parts[1]][parts[2]];
            sub.id = parts[2];
            return getLocalizedItem(deepCopy(sub), lang);
        } else {
            return item;
        }
    }

    if (item instanceof Array) {
        return item.map(function(i) { return getLocalizedItem(i, lang); });
    }

    var result = {}
    for (let key of Object.keys(item)) {
        if (key.endsWith("_L")) {
            var key1 = key.substring(0, key.length - 2);
            result[key1] = L(lang, item[key]);
        } else if (key.endsWith("_" + lang)) {
            var key1 = key.substring(0, key.length - 3);
            result[key1] = item[key];
        } else if (!/_..$/.test(key) && !result[key]) {
            result[key] = getLocalizedItem(item[key], lang);
        }
    }
    return result;
}

function getWww(item) {
    return item.www? [{ class: "www", text: item.www, specifier: "", uri: item.www, target: "info"}]: [];
}

function getEmail(item) {
    return item.email? [{ class: "email", text: item.email, specifier: "", uri: "mailto:" + item.email}]: [];
}

function deepCopy(object) {
    console.log(JSON.stringify(object));
    return JSON.parse(JSON.stringify(object));
}

function renderDate(date, lang) {
    var parts = date.split("-");
    var currentYear = new Date().getFullYear();
    return parts[2]+"."+parts[1]+"."+(parts[0] != currentYear? parts[0]: "");
}

function renderDates(fromD, toD, lang) {
    return renderDate(fromD, lang) + " - " + renderDate(toD, lang);
}

function routeInfo(route, lang) {
    route = getLocalizedItem(deepCopy(route), lang);
    var info = {};
    var contacts = [];
    info.name = route.name;
    info.specifier = route.specifier? route.specifier: "";
    
    info.vessels = route.vessels;
    info.vessels.forEach(function(vessel) {
        vessel.contact.name = vessel.name;
        contacts.push(vessel.contact);
        var features = [];
        if (vessel.capacity.cars) features.push({icon: "car", value: vessel.capacity.cars});
        if (vessel.capacity.persons) features.push({icon: "user", value: vessel.capacity.persons});
        if (vessel.features.cafe) features.push({icon: "coffee"});
        if (vessel.features.access) features.push({icon: "wheelchair"});
        vessel.features = features;
    });

    info.features =
    ["interval", "duration", "order", "booking", "cost", "seasonal", "note", "limit"]
        .filter(function(type) { return route.features[type]; })
        .map(function(type) { return { class: type, value: route.features[type]}; });

    var piers = route.piers;
    piers.forEach(function(pier) {
        pier.class = pier.type == 1? "mainpier": "";
        pier.specifier = pier.type == 1 && pier.mun != pier.name ? "(" + pier.mun  + ")": "";
        pier.link = "#" + pier.id;
    });
    piers[piers.length - 1].last = true;
    info.piers = piers;

    info.notes = route.notes;

    info.operator = route.operator;
    info.operator.contact.name = info.operator.name;
    contacts.push(info.operator.contact);

    var timetables = route.timetables;
    var first = true;
    var id = 1;
    console.log(timetables);
    if (timetables) timetables.forEach(function(timetable) {
        timetable.dates = renderDates(timetable.validFrom, timetable.validTo, lang);
        timetable.active = first? "active": "";
        timetable.show = first? "show": "";
        timetable.tabid = "tab" + id;
        id++;
        first = false;
    });
    info.timetables = timetables;
    info.timetableslink = route.timetableslink;
    info.pricelists = route.pricelists;
    info.exttimetables = timetables? false: "external";

    contacts = contacts.map(function(contact) {
        var items = [];
        items = items.concat(getPhones(contact));
        items = items.concat(getEmail(contact));
        items = items.concat(getWww(contact));

        return {
            name: contact.name,
            items: items
        };
    });

    info.contacts = contacts;

    info.L = function () {
        return function(val, render) {
            return L(lang, render(val));
        };
    }
    
    return info;
}
