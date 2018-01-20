
messages = {
    duration: {
        minutes: ["{0} minuuttia", "{0} minuter", "{0} minutes"],
        hours: ["{0} tuntia", "{0} timmar", "{0} hours"],
        hoursminutes: ["{0} tuntia {1} minuuttia", "{0} timmar {1} minuter", "{0} hours {1} minutes"],
        hourminutes: ["1 tunti {0} minuuttia", "1 timme {0} minuter", "1 hour {0} minutes"],
    },
    times: {
        aday: ["{0} kertaa päivässä", "{0} gånger om dagen", "{0} times a day"],
        aweek: ["{0} kertaa viikossa", "{0} gånger om vecka", "{0} times a week"],
        onceaday: ["kerran päivässä", "en gång om dagen", "once a day"],
        anhour: ["{0} kertaa tunnissa", "{0} gånger om timme", "{0} times an hour"],
        adayaweek: ["{0} kertaa päivässä, {1} {2} kertaa viikossa",
                "{0} gånger om dagen, {1} {2} gånger om vecka", "{0} times a day, {1} {2} times a week"],
    },
    booking: {
        cannot: ["ei voi varata", "kan inte bokas", "booking not possible"],
    },
    order: {
        pieronly: ["{0} vain tilauksesta", "{0} bara på beställning", "{0} on demand only"],
        only: ["vain tilauksesta", "bara på beställning", "On demand only"],
        partly: ["osa vuoroista vain tilauksesta", "några turer bara på beställning", "Pre-order required for certain trips"],
    },
    cost: {
        applies: [ "Maksullinen", "Avgiftsbelagd", "Fee applies" ],
    },
    seasonal: {
        summers: [ "Vain kesäisin", "Bara på sommaren", "Only in summer"],
        summerspier: [ "{0} vain kesäisin", "{0} bara på sommaren", "{0} only in summer"]
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

mun = {
    eckero: { name: "Eckerö"},
    hammarland: { name: "Hammarland"},
    geta: { name: "Geta"},
    finstrom: { name: "Finström"},
    saltvik: { name: "Saltvik"},
    sund: { name: "Sund"},
    vardo: { name: "Vårdö"},
    jomala: { name: "Jomala"},
    mariehamn: { name: "Mariehamn", name_fi: "Maarianhamina"},
    lemland: { name: "Lemland"},
    lumparland: { name: "Lumparland"},
    foglo: { name: "Föglö"},
    kumlinge: { name: "Kumlinge"},
    sottunga: { name: "Sottunga"},
    kokar: { name: "Kökar"},
    brando: { name: "Brändö"},
    inio: { name: "Iniö"},
    houtskar: { name: "Houtskär", name_fi: "Houtskari"},
    korpo: { name: "Korpo", name_fi: "Korppoo"},
    nagu: { name: "Nagu", name_fi: "Nauvo"},
    pargas: { name: "Pargas", name_fi: "Parainen"},
    kaarina: { name: "Kaarina", name_sv: "S:t Karins"},
    turku: { name: "Turku", name_sv: "Åbo"},
    raisio: { name: "Raisio", name_sv: "Reso"},
    rymattyla: { name: "Rymättylä", name_sv: "Rimito"},
    merimasku: { name: "Merimasku"},
    askainen: { name: "Askainen", name_sv: "Villnäs"},
    mietoinen: { name: "Mietoinen"},
    velkua: { name: "Velkua" },
    taivassalo: { name: "Taivassalo", name_sv: "Tövsala" },
    kustavi: { name: "Kustavi", name_sv: "Gustavs" },
    kimitoon: { name: "Kimitoön", name_fi: "Kemiönsaari"},
    hitis: { name: "Hitis", name_fi: "Hiittinen"},
    norrskata: { name: "Norrskata"},
    houtsala: { name: "Houtsala"},
    hanko: { name: "Hanko", name_sv: "Hangö"},
},

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
            www_en: 'http://www.finferries.fi/en'
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
        mun: "ref_mun_lumparland",
        type: "1",
        distances: [
            {
                to: "ref_mun_mariehamn",
                dist: 27
            },{
                to: "ref_piers_langnas",
                dist: 7.1
            }
        ]
    },
    degerby: {
        name: "Degerby",
        mun: "ref_mun_foglo",
        type: "1",
        distances: [
            {
                to: "ref_piers_overo",
                dist: 17
            }
        ]
    },
    hummelvik: {
        name: "Hummelvik",
        mun: "ref_mun_vardo",
        type: "1",
    },
    enklinge: {
        name: "Enklinge",
        mun: "ref_mun_kumlinge",
        type: "2"
    },
    kumlinge: {
        name: "Kumlinge",
        mun: "ref_mun_kumlinge",
        type: "1",
    },
    lappo: {
        name: "Lappo",
        mun: "ref_mun_brando",
        type: "2"
    },
    torsholma: {
        name: "Torsholma",
        mun: "ref_mun_brando",
        type: "1",
    },
    asterholma: {
        name: "Asterholma",
        mun: "ref_mun_brando",
        type: "2"
    },
    ava: {
        name: "Åva",
        mun: "ref_mun_brando",
        type: "1",
    },
    jurmob: {
        name: "Jurmo",
        mun: "ref_mun_brando",
        type: "2"
    },
    vuosnainen: {
        name: "Vuosnainen",
        name_sv: "Osnäs",
        mun: "ref_mun_kustavi",
        type: "1",
    },
    langnas: {
        name: "Långnäs",
        mun: "ref_mun_lumparland",
        type: "1"
    },
    overo: {
        name: "Överö",
        mun: "ref_mun_foglo",
        type: "1"
    },
    sottunga: {
        name: "Sottunga",
        mun: "ref_mun_sottunga",
        type: "2"
    },
    huso: {
        name: "Husö",
        mun: "ref_mun_sottunga",
        type: "2"
    },
    kyrkogardso: {
        name: "Kyrkogårdsö",
        mun: "ref_mun_kokar",
        type: "2"
    },
    kokar: {
        name: "Kökar",
        mun: "ref_mun_kokar",
        type: "2"
    },
    galtby: {
        name: "Galtby",
        mun: "ref_mun_korpo",
        type: "1"
    },
    bergo: {
        name: "Bergö",
        mun: "ref_mun_lumparland",
        type: "2"
    },
    snacko: {
        name: "Snäckö",
        mun: "ref_mun_kumlinge",
        type: "1"
    },
    kannvik: {
        name: "Kannvik",
        mun: "ref_mun_inio",
        type: "1"
    },
    heponiemi: {
        name: "Heponiemi",
        mun: "ref_mun_kustavi",
        type: "1"
    },
    dalen: {
        name: "Dalen",
        mun: "ref_mun_inio",
        type: "1"
    },
    mossala: {
        name: "Mossala",
        mun: "ref_mun_houtskar",
        type: "1"
    },
    kittuis: {
        name: "Kittuis",
        mun: "ref_mun_houtskar",
        type: "1"
    },
    olofsnas: {
        name: "Olofsnäs",
        mun: "ref_mun_norrskata",
        type: "1"
    },
    retais: {
        name: "Retais",
        mun: "ref_mun_korpo",
        type: "1"
    },
    parnas: {
        name: "Pärnäs",
        name_fi: "Pärnäinen",
        mun: "ref_mun_nagu",
        type: "1"
    },
    nagu: {
        name: "Nagu",
        name_fi: "Nauvo",
        mun: "ref_mun_nagu",
        type: "1"
    },
    hanka: {
        name: "Hanka",
        mun: "ref_mun_rymattyla",
        type: "1"
    },
    teersalo: {
        name: "Teersalo",
        mun: "ref_mun_velkua",
        type: "1"
    },
    hakkenpaa: {
        name: "Hakkenpää",
        mun: "ref_mun_taivassalo",
        type: "1"
    },
    kasnas: {
        name: "Kasnäs",
        mun: "ref_mun_kimitoon",
        type: "1"
    },
    langnash: {
        name: "Långnäs",
        mun: "ref_mun_hitis",
        type: "1"
    },
    haapala: {
        name: "Haapala",
        mun: "ref_mun_rymattyla",
        type: "1"
    },
    verkan: {
        name: "Verkan",
        mun: "ref_mun_korpo",
        type: "1"
    },
    kirjais: {
        name: "Kirjais",
        mun: "ref_mun_nagu",
        type: "1"
    },
    granvik: {
        name: "Granvik",
        mun: "ref_mun_pargas",
        type: "1"
    },
    prostvik: {
        name: "Prostvik",
        mun: "ref_mun_nagu",
        type: "1"
    },
    lillmalo: {
        name: "Lillmälö",
        mun: "ref_mun_pargas",
        type: "1"
    },
    dalsbruk: {
        name: "Dalsbruk",
        name_fi: "Taalintehdas",
        mun: "ref_mun_kimitoon",
        type: "1"
    },

    rauhala: {
        name: "Rauhala",
        mun: "ref_mun_velkua",
        type: "2"
    },
    lailuoto: {
        name: "Lailuoto",
        mun: "ref_mun_velkua",
        type: "2"
    },
    talosmeri: {
        name: "Talosmeri",
        mun: "ref_mun_velkua",
        type: "2"
    },
    munninmaa: {
        name: "Munninmaa",
        mun: "ref_mun_velkua",
        type: "2"
    },
    tammisluoto: {
        name: "Tammisluoto", 
        mun: "ref_mun_velkua",
        type: "2"
    },
    liettinen: {
        name: "Liettinen", 
        mun: "ref_mun_velkua",
        type: "2"
    },
    kettumaa: {
        name: "Kettumaa",
        mun: "ref_mun_velkua",
        type: "2"
    },
    ruotsalainen: {
        name: "Ruotsalainen",
        mun: "ref_mun_rymattyla",
        type: "2"
    },
    korvenmaa: {
        name: "Korvenmaa",
        mun: "ref_mun_rymattyla",
        type: "2"
    },
    pakinainen: {
        name: "Pakinainen",
        mun: "ref_mun_rymattyla",
        type: "2"
    },
    pahkinainen: {
        name: "Pähkinäinen",
        mun: "ref_mun_rymattyla",
        type: "2"
    },
    samsaari: {
        name: "Samsaari",
        mun: "ref_mun_rymattyla",
        type: "2"
    },
    maisaari: {
        name: "Maisaari",
        mun: "ref_mun_rymattyla",
        type: "2"
    },
    finno: {
        name: "Finnö",
        mun: "ref_mun_korpo",
        type: "2"
    },
    kalderso: {
        name: "Käldersö",
        mun: "ref_mun_korpo",
        type: "2"
    },
    elvso: {
        name: "Elvsö",
        mun: "ref_mun_korpo",
        type: "2"
    },
    berghamnk: {
        name: "Berghamn",
        mun: "ref_mun_korpo",
        type: "2"
    },
    luk: {
        name: "Luk",
        mun: "ref_mun_korpo",
        type: "2"
    },
    lillpensor: {
        name: "Lillpensor",
        mun: "ref_mun_korpo",
        type: "2"
    },
    storpensor: {
        name: "Storpensor",
        mun: "ref_mun_korpo",
        type: "2"
    },
    havtrask: {
        name: "Havträsk",
        mun: "ref_mun_norrskata",
        type: "1"
    },
    brunskar: {
        name: "Brunskär",
        mun: "ref_mun_korpo",
        type: "2"
    },
    osterskar: {
        name: "Österskär",
        mun: "ref_mun_korpo",
        type: "2"
    },
    kalo: {
        name: "Kälö",
        mun: "ref_mun_korpo",
        type: "2"
    },

    nasby: { name: "Näsby", mun: "ref_mun_houtskar", type: "1" },
    roslax: { name: "Roslax", mun: "ref_mun_houtskar", type: "1" },
    sordo: { name: "Sördö", mun: "ref_mun_houtskar", type: "2" },
    lempnas: { name: "Lempnäs", mun: "ref_mun_houtskar", type: "2" },
    applo: { name: "Äpplö", mun: "ref_mun_houtskar", type: "2" },
    bockholm: { name: "Bockholm", mun: "ref_mun_houtskar", type: "2" },
    sodo: { name: "Södö", mun: "ref_mun_houtskar", type: "2" },
    nato: { name: "Nåtö", mun: "ref_mun_houtskar", type: "2" },
    harklot: { name: "Härklot", mun: "ref_mun_houtskar", type: "2" },
    sjalo: { name: "Själö", mun: "ref_mun_houtskar", type: "2" },

    norrby: { name: "Norrby", mun: "ref_mun_inio", type: "1" },
    yttersto: { name: "Ytterstö", mun: "ref_mun_inio", type: "2" },
    lempmo: { name: "Lempmo", mun: "ref_mun_inio", type: "2" },
    salmis: { name: "Salmis", mun: "ref_mun_inio", type: "2" },
    lammholm: { name: "Lammholm", mun: "ref_mun_inio", type: "2" },
    kvarnholm: { name: "Kvarnholm", mun: "ref_mun_inio", type: "2" },
    aselholm: { name: "Åselholm", mun: "ref_mun_inio", type: "2" },
    perkala: { name: "Perkala", mun: "ref_mun_inio", type: "2" },
    kolko: { name: "Kolko", mun: "ref_mun_inio", type: "2" },

    torsholmai: { name: "Torsholma I", mun: "ref_mun_brando", type: "1" },

    keso: {
        name: "Keso varvet",
        name_fi: "Keson telakka",
        mun: "ref_mun_nagu",
        type: "1"
    },
    seili: {
        name: "Själö",
        name_fi: "Seili",
        mun: "ref_mun_nagu",
        type: "2"
    },
    innamo: {
        name: "Innamo",
        mun: "ref_mun_nagu",
        type: "2"
    },
    jarvsor: {
        name: "Järvsor",
        mun: "ref_mun_nagu",
        type: "2"
    },
    maskinnamo: {
        name: "Maskinnamo",
        mun: "ref_mun_nagu",
        type: "2"
    },
    avensor: {
        name: "Åvensor",
        name_fi: "Ahvensaari",
        mun: "ref_mun_nagu",
        type: "2"
    },
    lavarn: {
        name: "Lavarn",
        mun: "ref_mun_houtsala",
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
        { validFrom: "2018-05-18", validTo: "2018-09-02", tables: ["Ostern2018_fisv.png"], tables_en: ["Ostern2018_ende.png"]},
    ],
    kasnashitis: [
        { validFrom: "2018-01-01", validTo: "2018-12-31", tables: ["Aurora2018.png"]},
    ],

    velkuanreitti: [
        { validFrom: "2017-09-01", validTo: "2018-05-31", tables: ["KivimoVinter2018_1.png", "KivimoVinter2018_2.png"]}
    ],
    rymattylanreitti: [
        { validFrom: "2017-09-04", validTo: "2018-06-03", tables: ["IslaVinter2018_1.png", "IslaVinter2018_2.png"]}
    ],
    houtskarrutt: { name: "Houtskarin reitti", name_sv: "Houtskär rutt", name_en: "Houtskär Route", specifier: "",
        link: "http://www.ferryway.fi/7",
        tables: 
        [
            { validFrom: "2017-10-01", validTo: "2018-04-15", tables: ["KarolinaVinter2018_1.png", "KarolinaVinter2018_2.png"]}
        ],
    },
    iniorutt: { name: "Iniön lisäreitti", name_sv: "Iniö tilläggsrutt", name_en: "Iniö Additional Route", specifier: "",
        link: "http://www.ferryway.fi/8",
        tables: 
        [
            { validFrom: "2017-14-08", validTo: "2018-05-13", tables: ["SatavaVinter2018_1.png", "SatavaVinter2018_2.png"]}
        ],
    },
    korporutt: [
        { validFrom: "2017-09-01", validTo: "2018-05-31", tables: ["FiskoVinter2018_1.png", "FiskoVinter2018_2.png"]},
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
            duration_L: ["duration.hourminutes", "45"],
            order_L: ["order.pieronly", "Överö"],
        },
        notes: [
            { 
                content: "<div>Bergö and Sottunga are not served regularly</div>",
                content_fi: "Bergössä ja Sottungassa poiketaan vain harvoin",
                content_sv: "Bergö och Sottunga trafikeras ovanligen"
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
            seealso_fi: 'Osa <a href="#velkuanreitti">Velkuan reittiä</a>',
            seealso_sv: "Del av Velkua rutt",
            seealso_en: "Part of Velkua route",
            limit_L: "limit.cars_mc_bikes_only"
        },

        timetables: null,
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/velkuan-reitti-kivimo.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/velkua-rutt-kivimo.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/velkua-route-kivimo.html#timetables",
    },

    kasnashitis: {
        name: "Kasnäs - Hitis",
        name_fi: "Kasnäs - Hiittinen",
        specifier: "",
        piers: ["ref_piers_kasnas", "ref_piers_langnash"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_aurora"],
        features: {
            interval_L: ["times.aday", "4-8"],
            duration_L: ["duration.minutes", "25"],
        },
        timetables: "ref_timetables_kasnashitis",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/kasnas-hiittinen-aurora.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/kasnas-hitis-aurora.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/kasnas-hiittinen-aurora.html#timetables",
    },
    velkuanreitti: {
        name: "Velkuan reitti",
        name_sv: "Velkua rutt",
        name_en: "Velkua Route",
        specifier: "",
        piers: ["ref_piers_teersalo", "ref_piers_rauhala", "ref_piers_lailuoto", "ref_piers_talosmeri", "ref_piers_munninmaa", "ref_piers_tammisluoto", "ref_piers_liettinen", "ref_piers_kettumaa", "ref_piers_hakkenpaa"],
        operator: "ref_operators_finferries",
        vessels: ["ref_ferries_mskivimo"],
        features: {
            interval_L: ["times.aday", "3-9"],
            order_L: "order.partly",
            duration_fi: "Teersalo - Teersalo 1-2 tuntia",
            duration_sv: "Teersalo - Teersalo 1-2 timmar",
            duration_en: "Teersalo - Teersalo 1-2 hours",
            seasonal_L: ["seasonal.summerspier", "Hakkenpää"],
            seealso: "#velkuataivassalo"
        },
        timetables: "ref_timetables_velkuanreitti",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/velkuan-reitti-kivimo.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/velkua-rutt-kivimo.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/velkua-route-kivimo.html#timetables",
    },
    rymattylanreitti: {
        name: "Rymättylän reitti",
        name_sv: "Rimito rutt",
        name_en: "Rymättylä Route",
        specifier: "",
        piers: ["ref_piers_haapala", "ref_piers_ruotsalainen", "ref_piers_korvenmaa", "ref_piers_pakinainen", "ref_piers_pahkinainen", "ref_piers_samsaari", "ref_piers_maisaari"],
        operator: "ref_operators_savolainen",
        vessels: ["ref_ferries_isla"],
        features: {
            interval_L: ["times.aday", "3-5"],
            order_L: "order.partly",
            duration_fi: "Haapala-Pakinainen 40 minuuttia",
            duration_sv: "Haapala-Pakinainen 40 minuter",
            duration_en: "Haapala-Pakinainen 40 minutes",
        },
        timetables: "ref_timetables_rymattylanreitti",
        timetableslink: "https://kuljetus-savolainen.fi/yhteysalusliikenne/"
    },
    korporutt: {
        name: "Korppoon reitti",
        name_sv: "Korpo rutt",
        name_en: "Korpo Route",
        specifier: "",
        piers: ["ref_piers_verkan", "ref_piers_finno", "ref_piers_kalderso", "ref_piers_elvso", "ref_piers_berghamnk", "ref_piers_luk", "ref_piers_kittuis", "ref_piers_lillpensor", "ref_piers_storpensor", "ref_piers_havtrask", "ref_piers_brunskar", "ref_piers_osterskar", "ref_piers_kalo"],
        operator: "ref_operators_al",
        vessels: ["ref_ferries_fisko"],
        features: {
            interval_L: ["times.adayaweek", "0-4", "Österskär", "2"],
            order_L: "order.only",
            duration_fi: "Haapala-Pakinainen 40 minuuttia",
            duration_sv: "Haapala-Pakinainen 40 minuter",
            duration_en: "Haapala-Pakinainen 40 minutes",
        },
        timetables: "ref_timetables_korporutt",
        timetableslink: "http://skargardslinjer.fi/Korpo_ruttomrade",
        timetableslink_fi: "http://www.saaristolinjat.fi/Korppoon_reittialue"
    },
    houtskarrutt: {
        name: "Houtskarin reitti ja Iniön lisäreitti",
        name_sv: "Houtskär rutt och Iniö tilläggsrutt",
        name_en: "Houtskär Route and Iniö Additional Route",
        specifier: "",
        piers: ["ref_piers_nasby","ref_piers_roslax","ref_piers_yttersto","ref_piers_lempmo","ref_piers_salmis","ref_piers_lammholm","ref_piers_norrby","ref_piers_sordo","ref_piers_lempnas","ref_piers_applo","ref_piers_nato","ref_piers_torsholmai","ref_piers_sjalo","ref_piers_harklot","ref_piers_kvarnholm","ref_piers_aselholm","ref_piers_perkala","ref_piers_kolko","ref_piers_kannvik"],
        operator: "ref_operators_ferryway",
        vessels: ["ref_ferries_karolina", "ref_ferries_satava"],
        features: {
            interval_L: ["times.aday", "1-4"],
            order_L: "order.only",
            duration_fi: "Roslax - Torsholma " + L("fi", ["duration.hoursminutes", "2", "20"]),
            duration_sv: "Roslax - Torsholma " + L("sv", ["duration.hoursminutes", "2", "20"]),
            duration_en: "Roslax - Torsholma " + L("en", ["duration.hoursminutes", "2", "20"]),
        },
        timetables: ["ref_timetables_houtskarrutt", "ref_timetables_iniorutt"]
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
            duration_fi: "Nauvo - Ahvensaari " + L("fi", ["duration.hours", "2"]),
            duration_sv: "Nagu - Åvensor " + L("sv", ["duration.hours", "2"]),
            duration_en: "Nagu - Åvensor " + L("en", ["duration.hours", "2"]),
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
    mun: mun,
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
    return item.www? [{ class: "www", text: item.www.replace(/^http(s?):\/\//,"").replace(/\/$/, ""), specifier: "", uri: item.www, target: "info"}]: [];
}

function getEmail(item) {
    return item.email? [{ class: "email", text: item.email, specifier: "", uri: "mailto:" + item.email}]: [];
}

function getFb(item) {
    console.log(item);
    return item.fb? [{ class: "facebook", text: item.name,  specifier: "", uri: item.fb, target:"facebook" }]: [];
}

function deepCopy(object) {
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
    ["interval", "duration", "order", "booking", "cost", "seasonal", "limit", "seealso"]
        .filter(function(type) { return route.features[type]; })
        .map(function(type) { return { class: type, value: route.features[type]}; });

    var piers = route.piers;
    piers.forEach(function(pier) {
        pier.class = pier.type == 1? "mainpier": "";
        pier.specifier = pier.type == 1 && pier.mun.name != pier.name ? "(" + pier.mun.name  + ")": "";
        pier.link = "#" + pier.id;
    });
    piers[piers.length - 1].last = true;
    info.piers = piers;

    info.notes = route.notes;

    info.operator = route.operator;
    info.operator.contact.name = info.operator.name;
    contacts.push(info.operator.contact);

    var timetables = route.timetables;

    console.log(timetables);

    // Backward compatibility
    if (timetables.length > 0 && timetables[0].validFrom) timetables = [{link: route.timetableslink, name: route.name, specifier: route.specifier, tables: timetables}];
 
    var index = 0;
    timetables.forEach(function(timetable) {
        timetable.buttonspecifier = timetables.length > 1? timetable.name? timetable.name: timetable.specifier: "";
        timetable.name1 = timetable.name;
        timetable.index = index++;
        var first = true;
        var id = 1;
        if (timetable.tables) timetable.tables.forEach(function(table) {
            table.dates = renderDates(table.validFrom, table.validTo, lang);
            table.active = first? "active": "";
            table.show = first? "show": "";
            table.tabid = "tab" + id;
            id++;
            first = false;
        });
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
        items = items.concat(getFb(contact));

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
