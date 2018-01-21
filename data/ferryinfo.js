
messages = { // FI SV EN
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
    Eckerö: { },
    Hammarland: { },
    Geta: { },
    Finstrom: { },
    Saltvik: { },
    Sund: { },
    Vårdö: { },
    Jomala: { },
    Mariehamn: { name_fi: "Maarianhamina"},
    Lemland: { },
    Lumparland: { },
    Föglö: { },
    Kumlinge: { },
    Sottunga: { },
    Kökar: { },
    Brändö: { },
    Iniö: { },
    Houtskär: { name_fi: "Houtskari"},
    Korpo: { name_fi: "Korppoo"},
    Nagu: { name_fi: "Nauvo"},
    Pargas: { name_fi: "Parainen"},
    Kaarina: { name_sv: "S:t Karins"},
    Turku: { name_sv: "Åbo"},
    Raisio: { name_sv: "Reso"},
    Rymattylä: { name_sv: "Rimito"},
    Merimasku: { },
    Askainen: { name_sv: "Villnäs"},
    Mietoinen: { },
    Velkua: {  },
    Taivassalo: { name_sv: "Tövsala" },
    Kustavi: { name_sv: "Gustavs" },
    Kimitoön: { name_fi: "Kemiönsaari"},
    Hitis: { name_fi: "Hiittinen"},
    Norrskata: { },
    Houtsala: { },
    Hanko: { name_sv: "Hangö"},
},

Object.keys(mun).forEach(function(key) {
    var m = mun[key];
    m.name = m.name? m.name: key;
});

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
    stellahiittinen: {
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
    Svinö: { name: "Svinö", mun: "Lumparland", type: "1",
        distances: [
            {
                to: "ref_mun_Mariehamn",
                dist: 27
            },{
                to: "ref_piers_Långnäs",
                dist: 7.1
            }
        ]
    },
    Degerby: { name: "Degerby", mun: "Föglö", type: "1",
        distances: [
            {
                to: "ref_piers_Överö",
                dist: 17
            }
        ]
    },
    Hummelvik: { mun: "Vårdö", type: "1" },
    Enklinge: { mun: "Kumlinge" },
    Kumlinge: { mun: "Kumlinge", type: "1" },
    Lappo: { mun: "Brändö" },
    Torsholma: { mun: "Brändö", type: "1" },
    Asterholma: { mun: "Brändö" },
    Åva: { mun: "Brändö", type: "1" },
    JurmoB: { name: "Jurmo", mun: "Brändö" },
    Vuosnainen: {  name_sv: "Osnäs", mun: "Kustavi", type: "1" },
    Långnäs: { mun: "Lumparland", type: "1" },
    Överö: { mun: "Föglö", type: "1" },
    Sottunga: { mun: "Sottunga", type: "1" },
    Husö: { mun: "Sottunga" },
    Kyrkogårdsö: { mun: "Kökar" },
    Kökar: { mun: "Kökar" },
    Galtby: { mun: "Korpo", type: "1" }, 
    Bergö: { mun: "Lumparland" },
    Snäckö: { mun: "Kumlinge", type: "1" }, 
    Kannvik: { mun: "Iniö", type: "1" }, 
    Heponiemi: { mun: "Kustavi", type: "1" }, 
    Dalen: { mun: "Iniö", type: "1" }, 
    Mossala: { mun: "Houtskär", type: "1" }, 
    Kittuis: { mun: "Houtskär", type: "1" }, 
    Olofsnäs: { mun: "Norrskata", type: "1" }, 
    Retais: { mun: "Korpo", type: "1" }, 
    Pärnäs: { name_fi: "Pärnäinen", mun: "Nagu", type: "1" }, 
    Nagu: { name_fi: "Nauvo", mun: "Nagu", type: "1" }, 
    Hanka: { mun: "Rymättylä", type: "1" }, 
    Teersalo: { mun: "Velkua", type: "1" }, 
    Hakkenpää: { mun: "Taivassalo", type: "1" }, 
    Kasnäs: { mun: "Kimitoön", type: "1" }, 
    LångnäsH: { mun: "Hitis", type: "1" }, 
    Haapala: { mun: "Rymättylä", type: "1" }, 
    Verkan: { mun: "Korpo", type: "1" }, 
    Kirjais: { mun: "Nagu", type: "1" }, 
    Granvik: { mun: "Pargas", type: "1" }, 
    Prostvik: { mun: "Nagu", type: "1" }, 
    Lillmälö: { mun: "Pargas", type: "1" }, 
    Dalsbruk: { name_fi: "Taalintehdas", mun: "Kimitoön", type: "1" }, 

    Rauhala: { mun: "Velkua" },
    Lailuoto: { mun: "Velkua" },
    Talosmeri: { mun: "Velkua" },
    Munninmaa: { mun: "Velkua" },
    Tammisluoto: { mun: "Velkua" },
    Liettinen: { mun: "Velkua" },
    Kettumaa: { mun: "Velkua" },
    Ruotsalainen: { mun: "Rymättylä" },
    Korvenmaa: { mun: "Rymättylä" },
    Pakinainen: { mun: "Rymättylä" },
    Pähkinäinen: { mun: "Rymättylä" },
    Samsaari: { mun: "Rymättylä" },
    Maisaari: { mun: "Rymättylä" },
    Finnö: { mun: "Korpo" },
    Käldersö: { mun: "Korpo" },
    Elvsö: { mun: "Korpo" },
    BerghamnK: { name: "Berghamn", mun: "Korpo" },
    Luk: { mun: "Korpo" },
    Lillpensor: { mun: "Korpo" },
    Storpensor: { mun: "Korpo" },
    Havträsk: { mun: "Norrskata", type: "1" }, 
    Brunskär: { mun: "Korpo" },
    Österskär: { mun: "Korpo" },
    Kälö: { mun: "Korpo" },
    Näsby: { mun: "Houtskär", type: "1" },
    Roslax: { mun: "Houtskär", type: "1" },
    Sördö: { mun: "Houtskär" },
    Lempnäs: { mun: "Houtskär" },
    Äpplö: { mun: "Houtskär" },
    Bockholm: { mun: "Houtskär" },
    Södö: { mun: "Houtskär" },
    Nåtö: { mun: "Houtskär" },
    Härklot: { mun: "Houtskär" },
    Själö: { mun: "Houtskär" },
    Norrby: { mun: "Iniö", type: "1" },
    Ytterstö: { mun: "Iniö" },
    Lempmo: { mun: "Iniö" },
    Salmis: { mun: "Iniö" },
    Lammholm: { mun: "Iniö" },
    Kvarnholm: { mun: "Iniö" },
    Åselholm: { mun: "Iniö" },
    Perkala: { mun: "Iniö" },
    Kolko: { mun: "Iniö" },
    TorsholmaI: { name: "Torsholma I", mun: "Brändö", type: "1" },
    Berghamn: { mun: "Nagu" },
    Nötö: { mun: "Nagu" },
    Aspö: { mun: "Nagu" },
    Jurmo: { mun: "Nagu" },
    Utö: { mun: "Nagu" },
    Keso: { name: "Keso varvet", name_fi: "Keson telakka", mun: "Nagu", type: "1" }, 
    Seili: { name: "Själö", name_fi: "Seili", mun: "Nagu" },
    Innamo: { mun: "Nagu" },
    Järvsor: { mun: "Nagu" },
    Maskinnamo: { mun: "Nagu" },
    Åvensor: { name_fi: "Ahvensaari", mun: "Nagu" },
    Lavarn: { mun: "Houtsala", type: "1" }, 
    Heisala: { mun: "Pargas" },
    Björkholm: { mun: "Pargas" },
    Ramsholm: { mun: "Pargas" },
    Aspholm: { mun: "Pargas" },
    ÖstraTallholm: { name: "Östra Tallholm", mun: "Pargas" },
    Kuggö: { mun: "Pargas" },
    PensarI: { name: "Pensar I", mun: "Pargas" },
    Krok: { mun: "Nagu"},
    Mattnäs: { mun: "Nagu"},
    Lånholm: { mun: "Nagu"},
    Fagerholm: { mun: "Nagu"},
    Killingholm: { mun: "Nagu"},
    Ängsö: { mun: "Nagu"},
    Tveskiftsholm: { mun: "Nagu"},
    Berghamn: { mun: "Nagu"},
    Hummelholm: { mun: "Nagu"},
    Rockelholm: { mun: "Nagu"},
    Ytterstholm: { mun: "Nagu"},
    Byskär: { mun: "Nagu"},
    Brännskär: { mun: "Nagu"},
    Grötö: { mun: "Nagu"},
    Stenskär: { mun: "Nagu"},
    Gullkrona: { mun: "Nagu"},
    PensarL: { name: "Pensar L", mun: "Nagu"},
    Peno: { mun: "Nagu"},
    Knivskär: { mun: "Nagu"},
    Kopparholm: { mun: "Nagu"},
    Träskholm: { mun: "Nagu"},
    Björkö: { mun: "Nagu"},
    Gloskär: { mun: "Nagu"},
    Trunsö: { mun: "Nagu"},
    Sandholm: { mun: "Nagu"},
    Lökholm: { mun: "Nagu"},
    Borstö: { mun: "Nagu"},
    Tunnhamn: { mun: "Kimitoön"},
    Vänö: { mun: "Kimitoön"},
    Holma: { mun: "Kimitoön"},
    Helsingholm: { mun: "Kimitoön"},
    Ängesö: { mun: "Kimitoön"},
    Bolax: { mun: "Kimitoön"},
    Botesö: { mun: "Kimitoön"},
    Djupö: { mun: "Kimitoön"},
    Vänoxaby: { name: "Vänoxa by", mun: "Kimitoön"},
    Vänoxasläten: { name: "Vänoxa släten (Bergö)", mun: "Kimitoön"},

}

Object.keys(piers).forEach(function(key) {
    var pier = piers[key];
    pier.name = pier.name? pier.name: key;
    pier.mun = mun[pier.mun];
    pier.type = pier.type? pier.type: "2";
});

console.log(piers);

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
    utorutt: { 
        link: "http://www.rosita.fi/",
        link_sv: "http://www.rosita.fi/Hemsida",
        link_en: "http://www.rosita.fi/Hemsida",
        tables: 
        [
            { validFrom: "2017-08-08", validTo: "2018-05-31", tables: ["EivorVinter2018_1.png", "EivorVinter2018_2.png", "EivorVinter2018_3.png"]}
        ],
    },
    korporutt: [
        { validFrom: "2017-09-01", validTo: "2018-05-31", tables: ["FiskoVinter2018_1.png", "FiskoVinter2018_2.png"]},
    ],
    nagunorra: [
        { validFrom: "2017-10-02", validTo: "2018-05-17", tables: ["FalkoVinter2018.png"]}
    ],
    nagutvar: { 
        link: "https://www.ferryway.fi/5",
        tables: 
        [
            { validFrom: "2017-11-01", validTo: "2018-03-31", tables: ["MyrskylintuVinter2018.png"]}
        ],
    },
    nagusodra: { 
        link: "https://www.ferryway.fi/6",
        tables: 
        [
            { validFrom: "2017-11-01", validTo: "2018-03-31", tables: ["NordepVinter2018.png"]}
        ],
    },
    hitisstella: {
        name: "M/S Stella",
        link: "https://kuljetus-savolainen.fi/yhteysalusliikenne/",
        tables: 
        [
            { validFrom: "2017-08-14", validTo: "2018-06-04", tables: ["StellaVinter2018_1.png", "StellaVinter2018_2.png"]}
        ],
    },
    hitisalva: { 
        name: "M/S Alva",
        link: "https://kuljetus-savolainen.fi/yhteysalusliikenne/",
        tables: 
        [
            { validFrom: "2017-08-14", validTo: null, tables: ["AlvaHost2017.png"]}
        ],
    },
    pargasrutt: {
        
        link: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/paraisten-reittialue-viken.html#timetables",
        link_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/pargas-ruttomrade-viken.html#timetables",
        link_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/parainen-route-viken.html#timetables",
        tables: [
        { validFrom: "2017-11-01", validTo: "2018-03-31", tables: ["VikenVinter2018_1.png", "VikenVinter2018_2.png"]}
        ],
    },

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
        piers: ["Svinö", "Degerby"],
        operator: "alandstrafiken",
        vessels: ["skarven"],
        features: {
            interval_L: ["times.aday", "8-12"],
            booking_L: "booking.cannot",
            cost_L: "cost.applies",
            duration_L: ["duration.minutes", "35"]
        },
        timetables: "foglolinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "alandstrafiken"
    },
    norralinjen: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Hummelvik - Enklinge - Kumlinge - Lappo - Torsholma",
        piers: ["Hummelvik", "Enklinge", "Kumlinge", "Lappo", "Torsholma"],
        operator: "alandstrafiken",
        vessels: ["alfageln", "knipan"],
        features: {
            interval_L: ["times.aday", "3-4"],
            cost_L: "cost.applies",
            duration_L: ["duration.hours", "2.5"],
        },
        timetables: "norralinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "alandstrafiken"
    },
    enklingelinjen: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Enklinge - Kumlinge",
        piers: ["Enklinge", "Kumlinge"],
        operator: "alandstrafiken",
        vessels: ["rosala"],
        features: {
            interval_L: ["times.aday", "~ 10"],
            booking_L: "booking.cannot",
            duration_L: ["duration.minutes", "15"]
        },
        timetables: "enklingelinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "alandstrafiken"
    },
    asterholmalinjen: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Asterholma - Lappo - Torsholma",
        piers: ["Asterholma", "Lappo", "Torsholma"],
        operator: "alandstrafiken",
        vessels: ["frida"],
        features: {
            interval_L: ["times.aday", "~ 10"],
            order_L: "order.partly",
            duration_L: ["duration.minutes", "35"]
        },
        timetables: "asterholmalinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "alandstrafiken"
    },
    avajurmo: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Åva - Jurmo",
        piers: ["Åva", "JurmoB"],
        operator: "alandstrafiken",
        vessels: ["doppingen"],
        features: {
            interval_L: ["times.aday", "10-15"],
            order_L: "order.partly",
            duration_L: ["duration.minutes", "10"]
        },
        timetables: "avajurmo",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "alandstrafiken"
    },
    osnasava: {
        name: "Norra linjen",
        name_fi: "Pohjoinen linja",
        name_en: "Northern line",
        specifier: "Vuosnainen - Åva",
        specifier_sv: "Osnäs - Åva",
        piers: ["Vuosnainen", "Åva"],
        operator: "alandstrafiken",
        vessels: ["viggen"],
        features: {
            interval_L: ["times.aday", "3-4"],
            cost_L: "cost.applies",
            duration_L: ["duration.minutes", "40"]
        },
        timetables: "osnasava",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "alandstrafiken"
    },
    sodralinjen: {
        name: "Södra linjen",
        name_fi: "Eteläinen linja",
        name_en: "Southern line",
        specifier: "Långnäs - Överö - Sottunga - Kökar - Galtby",
        piers: ["Långnäs", "Överö", "Sottunga", "Husö", "Kyrkogårdsö", "Kökar", "Galtby"],
        operator: "alandstrafiken",
        vessels: ["gudingen", "skiftet"],
        features: {
            interval_L: ["times.aday", "Långnäs - Kökar 3-4, Kökar - Galtby 0-2 "],
            cost_L: "cost.applies",
            duration: "Långnäs - Kökar 2.5&nbsp;hours, Kökar - Galtby 2.5&nbsp;hours",
            duration_fi: "Långnäs - Kökar 2,5&nbsp;tuntia, Kökar - Galtby 2,5&nbsp;tuntia",
            duration_sv: "Långnäs - Kökar 2,5&nbsp;timmar, Kökar - Galtby 2,5&nbsp;timmar",
        },
        timetables: "sodralinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "alandstrafiken"
    },
    tvarlinjen: {
        name: "Tvärgående linjen",
        name_fi: "Poikittainen linja",
        name_en: "Cross line",
        specifier: "Långnäs - Överö - Sottunga - Snäckö",
        piers: ["Långnäs", "Bergö", "Överö", "Sottunga", "Snäckö" ],
        operator: "alandstrafiken",
        vessels: ["odin"],
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
        timetables: "tvarlinjen",
        timetableslink: "http://www.alandstrafiken.ax/fi/aikataulut",
        timetableslink_sv: "http://www.alandstrafiken.ax/sv/turlistor",
        timetableslink_en: "http://www.alandstrafiken.ax/en/timetables",
        pricelists: "alandstrafiken"
    },

    iniokustavi: {
        name: "Iniö - Kustavi",
        name_sv: "Iniö - Gustavs",
        specifier: "",
        piers: ["Kannvik", "Heponiemi"],
        operator: "finferries",
        vessels: ["aura"],
        features: {
            interval_L: ["times.aday", "5-8"],
            duration_L: ["duration.minutes", "25"],
        },
        timetables: "iniokustavi",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/inio-kustavi-aura.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/inio-gustavs-aura.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/inio-kustavi-aura.html#timetables",
    },

    houtskarinio: {
        name: "Houtskär - Iniö",
        name_fi: "Houtskari - Iniö",
        specifier: "",
        piers: ["Mossala", "Dalen"],
        operator: "finferries",
        vessels: ["antonia"],
        features: {
            interval_L: ["times.aday", "3-4"],
            duration_L: ["duration.minutes", "50"],
            seasonal_L: "seasonal.summers",
            cost_L: "cost.applies",
        },
        timetables: "houtskarinio",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/saariston-rengastie-houtskari-inio.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/skargardens-ringvag-houtskar-inio.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/the-archipelago-houtskari-inio.html#timetables",
    },

    korpohoutskar: {
        name: "Korpo - Houtskär",
        name_fi: "Korppoo - Houtskari",
        specifier: "",
        piers: ["Galtby", "Kittuis"],
        operator: "finferries",
        vessels: ["stellakorppoo", "mergus"],
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

    korponorrskata: {
        name: "Korpo - Norrskata",
        name_fi: "Korppoo - Norrskata",
        specifier: "",
        piers: ["Galtby", "Olofsnäs"],
        operator: "finferries",
        vessels: ["stellakorppoo", "mergus"],
        features: {
            interval_L: ["times.aday", "13-14"],
            order_L: "order.partly",
            duration_L: ["duration.minutes", "15"],
        },

        timetables: null,
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/korppoo-norrskata.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/korpo-norrskata.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/korppoo-norrskata.html#timetables",
    },

    nagukorpo: {
        name: "Nagu - Korpo",
        name_fi: "Nauvo - Korppoo",
        specifier: "",
        piers: ["Pärnäs", "Retais"],
        operator: "finferries",
        vessels: ["prostvik1", "nagu2"],
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
        piers: ["Lillmälö", "Prostvik"],
        operator: "finferries",
        vessels: ["elektra", "sterna", "falco"],
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
        piers: ["Nagu", "Seili", "Hanka"],
        operator: "sinv",
        vessels: ["ostern"],
        features: {
            interval_L: ["times.aday", "3"],
            duration_L: ["duration.minutes", "60"],
            seasonal_L: "seasonal.summers",
            cost_L: "cost.applies",
        },
        timetables: "nauvohanka",
        timetableslink: "http://www.ostern.fi/aikataulu",
        timetableslink_sv: "http://www.ostern.fi/aikataulu",
        timetableslink_en: "http://www.ostern.fi/en/schedule-fahrplan",
    },

    velkuataivassalo: {
        name: "Velkuan reitti",
        name_sv: "Velkua rutt",
        name_en: "Velkua route",
        specifier: "Teersalo - Hakkenpää",
        piers: ["Teersalo", "Hakkenpää"],
        operator: "finferries",
        vessels: ["mskivimo"],
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
        piers: ["Kasnäs", "LångnäsH"],
        operator: "finferries",
        vessels: ["aurora"],
        features: {
            interval_L: ["times.aday", "4-8"],
            duration_L: ["duration.minutes", "25"],
        },
        timetables: "kasnashitis",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/kasnas-hiittinen-aurora.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/kasnas-hitis-aurora.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/kasnas-hiittinen-aurora.html#timetables",
    },
    velkuanreitti: {
        name: "Velkuan reitti",
        name_sv: "Velkua rutt",
        name_en: "Velkua Route",
        specifier: "",
        piers: ["Teersalo", "Rauhala", "Lailuoto", "Talosmeri", "Munninmaa", "Tammisluoto", "Liettinen", "Kettumaa", "Hakkenpää"],
        operator: "finferries",
        vessels: ["mskivimo"],
        features: {
            interval_L: ["times.aday", "3-9"],
            order_L: "order.partly",
            duration_fi: "Teersalo - Teersalo 1-2 tuntia",
            duration_sv: "Teersalo - Teersalo 1-2 timmar",
            duration_en: "Teersalo - Teersalo 1-2 hours",
            seasonal_L: ["seasonal.summerspier", "Hakkenpää"],
            seealso: "#velkuataivassalo"
        },
        timetables: "velkuanreitti",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/velkuan-reitti-kivimo.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/velkua-rutt-kivimo.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/velkua-route-kivimo.html#timetables",
    },
    rymattylanreitti: {
        name: "Rymättylän reitti",
        name_sv: "Rimito rutt",
        name_en: "Rymättylä Route",
        specifier: "",
        piers: ["Haapala", "Ruotsalainen", "Korvenmaa", "Pakinainen", "Pähkinäinen", "Samsaari", "Maisaari"],
        operator: "savolainen",
        vessels: ["isla"],
        features: {
            interval_L: ["times.aday", "3-5"],
            order_L: "order.partly",
            duration_fi: "Haapala-Pakinainen 40 minuuttia",
            duration_sv: "Haapala-Pakinainen 40 minuter",
            duration_en: "Haapala-Pakinainen 40 minutes",
        },
        timetables: "rymattylanreitti",
        timetableslink: "https://kuljetus-savolainen.fi/yhteysalusliikenne/"
    },
    korporutt: {
        name: "Korppoon reitti",
        name_sv: "Korpo rutt",
        name_en: "Korpo Route",
        specifier: "",
        piers: ["Verkan", "Finnö", "Käldersö", "Elvsö", "BerghamnK", "Luk", "Kittuis", "Lillpensor", "Storpensor", "Havträsk", "Brunskär", "Österskär", "Kälö"],
        operator: "al",
        vessels: ["fisko"],
        features: {
            interval_L: ["times.adayaweek", "0-4", "Österskär", "2"],
            order_L: "order.only",
            duration_fi: "Haapala-Pakinainen 40 minuuttia",
            duration_sv: "Haapala-Pakinainen 40 minuter",
            duration_en: "Haapala-Pakinainen 40 minutes",
        },
        timetables: "korporutt",
        timetableslink: "http://skargardslinjer.fi/Korpo_ruttomrade",
        timetableslink_fi: "http://www.saaristolinjat.fi/Korppoon_reittialue"
    },
    houtskarrutt: {
        name: "Houtskarin reitti ja Iniön lisäreitti",
        name_sv: "Houtskär rutt och Iniö tilläggsrutt",
        name_en: "Houtskär Route and Iniö Additional Route",
        specifier: "",
        piers: ["Näsby","Roslax","Ytterstö","Lempmo","Salmis","Lammholm","Norrby","Sördö","Lempnäs","Äpplö","Nåtö","TorsholmaI","Själö","Härklot","Kvarnholm","Åselholm","Perkala","Kolko","Kannvik"],
        operator: "ferryway",
        vessels: ["karolina", "satava"],
        features: {
            interval_L: ["times.aday", "1-4"],
            order_L: "order.only",
            duration_fi: "Roslax - Torsholma " + L("fi", ["duration.hoursminutes", "2", "20"]),
            duration_sv: "Roslax - Torsholma " + L("sv", ["duration.hoursminutes", "2", "20"]),
            duration_en: "Roslax - Torsholma " + L("en", ["duration.hoursminutes", "2", "20"]),
        },
        timetables: ["houtskarrutt", "iniorutt"]
    },

    utorutt: {
        name: "Utön reitti",
        name_sv: "Utö rutt",
        name_en: "Utö Route",
        specifier: "",
        piers: ["Pärnäs", "Berghamn", "Nötö", "Aspö", "Jurmo", "Utö"],
        operator: "rosita",
        vessels: ["eivor"],
        features: {
            interval_L: ["times.aweek", "5"],
            duration_L: ["duration.hours", "4.5-5.5"],
        },
        notes: [ {content: "Bus connection in Pärnäs", content_sv: "Bussförbindelse i Pärnäs", content_fi: "Linja-autoyhteys Pärnäisissä" }],
        timetables: ["utorutt"],
    },

    nagunorra: {
        name: "Nagu norra rutt",
        name_fi: "Nauvon pohjoinen reitti",
        name_en: "Nagu Northern Route",
        specifier: "",
        piers: ["Nagu", "Keso", "Seili", "Innamo", "Järvsor", "Maskinnamo", "Åvensor", "Lavarn"],
        operator: "finferries",
        vessels: ["falko"],
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
        timetables: "nagunorra",
        timetableslink: "http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/nauvon-pohjoinen-reitti-falko.html#timetables",
        timetableslink_sv: "http://www.finferries.fi/sv/farjetrafik/farjplatserna-och-tidtabellerna/nagu-norra-rutt-falko.html#timetables",
        timetableslink_en: "http://www.finferries.fi/en/ferry-traffic/ferries-and-schedules/nauvo-northern-route-falko.html#timetables",
    },

    nagutvar: {
        name: "Nauvon poikittainen reitti",
        name_sv: "Nagu tvärgående rutt",
        name_en: "Nagu Cross Route",
        specifier: "",
        piers: ["Pärnäs", "Krok", "Mattnäs", "Lånholm", "Fagerholm", "Killingholm", "Ängsö", "Tveskiftsholm", "Berghamn", "Hummelholm", "Rockelholm", "Ytterstholm", "Byskär", "Brännskär", "Grötö", "Stenskär", "Gullkrona", "Kirjais"],
        operator: "ferryway",
        vessels: ["myrskylintu", "cheri"],
        features: {
            interval_L: ["times.aweek", "3"],
            order_L: ["order.only"],
            duration_L: ["duration.hoursminutes", "2", "30"], 
        },
        timetables: ["nagutvar"],
    },
 
    nagusodra: {
        name: "Nauvon eteläinen reitti",
        name_sv: "Nagu södra rutt",
        name_en: "Nagu Southern Route",
        specifier: "",
        piers: ["Kirjais", "PensarL", "Peno", "Brännskär", "Stenskär", "Gullkrona", "Grötö", "Knivskär", "Kopparholm", "Träskholm", "Björkö", "Gloskär", "Trunsö", "Sandholm", "Lökholm", "Borstö"],
        operator: "ferryway",
        vessels: ["nordep"],
        features: {
            interval_L: ["times.adayaweek", "1-3", "Borstö", "4"],
            order_L: ["order.only"],
            duration_fi: "Kirjais - Borstö " + L("fi", ["duration.hours", "3-5"]),
            duration_en: "Kirjais - Borstö " + L("sv", ["duration.hours", "3-5"]),
            duration_en: "Kirjais - Borstö " + L("en", ["duration.hours", "3-5"]),
        },
        timetables: ["nagusodra"],
    },
 
     pargasrutt: {
        name: "Paraisten reitti",
        name_sv: "Pargas rutt",
        name_en: "Pargas Route",
        specifier: "",
        piers: ["Granvik", "Heisala", "Björkholm", "Ramsholm", "Aspholm", "ÖstraTallholm", "Kuggö", "PensarI"],
        operator: "finferries",
        vessels: ["viken"],
        features: {
            interval_L: ["times.aday", "3-8"],
            order_L: ["order.partly"],
            duration_fi: "Granvik - Pensar n. tunti", 
            duration_sv: "Granvik - Pensar ca en timme", 
            duration_en: "Granvik - Pensar about an hour", 
        },
        timetables: ["pargasrutt"],
    },

    hitisrutt: {
        name: "Hiittisten reitti",
        name_sv: "Hitis rutt",
        name_en: "Hitis Route",
        specifier: "",
        piers: ["Kasnäs", "Tunnhamn", "Vänö", "Holma", "Helsingholm", "Ängesö", "Bolax", "Botesö", "Djupö", "Vänoxaby", "Vänoxasläten", "Dalsbruk"],
        operator: "savolainen",
        vessels: ["stellahiittinen", "alva"],
        features: {
            interval_L: ["times.aday", "1-3"],
            order_L: ["order.partly"],
            duration_fi: "Kasnäs - Vänö " + L("fi", ["duration.minutes", "60"]),
            duration_en: "Kasnäs - Vänö " + L("sv", ["duration.minutes", "60"]),
            duration_en: "Kasnäs - Vänö " + L("en", ["duration.minutes", "60"]),
        },
        timetables: ["hitisstella", "hitisalva"],
    },
}

Object.keys(routes).forEach(function(key) {
    var route = routes[key];
    route.piers = route.piers.map(function(pier) {
        if (!piers[pier]) { console.log(pier, "does not exist"); exit(); }
        return piers[pier];
    });
    route.vessels = route.vessels.map(function(vessel) {
        return ferries[vessel];
    });

    route.operator = operators[route.operator];
    route.pricelists = pricelists[route.pricelists];

    if (route.timetables && !Array.isArray(route.timetables)) route.timetables = [route.timetables];

    if (route.timetables) route.timetables = route.timetables.map(function(timetable) {

        timetable = timetables[timetable];

        // Backward compatibility
        if (Array.isArray(timetable) && timetable.length > 0 && timetable[0].validFrom) timetable = {link: route.timetableslink, name: route.name, specifier: route.specifier, tables: timetable};

        return timetable;
    });

    if (!route.timetables) route.timetables = [{ link: route.timetableslink }];

});

console.log(routes);

ferrydata = {
    routes: routes,
    ferries: ferries,
    operators: operators,
    piers: piers, mun: mun,
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
    if (!date) return "";
    var parts = date.split("-");
    // var currentYear = new Date().getFullYear();
    return parts[2]+"."+parts[1]+"."; //+(parts[0] != currentYear? parts[0]: "");
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
    info.exttimetables = timetables.tables? false: "external";
    
    info.pricelists = route.pricelists;

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

    console.log(info);
    
    return info;
}
