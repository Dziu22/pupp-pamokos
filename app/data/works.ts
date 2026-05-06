export type ArgumentLevel = "paprasta" | "vidutine" | "stipresne";

export type ArgumentEntry = {
  idea: string;
  event: string;
  connection: string;
};

export type ArgumentBank = Record<ArgumentLevel, ArgumentEntry>;

function makeArgumentBank(argumentBank: ArgumentBank) {
  return argumentBank;
}

export type Work = {
  id: string;
  title: string;
  author: string;
  authorDates: string;
  period: string;
  genre: string;
  mainIdea: string;
  problem: string;
  characters: string[];
  situation: string;
  howToUseInEssay: string;
  themes: string[];
  sampleArgument: string;
  commonMistakes: string;
  argumentBank: ArgumentBank;
  lastDay?: string[];
};

export const topicExamples = [
  "Ar sunkumai stiprina žmogų?",
  "Ar jaunam žmogui svarbi laisvė?",
  "Ar visada verta klausyti sąžinės?",
  "Ar išvaizda gali lemti žmogaus likimą?",
  "Ar šeima visada suteikia saugumą?",
  "Ar pavydas gali sunaikinti žmogų?",
  "Ar žmogus atsako už savo pasirinkimus?",
  "Ar verta aukotis dėl kitų?",
  "Ar abejonės trukdo žmogui veikti?",
  "Ar žmogui svarbu turėti tikslą?",
  "Ar meilė visada suteikia laimę?",
  "Ar žmogus gali išlikti žmogiškas sunkiose sąlygose?",
];

export const pastPuppTopicStyleExamples = [
  "Ar galima savo trūkumus paversti privalumais?",
  "Kodėl svarbu išmanyti savo šalies istoriją?",
  "Ar tiesa, kad apie žmogų reikia spręsti iš jo darbų, o ne žodžių?",
  "Kodėl reikia vertinti tradicijas?",
  "Nemesk kelio dėl takelio.",
  "Jei nėra pasitikėjimo, nėra ir draugystės.",
  "Ar mylėti reikia drąsos?",
  "Kodėl reikia gyventi ir dėl kitų?",
  "Nelaimė parodo ir draugą, ir priešą.",
  "Ar mano laimė - mano rankose?",
  "Kas lavina žmogaus vaizduotę?",
  "Kodėl žmogui svarbi tėvynė?",
  "Ar meilė tėvynei gali padėti žmogui išlikti?",
  "Kodėl svarbu saugoti tautos atmintį?",
  "Ar žmogaus darbai visada pasako daugiau negu žodžiai?",
  "Ar sunkumai atskleidžia tikrąjį žmogaus veidą?",
  "Kodėl žmogui svarbu turėti moralinį pagrindą?",
];

export const works: Work[] = [
  {
    id: "marti",
    title: "Marti",
    author: "Žemaitė, realistė",
    authorDates: "1845-1921",
    period: "XX a. pradžia",
    genre: "Apsakymas",
    mainIdea: "Žemaitė parodo, kad prievartinė nelaiminga santuoka, emocinis šaltumas ir artimųjų abejingumas gali palaužti žmogų.",
    problem: "Kaip žmogų veikia artimųjų abejingumas ir nelaiminga santuoka?",
    characters: ["Katrė", "Jonas", "Vingiai", "anyta", "šešuras"],
    situation: "Katrė per prievartą ištekinama už Vingių šeimos sūnaus ne iš meilės, o dėl naudos ir šeimos interesų. Vingių šeima šiurkšti, abejinga, linkusi girtauti. Katrė nesijaučia mylima ar gerbiama, patiria vyro ir uošvių emocinį šaltumą, sunkiai suserga ir miršta nesulaukusi tinkamos pagalbos.",
    howToUseInEssay: "Tinka parodyti, kad žmogų palaužia ne vien sunkus gyvenimas, o prievartiniai santykiai, nepagarba ir artimųjų abejingumas.",
    themes: ["abejingumas", "prievarta", "nelaiminga santuoka", "šeimos santykiai", "moters padėtis", "kodėl žmogus tampa nelaimingas", "artimųjų šaltumas", "ar šeima visada suteikia saugumą", "žmogaus kančia", "kitų žmonių įtaka žmogui"],
    sampleArgument: "Žemaitės apsakyme „Marti“ Katrė per prievartą ištekinama į šeimą, kurioje nejaučia meilės ir pagarbos. Vyro bei uošvių abejingumas ją palaužia, todėl kūrinys rodo, kad žmogų naikina emocinis šaltumas ir prievartiniai santykiai.",
    commonMistakes: "Nerašyti apie darbą: Katrės niekas nevertė dirbti, kūrinys tiesiog ne apie tai. Svarbiausia - prievartinė nelaiminga santuoka, emocinis šaltumas, nepagarba ir vyro bei uošvių abejingumas.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Prievartinė santuoka gali padaryti žmogų nelaimingą.",
            event: "Katrė ištekinama už Jono Vingiaus ne iš meilės, o dėl šeimos ir ūkinių interesų.",
            connection: "Ši situacija rodo, kad žmogus tampa nelaimingas, kai neturi teisės pats rinktis savo gyvenimo."
      },
      vidutine: {
            idea: "Žmogų palaužia ne vien sunkumai, bet ir artimųjų abejingumas.",
            event: "Katrė Vingių namuose nesulaukia nei vyro, nei uošvių meilės, pagarbos ar rūpesčio.",
            connection: "Todėl kūrinys tinka kalbant apie tai, kad artimųjų šaltumas gali būti skaudesnis už fizinius sunkumus."
      },
      stipresne: {
            idea: "Prievarta ir abejingumas naikina žmogaus orumą.",
            event: "Katrė, patekusi į nelaimingą santuoką, galiausiai sunkiai suserga ir nesulaukia tinkamos pagalbos.",
            connection: "Žemaitė parodo, kad žmogų gali sunaikinti santykiai, kuriuose nėra nei laisvės, nei užuojautos, nei pagarbos."
      }
}),
    lastDay: ["Katrė per prievartą ištekinama į Vingių šeimą.", "Ją palaužia nelaiminga santuoka, emocinis šaltumas ir artimųjų abejingumas.", "Nerašyk apie darbą: jos niekas nevertė dirbti, kūrinys ne apie tai."],
  },
  {
    id: "dorianas",
    title: "Doriano Grėjaus portretas",
    author: "Oskaras Vaildas (Oscar Wilde)",
    authorDates: "1854-1900",
    period: "XIX a. pab.",
    genre: "Romanas",
    mainIdea: "Moralės atsisakymas, savanaudiškumas ir pasidavimas malonumams pražudo žmogų.",
    problem: "Ar grožis svarbesnis už moralę?",
    characters: ["Dorianas Grėjus", "Lordas Henris", "Sibilė Vein"],
    situation: "Dorianas Grėjus trokšta likti amžinai jaunas ir gražus. Jo portretas rodo moralinį nuopuolį, o pats Dorianas Grėjus vis labiau renkasi ydų kelią.",
    howToUseInEssay: "Tinka temoms apie narciziškumą, kitų įtaką, moralę, pasirinkimus ir žmogaus pražūtį.",
    themes: ["narciziškumas", "kitų žmonių įtaka", "moralė", "žmogaus pasirinkimai", "žmogaus pražūtis", "grožis", "atsakomybės vengimas"],
    sampleArgument: "Oskaro Vaildo romane Dorianas Grėjus pats renkasi ydų kelią, todėl jo pražūtį lemia ne portretas, o moralės atsisakymas.",
    commonMistakes: "Dorianas Grėjus blogėja ne dėl paveikslo. Jis pats renkasi ydų kelią.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Grožis be moralės žmogaus neišgelbsti.",
            event: "Dorianas trokšta likti amžinai jaunas, o jo portretas sensta ir rodo jo nuodėmes.",
            connection: "Ši situacija leidžia teigti, kad išorinis grožis nieko vertas, jei žmogus praranda sąžinę."
      },
      vidutine: {
            idea: "Savimeilė gali sunaikinti žmogaus moralę.",
            event: "Dorianas vis labiau rūpinasi savo išvaizda ir malonumais, bet jo portretas atspindi didėjantį vidinį nuopuolį.",
            connection: "Todėl kūrinys tinka temoms apie tai, kaip savanaudiškumas ir tuštybė griauna žmogų iš vidaus."
      },
      stipresne: {
            idea: "Žmogus, slepiantis moralinį nuopuolį po gražia išore, galiausiai praranda save.",
            event: "Dorianas bando sunaikinti portretą, kuris rodo jo tikrąją būseną, tačiau taip sunaikina ir save.",
            connection: "Vaildas parodo, kad nuo sąžinės pabėgti neįmanoma - žmogaus pasirinkimai vis tiek turi pasekmes."
      }
}),
  },
  {
    id: "vakaru-fronte",
    title: "Vakarų fronte nieko naujo",
    author: "Erichas Marija Remarkas (Erich Maria Remarque)",
    authorDates: "1898-1970",
    period: "XX a.",
    genre: "Romanas",
    mainIdea: "Karas naikina jaunystę, žmogiškumą ir žmogaus vidinį pasaulį.",
    problem: "Kaip karas pakeičia žmogų?",
    characters: ["Paulis Boimeris", "Kroppas", "Katčinskis", "jauni kareiviai"],
    situation: "Jauni žmonės patenka į Pirmojo pasaulinio karo frontą ir pamato, kad karas nėra didvyriškas nuotykis, o žmogų žalojanti katastrofa.",
    howToUseInEssay: "Tinka, kai reikia parodyti istorinių aplinkybių poveikį, karo beprasmybę ir jaunystės praradimą.",
    themes: ["karo beprasmybė", "istorinių aplinkybių poveikis", "žmogaus kančia", "jaunystės praradimas", "žmogiškumo praradimas"],
    sampleArgument: "Remarque romane karas sugriauna jaunų žmonių gyvenimus ir parodo, kad istorinės katastrofos naikina žmogų iš vidaus.",
    commonMistakes: "Kūrinys neheroizuoja karo. Jis rodo karo žalą žmogui.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Karas sugriauna jaunų žmonių gyvenimus.",
            event: "Paulius Boimeris ir jo draugai iš mokyklos patenka į frontą ir susiduria su mirtimi.",
            connection: "Ši situacija rodo, kad karas atima jaunystę ir saugumo jausmą."
      },
      vidutine: {
            idea: "Karas naikina žmogaus vidinį pasaulį.",
            event: "Frontas priverčia kareivius priprasti prie mirties, bado, baimės ir draugų žūties.",
            connection: "Todėl romanas tinka temoms apie istorinių aplinkybių poveikį žmogui."
      },
      stipresne: {
            idea: "Karas paverčia žmogų išgyvenimo įrankiu, atimdamas jo svajones ir žmogiškumą.",
            event: "Paulius grįžęs namo nebesijaučia savas, nes karo patirtis jį atskiria nuo ankstesnio gyvenimo.",
            connection: "Remarkas parodo, kad karas sunaikina ne tik kūną, bet ir žmogaus ryšį su savimi bei pasauliu."
      }
}),
    lastDay: ["Romanas rodo jaunų žmonių patirtį Pirmojo pasaulinio karo fronte.", "Karas čia nėra heroizuojamas - jis naikina jaunystę ir žmogiškumą.", "Naudok temoms apie karą, istorinių aplinkybių poveikį ir žmogaus kančią."],
  },
  {
    id: "kuprelis",
    title: "Kuprelis",
    author: "Ignas Šeinius",
    authorDates: "1889-1959",
    period: "XX a. pradžia",
    genre: "Romanas",
    mainIdea: "Nelaiminga meilė ir atskirtis žeidžia žmogų, bet gali atverti jo vidinį gilumą.",
    problem: "Kaip žmogų veikia aplinkiniai?",
    characters: ["Kuprelis / Olesis", "Gundė"],
    situation: "Kuprelis dėl išvaizdos patiria atskirtį, o Gundės išdavystė jį skaudžiai sužeidžia. Vis dėlto jis išlieka dvasiškai jautrus ir gilus.",
    howToUseInEssay: "Tinka temoms apie nelaimingą meilę, kitų įtaką, vienišumą, vidinį pasaulį ir tautinę savimonę.",
    themes: ["nelaiminga meilė", "kitų žmonių įtaka", "tautinė savimonė", "žmogaus vienišumas", "vidinis pasaulis", "jautrumas"],
    sampleArgument: "Ignas Šeinius rodo, kad Kuprelio kančia nėra silpnumas: nelaiminga meilė ir atskirtis jį skatina giliau suvokti save.",
    commonMistakes: "Kuprelis nėra silpnas žmogus. Jis labai jautrus ir dvasiškai gilus.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Nelaiminga meilė gali žmogų skaudinti, bet kartu priversti giliau susimąstyti apie save.",
            event: "Kuprelis įsimyli Gundę, tačiau ji jį išduoda ir palieka skaudų vidinį išgyvenimą.",
            connection: "Ši situacija rodo, kad sunkumai žmogų gali pakeisti iš vidaus, jeigu jis savo skausmą apmąsto."
      },
      vidutine: {
            idea: "Skausminga patirtis gali tapti vidinio brendimo priežastimi.",
            event: "Po Gundės išdavystės Kuprelis lieka vienišas, tačiau savo kančią sieja su gamta, Dievu ir likimo išbandymais.",
            connection: "Todėl Kuprelio istorija tinka kalbant apie tai, kad kančia gali ugdyti žmogaus dvasinę stiprybę."
      },
      stipresne: {
            idea: "Žmogaus atskirtis ir nelaiminga meilė gali atverti gilesnį santykį su savimi ir pasauliu.",
            event: "Kuprelis dėl savo išvaizdos ir nelaimingos meilės pasitraukia į vidinį pasaulį, gamtoje ieško prasmės ir nusiraminimo.",
            connection: "Šeinius parodo, kad net skaudi patirtis gali tapti žmogaus dvasinio augimo keliu."
      }
}),
    lastDay: ["Kuprelis patiria nelaimingą meilę Gundei.", "Jo kančia nėra vien skundas - ji tampa vidinio augimo išbandymu.", "Naudok temoms apie meilę, vienišumą, vidinį pasaulį ir jautrumą."],
  },
  {
    id: "rugiuose",
    title: "Rugiuose prie bedugnės",
    author: "Džeromas Deividas Selindžeris (J. D. Salinger / Jerome David Salinger)",
    authorDates: "1919-2010",
    period: "XX a.",
    genre: "Romanas",
    mainIdea: "Bręstant žmogui tenka ieškoti tikrumo ir savo vertybių netikrame pasaulyje.",
    problem: "Kaip žmogus atranda savo gyvenimo kelią?",
    characters: ["Holdenas Kolfildas", "Febė", "mokyklos ir miesto žmonės"],
    situation: "Holdenas jaučiasi nesuprastas, maištauja prieš veidmainystę ir ieško tikrumo bei artumo.",
    howToUseInEssay: "Tinka temoms apie jaunimo maištą, brendimą, vienišumą ir gyvenimo kelio paieškas.",
    themes: ["jaunimo maištas", "gyvenimo kelio paieškos", "vienišumas", "brendimas", "tikrumo paieška"],
    sampleArgument: "Džeromas Deividas Selindžeris parodo, kad Holdeno maištas kyla ne iš tingumo, o iš noro rasti tikrumą veidmainiškoje aplinkoje.",
    commonMistakes: "Holdenas nėra tiesiog tingus ar „edgy“. Jis pasimetęs ir ieško tikrumo.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Jaunas žmogus dažnai jaučiasi nesuprastas.",
            event: "Holdenas Kolfildas palieka mokyklą ir klaidžioja po Niujorką, jausdamasis vienišas.",
            connection: "Ši situacija rodo, kad bręstant žmogui gali būti sunku rasti savo vietą."
      },
      vidutine: {
            idea: "Maištas gali kilti iš nusivylimo netikru pasauliu.",
            event: "Holdenas nuolat kritikuoja žmonių veidmainystę ir apsimetimą.",
            connection: "Todėl kūrinys tinka kalbant apie jauną žmogų, kuris ieško tikrumo."
      },
      stipresne: {
            idea: "Brendimas susijęs su bandymu išsaugoti jautrumą pasaulyje, kuris atrodo neteisingas.",
            event: "Holdenas nori būti „rugiuose prie bedugnės“ ir saugoti vaikus nuo kritimo.",
            connection: "Selindžeris parodo, kad jauno žmogaus maištas gali slėpti norą apsaugoti nekaltumą ir tikras vertybes."
      }
}),
  },
  {
    id: "tartiufas",
    title: "Tartiufas",
    author: "Moljeras (Molière / Jean-Baptiste Poquelin)",
    authorDates: "1622-1673",
    period: "XVII a.",
    genre: "Komedija",
    mainIdea: "Veidmainystė ir manipuliacija pavojingos ten, kur žmonės atsisako kritiškai mąstyti.",
    problem: "Kaip žmonės manipuliuoja kitais?",
    characters: ["Tartiufas", "Orgonas", "Elmira", "Dorina"],
    situation: "Tartiufas apsimeta doru ir religingu žmogumi, kad pasinaudotų Orgono pasitikėjimu ir gautų naudos.",
    howToUseInEssay: "Tinka temoms apie veidmainystę, patiklumą, manipuliaciją ir kritinio mąstymo svarbą.",
    themes: ["veidmainystė", "kritinio mąstymo svarba", "manipuliacija", "žmogaus patiklumas", "apsimetimas"],
    sampleArgument: "Moljero komedijoje Tartiufas manipuliuoja religingumu, todėl kūrinys parodo, kaip svarbu atpažinti veidmainystę.",
    commonMistakes: "Tartiufas nėra tik „juokingas blogietis“. Jis manipuliuoja religingumu dėl naudos.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Žmogus gali apsimesti doru siekdamas naudos.",
            event: "Tartiufas apsimeta pamaldžiu, kad įgytų Orgono pasitikėjimą.",
            connection: "Ši situacija rodo, kad ne visada galima spręsti apie žmogų pagal jo išorinį elgesį."
      },
      vidutine: {
            idea: "Patiklumas leidžia kitiems manipuliuoti žmogumi.",
            event: "Orgonas taip tiki Tartiufu, kad yra pasirengęs jam atiduoti turtą ir dukters ateitį.",
            connection: "Todėl komedija tinka kalbant apie kritinio mąstymo svarbą."
      },
      stipresne: {
            idea: "Veidmainystė pavojinga tada, kai visuomenė nesugeba jos atpažinti.",
            event: "Tartiufas beveik sugriauna Orgono šeimą, nes jo apgaulė ilgai laikoma dorybe.",
            connection: "Moljeras parodo, kad aklas pasitikėjimas gali tapti silpnybe, kuria pasinaudoja manipuliatoriai."
      }
}),
  },
  {
    id: "antigone",
    title: "Antigonė",
    author: "Sofoklis (Sophocles)",
    authorDates: "apie 497-406 pr. Kr.",
    period: "Antika",
    genre: "Tragedija",
    mainIdea: "Moralinis pasirinkimas gali reikalauti drąsos priešintis valdžiai.",
    problem: "Kas svarbiau: valdžios įsakymai ar moralė?",
    characters: ["Antigonė", "Kreontas", "Ismenė", "Polineikas"],
    situation: "Antigonė nepaiso Kreonto draudimo ir palaidoja brolį, nes jai svarbiau moralė, šeimos pareiga ir žmogiškumas.",
    howToUseInEssay: "Tinka temoms apie maištą, žmogiškumo gynimą, moralę, pareigą ir valdžią.",
    themes: ["maištas", "žmogiškumo gynimas", "moralė", "pareiga", "valdžia", "sąžinė", "drąsa"],
    sampleArgument: "Sofoklio tragedijoje Antigonė maištauja ne dėl egoizmo, o todėl, kad gina moralines vertybes.",
    commonMistakes: "Antigonė maištauja ne dėl egoizmo. Ji gina moralines vertybes.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Kartais sąžinė svarbesnė už valdžios įsakymą.",
            event: "Antigonė palaidoja brolį Polineiką, nors Kreontas tai uždraudžia.",
            connection: "Ši situacija rodo, kad žmogus turi klausyti sąžinės net tada, kai už tai gresia bausmė."
      },
      vidutine: {
            idea: "Tikra drąsa atsiskleidžia tada, kai žmogus gina moralines vertybes.",
            event: "Antigonė žino, kad bus nubausta, bet vis tiek pasirenka atlikti pareigą mirusiam broliui.",
            connection: "Todėl Antigonė tinka kalbant apie pasiaukojimą, pareigą ir ištikimybę vertybėms."
      },
      stipresne: {
            idea: "Moralinis pasirinkimas gali būti svarbesnis už asmeninį saugumą.",
            event: "Antigonė neatsisako savo sprendimo net tada, kai Kreontas ją pasmerkia mirčiai.",
            connection: "Sofoklis parodo, kad žmogaus kilnumas atsiskleidžia gebėjime ginti tai, kas teisinga, net prarandant gyvybę."
      }
}),
    lastDay: ["Antigonė palaidoja brolį nepaisydama Kreonto draudimo.", "Ji vadovaujasi sąžine, šeimos pareiga ir žmogiškumu.", "Naudok temoms apie moralę, pareigą, maištą ir valdžią."],
  },
  {
    id: "odiseja",
    title: "Odisėja",
    author: "Homeras (Homer)",
    authorDates: "apie VIII a. pr. Kr.",
    period: "Antika",
    genre: "Herojinis epas",
    mainIdea: "Tikras lyderis sunkumų akivaizdoje išlaiko tikslą, išmintį ir atsakomybę.",
    problem: "Kaip elgiasi tikras lyderis?",
    characters: ["Odisėjas", "Penelopė", "Poseidonas", "Kalipsė"],
    situation: "Odisėjas po Trojos karo keliauja namo, patiria pavojų ir išbandymų, bet išlieka sumanus ir siekia grįžti į Itakę.",
    howToUseInEssay: "Tinka temoms apie lyderystę, grėsmę, drąsą, išmintį, namus ir šeimą.",
    themes: ["lyderystė", "žmogus grėsmės akivaizdoje", "drąsa", "išmintis", "namų svarba", "šeima", "tikslas"],
    sampleArgument: "Homero „Odisėjoje“ Odisėjas stiprus ne vien kaip karys: jį gelbsti protas, strategija ir noras grįžti namo.",
    commonMistakes: "Odisėjas nėra tik „karys“. Jis išsiskiria protu ir strategija.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Sunkumus padeda įveikti atkaklumas.",
            event: "Odisėjas dešimt metų keliauja namo į Itakę po Trojos karo.",
            connection: "Ši situacija rodo, kad žmogus gali įveikti išbandymus, jei nepraranda tikslo."
      },
      vidutine: {
            idea: "Tikras lyderis sunkumų metu turi išlikti išmintingas.",
            event: "Odisėjas sugalvoja, kaip ištrūkti iš kiklopo Polifemo olos.",
            connection: "Todėl Odisėjas tinka kalbant apie protą, drąsą ir gebėjimą veikti grėsmės akivaizdoje."
      },
      stipresne: {
            idea: "Žmogaus stiprybė slypi gebėjime atsispirti pagundoms ir išsaugoti tikslą.",
            event: "Odisėjas patiria pavojus ir pagundas, bet vis tiek siekia grįžti pas Penelopę į Itakę.",
            connection: "Homeras parodo, kad ištikimybė tikslui padeda žmogui nepasimesti net ilgoje gyvenimo kelionėje."
      }
}),
    lastDay: ["Odisėjas keliauja į Itakę ir patiria daug pavojų.", "Jį gelbsti protas, strategija ir tikslas grįžti namo.", "Naudok temoms apie lyderystę, išmintį, grėsmę ir namus."],
  },
  {
    id: "hamletas",
    title: "Hamletas",
    author: "Viljamas Šekspyras (William Shakespeare)",
    authorDates: "1564-1616",
    period: "XVI-XVII a.",
    genre: "Tragedija",
    mainIdea: "Vidinė kova ir abejonės gali būti pražūtingos, jei žmogus nesugeba pereiti prie atsakingo veiksmo.",
    problem: "Ar abejonės padeda žmogui pasirinkti teisingai, ar jį silpnina?",
    characters: ["Hamletas", "Klaudijus", "Ofelija", "Gertrūda"],
    situation: "Hamletas sužino apie tėvo nužudymą ir turi apsispręsti, kaip elgtis. Jo abejonės, delsimas ir vidinė kova prisideda prie tragiškos baigties.",
    howToUseInEssay: "Tinka temoms apie abejonę, atsakomybę, pasirinkimą, vidinę kovą ir neveiklumą.",
    themes: ["abejonės", "atsakomybė", "pasirinkimai", "vidinė kova", "neveiklumas", "moralė"],
    sampleArgument: "Viljamo Šekspyro tragedijoje Hamletas ilgai svarsto, todėl jo vidinė kova parodo, kaip abejonės gali sutrukdyti atsakingai veikti.",
    commonMistakes: "Nepaversti visko tik keršto istorija. Svarbiausia - Hamleto vidinė kova ir delsimas.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Abejonės gali trukdyti žmogui veikti.",
            event: "Hamletas sužino apie tėvo nužudymą, bet ilgai delsia keršyti Klaudijui.",
            connection: "Ši situacija rodo, kad per ilgas svarstymas gali trukdyti priimti sprendimą."
      },
      vidutine: {
            idea: "Vidinė kova gali žmogų silpninti.",
            event: "Hamletas nuolat svarsto, kas teisinga, abejoja savimi ir aplinkiniais.",
            connection: "Todėl kūrinys tinka temoms apie pasirinkimus, atsakomybę ir abejojantį žmogų."
      },
      stipresne: {
            idea: "Neveikimas taip pat gali turėti tragiškų pasekmių.",
            event: "Hamleto delsimas prisideda prie daugelio veikėjų žūties tragedijos pabaigoje.",
            connection: "Šekspyras parodo, kad žmogus atsakingas ne tik už veiksmus, bet ir už per ilgą neveiklumą."
      }
}),
  },
  {
    id: "maryte",
    title: "Mano vardas Marytė",
    author: "Alvydas Šlepikas",
    authorDates: "1966-",
    period: "Šiuolaikinė literatūra",
    genre: "Romanas",
    mainIdea: "Istorinių tragedijų metu žmogui išlikti padeda viltis, prisitaikymas ir kitų žmonių atjauta.",
    problem: "Kas padeda žmogui išlikti sunkiausiomis sąlygomis?",
    characters: ["Renatė / Marytė", "vilko vaikai", "lietuviai", "rusų kariai"],
    situation: "Po Antrojo pasaulinio karo vokiečių vaikai, vadinami vilko vaikais, keliauja į Lietuvą ieškodami maisto, pagalbos ir prieglobsčio.",
    howToUseInEssay: "Tinka temoms apie išlikimą, karą, vaikystės praradimą, atjautą, viltį ir žmogaus ištvermę.",
    themes: ["išlikimas", "karas", "vaikystės praradimas", "atjauta", "viltis", "žmogaus ištvermė", "istorinės tragedijos"],
    sampleArgument: "Alvydo Šlepiko romane vaikai priversti kovoti dėl išlikimo, todėl jų patirtys rodo, kaip sunkumai gali priversti žmogų greitai subręsti.",
    commonMistakes: "Nerašyti tik „vaikai badavo“. Reikia paaiškinti, ką tai rodo apie žmogaus ištvermę, viltį ir atjautą.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Sunkumai gali priversti vaiką greitai suaugti.",
            event: "Renatė / Marytė ir kiti vilko vaikai po karo keliauja į Lietuvą ieškoti maisto.",
            connection: "Ši situacija rodo, kad sunkios sąlygos priverčia žmogų tapti savarankišką."
      },
      vidutine: {
            idea: "Noras išgyventi gali suteikti žmogui stiprybės.",
            event: "Vaikai badauja, bijo kareivių, praranda namus, bet vis tiek ieško būdų išlikti.",
            connection: "Todėl romanas tinka kalbant apie žmogaus ištvermę karo ir bado sąlygomis."
      },
      stipresne: {
            idea: "Net žiauriomis aplinkybėmis žmogų gelbsti viltis ir kitų atjauta.",
            event: "Vilko vaikai išgyvena tik tada, kai atsiranda žmonių, kurie juos priglaudžia ar pamaitina.",
            connection: "Šlepikas parodo, kad sunkumai ne tik užgrūdina, bet ir atskleidžia, kiek žmogui svarbus žmogiškumas."
      }
}),
    lastDay: ["Vilko vaikai po karo keliauja į Lietuvą ieškodami maisto.", "Marytės istorija rodo priverstinį brendimą ir ištvermę.", "Naudok temoms apie išlikimą, karą, viltį ir atjautą."],
  },
  {
    id: "sizifas",
    title: "Sizifas",
    author: "Senovės graikų mitai (autorius nežinomas)",
    authorDates: "-",
    period: "Antika",
    genre: "Mitas",
    mainIdea: "Žmogaus ydos ir apgaulės turi pasekmes.",
    problem: "Koks nusikaltimo ir bausmės ryšys?",
    characters: ["Sizifas"],
    situation: "Sizifas apgaudinėja dievus ir yra nubaudžiamas amžinai ridenti akmenį į kalną.",
    howToUseInEssay: "Tinka temoms apie bausmę, žmogaus ydas, beprasmį darbą ir pasekmes.",
    themes: ["bausmė", "žmogaus ydos", "beprasmis darbas", "apgaulė", "pasekmės"],
    sampleArgument: "Sizifo mitas rodo, kad žmogaus apgaulės ir ydos gali virsti ilgalaike bausme.",
    commonMistakes: "Sizifą galima naudoti kaip bausmės arba beprasmybės pavyzdį, bet reikia aiškiai pasirinkti kryptį.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Darbas be tikslo gali tapti bausme.",
            event: "Sizifas amžinai ridena akmenį į kalną, bet šis vis nurieda žemyn.",
            connection: "Ši situacija rodo, kad pastangos be prasmės gali žmogų išsekinti."
      },
      vidutine: {
            idea: "Žmogus turi suvokti savo veiksmų tikslą.",
            event: "Sizifas baudžiamas amžinai kartoti tą patį darbą, kuris niekada nesibaigia rezultatu.",
            connection: "Todėl Sizifo mitas tinka kalbant apie beprasmes pastangas ir atsakomybę už savo pasirinkimus."
      },
      stipresne: {
            idea: "Veiksmai be moralinio pagrindo gali privesti prie beprasmybės.",
            event: "Dėl savo apgaulių Sizifas pasmerkiamas darbui, kuris neturi pabaigos ir prasmės.",
            connection: "Sizifo istorija įspėja, kad žmogus turi galvoti ne tik apie gudrumą, bet ir apie savo veiksmų pasekmes."
      }
}),
  },
  {
    id: "narcizas",
    title: "Narcizas",
    author: "Senovės graikų mitai (autorius nežinomas)",
    authorDates: "-",
    period: "Antika",
    genre: "Mitas",
    mainIdea: "Savimeilė izoliuoja žmogų ir sunaikina jo ryšį su pasauliu.",
    problem: "Kodėl savimeilė pavojinga?",
    characters: ["Narcizas"],
    situation: "Narcizas įsimyli savo atvaizdą ir praranda ryšį su kitais bei tikrove.",
    howToUseInEssay: "Tinka temoms apie puikybę, savimeilę, žmogaus ydas ir vienišumą.",
    themes: ["puikybė", "savimeilė", "žmogaus ydos", "vienišumas", "ryšys su pasauliu"],
    sampleArgument: "Narcizo mitas parodo, kad perdėtas žavėjimasis savimi žmogų atskiria nuo kitų.",
    commonMistakes: "Nerašyti tik „jis buvo gražus“. Svarbiausia - savimeilė ir ryšio su kitais praradimas.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Per didelė meilė sau gali žmogų pražudyti.",
            event: "Narcizas pamato savo atvaizdą vandenyje ir įsimyli pats save.",
            connection: "Ši situacija rodo, kad savimeilė gali atitraukti žmogų nuo tikro gyvenimo."
      },
      vidutine: {
            idea: "Savimeilė atitolina žmogų nuo kitų.",
            event: "Narcizas taip susižavi savimi, kad jam neberūpi nei žmonės, nei gyvenimas.",
            connection: "Todėl mitas tinka temoms apie egoizmą, tuštybę ir vienišumą."
      },
      stipresne: {
            idea: "Žmogus, matantis tik save, praranda ryšį su tikrove.",
            event: "Narcizas negali atsitraukti nuo savo atvaizdo ir galiausiai miršta.",
            connection: "Mitas parodo, kad savimeilė tampa pražūtinga tada, kai žmogus nebemato nieko, išskyrus save."
      }
}),
  },
  {
    id: "prometejas",
    title: "Prometėjas",
    author: "Senovės graikų mitai (autorius nežinomas)",
    authorDates: "-",
    period: "Antika",
    genre: "Mitas",
    mainIdea: "Kova už žmoniškumą ir laisvę dažnai reikalauja asmeninės aukos.",
    problem: "Kas skatina žmogų aukotis?",
    characters: ["Prometėjas", "Dzeusas", "žmonės"],
    situation: "Prometėjas padeda žmonėms, atiduoda jiems ugnį ir už tai yra nubaudžiamas.",
    howToUseInEssay: "Tinka temoms apie pasiaukojimą, laisvę, maištą ir žmoniškumą.",
    themes: ["pasiaukojimas", "laisvė", "maištas", "žmoniškumas", "pagalba kitiems"],
    sampleArgument: "Prometėjas aukojasi dėl žmonių, todėl jo istorija tinka kalbėti apie drąsą ir žmoniškumą.",
    commonMistakes: "Nepamiršti, kad ugnis simbolizuoja pažangą, žinias ir žmonių gerovę.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Dėl kitų žmonių kartais verta aukotis.",
            event: "Prometėjas pavagia iš dievų ugnį ir atiduoda ją žmonėms.",
            connection: "Ši situacija rodo, kad pasiaukojimas gali būti prasmingas, jei jis padeda kitiems."
      },
      vidutine: {
            idea: "Pagalba kitiems reikalauja drąsos.",
            event: "Prometėjas žino, kad Dzeusas jį nubaus, bet vis tiek padeda žmonijai.",
            connection: "Todėl mitas tinka temoms apie drąsą, atsakomybę ir kilnius tikslus."
      },
      stipresne: {
            idea: "Pažanga ir žmoniškumas dažnai gimsta iš pasipriešinimo neteisingai galiai.",
            event: "Dzeusas nubaudžia Prometėją prikaustydamas jį prie uolos, bet žmonės gauna ugnį ir žinias.",
            connection: "Prometėjo istorija parodo, kad tikras heroizmas yra veikti dėl kitų net tada, kai pats dėl to kenčia."
      }
}),
    lastDay: ["Prometėjas atiduoda žmonėms ugnį.", "Ugnis reiškia pažangą, žinias ir žmonių gerovę.", "Naudok temoms apie pasiaukojimą, maištą ir žmoniškumą."],
  },
  {
    id: "dedalas-ikaras",
    title: "Dedalas ir Ikaras",
    author: "Senovės graikų mitai (autorius nežinomas)",
    authorDates: "-",
    period: "Antika",
    genre: "Mitas",
    mainIdea: "Laisvės troškimas be atsargumo gali tapti pražūtingas.",
    problem: "Kodėl žmogus peržengia ribas?",
    characters: ["Dedalas", "Ikaras"],
    situation: "Dedalas pasigamina sparnus ir perspėja Ikarą neskristi per aukštai, bet Ikaras nepaklauso ir žūsta.",
    howToUseInEssay: "Tinka temoms apie laisvę, jaunatvišką maksimalizmą, maištą ir žmogaus ribas.",
    themes: ["laisvė", "jaunatviškas maksimalizmas", "maištas", "žmogaus ribos", "neatsargumas"],
    sampleArgument: "Ikaro istorija rodo, kad neatsargus laisvės troškimas gali peržengti ribas ir baigtis pražūtimi.",
    commonMistakes: "Ikaras nėra tiesiog „drąsus“. Jo istorija įspėja apie neatsargų ribų peržengimą.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Laisvės troškimas be atsargumo gali būti pavojingas.",
            event: "Ikaras nepaiso Dedalo perspėjimo ir skrenda per arti saulės.",
            connection: "Ši situacija rodo, kad žmogaus svajonės turi būti derinamos su atsakomybe."
      },
      vidutine: {
            idea: "Jaunatviškas maksimalizmas gali pražudyti.",
            event: "Ikarą suvilioja skrydžio laisvė, todėl jis pakyla per aukštai ir žūsta.",
            connection: "Todėl mitas tinka kalbant apie ribas, patarimų klausymą ir neatsargų maištą."
      },
      stipresne: {
            idea: "Žmogus turi suvokti savo galimybių ribas.",
            event: "Dedalas sukuria sparnus kaip išsigelbėjimą, bet Ikaras laisvę paverčia neatsakingu troškimu pakilti aukščiau.",
            connection: "Mitas parodo, kad laisvė tampa pavojinga, kai žmogus pamiršta išmintį ir saiką."
      }
}),
  },
  {
    id: "kainas-abelis",
    title: "Kainas ir Abelis",
    author: "Biblija / Šventasis Raštas",
    authorDates: "-",
    period: "Senovė",
    genre: "Religinis pasakojimas",
    mainIdea: "Nevaldomas pavydas ir neapykanta gali sunaikinti žmogaus moralę.",
    problem: "Kaip pavydas paveikia žmogų?",
    characters: ["Kainas", "Abelis", "Dievas"],
    situation: "Kainas pavydi Abeliui ir nužudo brolį, todėl yra nubaudžiamas.",
    howToUseInEssay: "Tinka temoms apie pavydą, žmogaus ydas, moralę, kaltę ir atsakomybę.",
    themes: ["pavydas", "žmogaus ydos", "moralė", "kaltė", "atsakomybė"],
    sampleArgument: "Kaino ir Abelio istorija rodo, kad nevaldomas pavydas gali pastūmėti žmogų į nusikaltimą.",
    commonMistakes: "Svarbu pabrėžti pavydą, kaltę ir atsakomybę, ne tik žmogžudystę.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Pavydas gali pastūmėti žmogų į blogį.",
            event: "Kainas supyksta, kai Dievas priima Abelio auką, o jo auką atmeta.",
            connection: "Ši situacija rodo, kad pavydas gali sugriauti žmogaus moralę."
      },
      vidutine: {
            idea: "Nevaldomi jausmai gali turėti skaudžių pasekmių.",
            event: "Kainas nesuvaldo pykčio ir nužudo savo brolį Abelį.",
            connection: "Todėl pasakojimas tinka kalbant apie atsakomybę už savo jausmus ir veiksmus."
      },
      stipresne: {
            idea: "Pavydas naikina ne tik kitą žmogų, bet ir patį nusikaltusįjį.",
            event: "Už Abelio nužudymą Kainas nubaudžiamas klajoti ir neberanda ramybės.",
            connection: "Biblinė istorija rodo, kad žmogus negali pabėgti nuo kaltės ir savo pasirinkimų pasekmių."
      }
}),
  },
  {
    id: "babelio-bokstas",
    title: "Babelio bokštas",
    author: "Biblija / Šventasis Raštas",
    authorDates: "-",
    period: "Senovė",
    genre: "Religinis pasakojimas",
    mainIdea: "Puikybė ir noras išaukštinti save gali sugriauti bendruomenę.",
    problem: "Kodėl žmonės nesusikalba?",
    characters: ["Babelio žmonės", "Dievas"],
    situation: "Žmonės stato bokštą iki dangaus, siekdami išaukštinti save, bet jų kalbos sumaišomos ir bendrystė suyra.",
    howToUseInEssay: "Tinka temoms apie puikybę, susikalbėjimą, visuomenę ir bendruomenės griūtį.",
    themes: ["puikybė", "žmonių susikalbėjimas", "visuomenė", "bendruomenė", "žmogaus ydos"],
    sampleArgument: "Babelio bokšto pasakojimas rodo, kad žmonių puikybė gali sugriauti tarpusavio supratimą.",
    commonMistakes: "Nerašyti tik apie bokšto statymą. Svarbiausia - puikybė ir bendrystės suirimas.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Puikybė gali sugriauti žmonių vienybę.",
            event: "Žmonės stato bokštą, norėdami pasiekti dangų ir išaukštinti save.",
            connection: "Ši situacija rodo, kad puikybė trukdo žmonėms veikti dėl bendro gėrio."
      },
      vidutine: {
            idea: "Kai žmonės siekia garbės, jie praranda gebėjimą susikalbėti.",
            event: "Dievas sumaišo žmonių kalbas, todėl jie nebegali tęsti bokšto statybos.",
            connection: "Todėl pasakojimas tinka kalbant apie nesusikalbėjimą ir bendruomenės skilimą."
      },
      stipresne: {
            idea: "Bendruomenė griūva, kai ją vienija ne vertybės, o noras išaukštinti save.",
            event: "Babelio bokšto statyba baigiasi žmonių išsisklaidymu po pasaulį.",
            connection: "Biblinis pasakojimas parodo, kad puikybė gali sunaikinti net stiprią žmonių bendrystę."
      }
}),
  },
  {
    id: "sunus-palaidunas",
    title: "Sūnus palaidūnas",
    author: "Biblija / Šventasis Raštas",
    authorDates: "-",
    period: "Senovė",
    genre: "Parabolė",
    mainIdea: "Tikra stiprybė yra gebėjimas pripažinti klaidas, keistis ir priimti atleidimą.",
    problem: "Kodėl svarbu pripažinti klaidas?",
    characters: ["sūnus palaidūnas", "tėvas", "vyresnysis sūnus"],
    situation: "Sūnus išeikvoja paveldėtą turtą, patiria nuopuolį ir grįžta pas tėvą, kuris jam atleidžia.",
    howToUseInEssay: "Tinka temoms apie atleidimą, žmogaus stiprybę, klaidų pripažinimą ir dvasinį augimą.",
    themes: ["atleidimas", "žmogaus stiprybė", "klaidų pripažinimas", "keitimasis", "dvasinis augimas"],
    sampleArgument: "Sūnaus palaidūno parabolė rodo, kad žmogus stiprus tada, kai sugeba pripažinti klaidą ir keistis.",
    commonMistakes: "Nerašyti tik, kad sūnus „grįžo namo“. Svarbu klaidos pripažinimas ir atleidimas.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Žmogus gali pasikeisti, jei pripažįsta savo klaidas.",
            event: "Sūnus iššvaisto palikimą ir, supratęs savo klaidą, grįžta pas tėvą.",
            connection: "Ši situacija rodo, kad tikra stiprybė yra mokėti pripažinti kaltę."
      },
      vidutine: {
            idea: "Atleidimas padeda žmogui grįžti prie vertybių.",
            event: "Tėvas priima grįžusį sūnų, nors šis buvo suklydęs.",
            connection: "Todėl parabolė tinka kalbant apie atleidimą, gailestį ir žmogaus dvasinį augimą."
      },
      stipresne: {
            idea: "Klaidų pripažinimas yra kelias į vidinį pasikeitimą.",
            event: "Sūnus grįžta ne iš pasididžiavimo, o suvokęs savo nuopuolį ir kaltę.",
            connection: "Biblinė istorija parodo, kad žmogus gali atgauti orumą tada, kai išdrįsta keistis."
      }
}),
  },
  {
    id: "diev-komedija",
    title: "Dieviškoji komedija",
    author: "Dantė Aligjeris (Dante Alighieri)",
    authorDates: "1265-1321",
    period: "Viduramžiai",
    genre: "Poema",
    mainIdea: "Žmogaus moralinis kelias reikalauja kovos su savo ydomis ir silpnybėmis.",
    problem: "Kodėl žmogus klysta?",
    characters: ["Dantė", "Vergilijus", "Beatričė"],
    situation: "Dantė keliauja per Pragarą, Skaistyklą ir Rojų, matydamas žmogaus ydas, bausmes ir apsivalymo galimybę.",
    howToUseInEssay: "Tinka temoms apie žmogaus prigimtį, moralę, ydas, klaidas ir dvasinį kelią.",
    themes: ["žmogaus prigimtis", "moralė", "žmogaus ydos", "klaidos", "dvasinis kelias"],
    sampleArgument: "Dantės poema rodo, kad žmogus turi atpažinti savo ydas ir sąmoningai rinktis moralinį kelią.",
    commonMistakes: "Nerašyti tik apie „pragarą“. Svarbiausia - žmogaus moralinis kelias.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Žmogus atsako už savo veiksmus.",
            event: "Dantė keliauja per Pragarą ir mato žmones, baudžiamus už savo nuodėmes.",
            connection: "Ši situacija rodo, kad žmogaus pasirinkimai turi pasekmes."
      },
      vidutine: {
            idea: "Žmogus turi atpažinti savo ydas, kad galėtų keistis.",
            event: "Kelionė per Pragarą, Skaistyklą ir Rojų vaizduoja moralinį žmogaus kelią.",
            connection: "Todėl kūrinys tinka temoms apie atsakomybę, nuodėmę ir dvasinį augimą."
      },
      stipresne: {
            idea: "Tikras žmogaus kelias yra judėjimas nuo paklydimo į moralinį apsivalymą.",
            event: "Dantę iš tamsaus miško per pomirtinį pasaulį veda Vergilijus, o vėliau Beatričė.",
            connection: "Dantė Aligjeris parodo, kad žmogui reikia pripažinti savo paklydimus, kad jis galėtų pasiekti vidinę šviesą."
      }
}),
  },
  {
    id: "gedimino-laiskai",
    title: "Gedimino laiškai",
    author: "Gediminas",
    authorDates: "apie 1275-1341",
    period: "XIV a.",
    genre: "Laiškai",
    mainIdea: "Tikras lyderis rūpinasi valstybės ateitimi ir žmonių gerove.",
    problem: "Koks turi būti tikras lyderis?",
    characters: ["Gediminas", "kviečiami amatininkai ir pirkliai", "Lietuvos valstybė"],
    situation: "Gediminas laiškais kviečia žmones atvykti į Lietuvą ir taip siekia stiprinti valstybę.",
    howToUseInEssay: "Tinka temoms apie lyderystę, atsakomybę už valstybę, valstybės kūrimą ir tėvynę.",
    themes: ["lyderystė", "atsakomybė už valstybę", "valstybės kūrimas", "tėvynė", "šalies ateitis"],
    sampleArgument: "Gedimino laiškai rodo, kad išmintingas valdovas galvoja ne tik apie valdžią, bet ir apie valstybės ateitį.",
    commonMistakes: "Nepainioti su grožiniu romanu. Tai laiškai, svarbūs kalbant apie lyderystę ir valstybės kūrimą.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Geras valdovas rūpinasi savo valstybės ateitimi.",
            event: "Gediminas laiškuose kviečia į Lietuvą atvykti amatininkus, pirklius, vienuolius ir kitus žmones.",
            connection: "Ši situacija rodo, kad lyderis turi galvoti ne tik apie save, bet ir apie šalies stiprinimą."
      },
      vidutine: {
            idea: "Valstybės kūrimas reikalauja atvirumo ir atsakomybės.",
            event: "Gediminas siūlo atvykėliams saugumą ir geras sąlygas gyventi Lietuvoje.",
            connection: "Todėl laiškai tinka temoms apie išmintingą lyderystę ir atsakomybę už bendruomenę."
      },
      stipresne: {
            idea: "Tikras lyderis kuria valstybę telkdamas žmones ir žvelgdamas į ateitį.",
            event: "Gedimino laiškai skirti ne vien informuoti, bet ir parodyti Lietuvą kaip augančią, stiprėjančią valstybę.",
            connection: "Gedimino pavyzdys rodo, kad valdovo stiprybė slypi gebėjime kurti sąlygas žmonėms ir valstybei klestėti."
      }
}),
  },
  {
    id: "cepelinai-krepsinis",
    title: "Cepelinai ir krepšinis",
    author: "Sigitas Parulskis",
    authorDates: "1965-",
    period: "Šiuolaikinė literatūra",
    genre: "Esė / straipsnis",
    mainIdea: "Tikra meilė tėvynei nėra stereotipai, o sąmoningas santykis su savo šalimi.",
    problem: "Kaip reikia mylėti tėvynę?",
    characters: ["pasakotojas", "šiuolaikinė visuomenė", "tėvynės įvaizdžiai"],
    situation: "Autorius kalba apie paviršutiniškus tautinius stereotipus ir kviečia į tėvynę žiūrėti sąmoningiau.",
    howToUseInEssay: "Tinka temoms apie stereotipus, meilę tėvynei, tautinį identitetą ir kritišką patriotizmą.",
    themes: ["stereotipai", "meilė tėvynei", "tautinis identitetas", "patriotizmas", "sąmoningas santykis"],
    sampleArgument: "Parulskis parodo, kad meilė tėvynei neturi apsiriboti cepelinų ar krepšinio stereotipais.",
    commonMistakes: "Nerašyti, kad autorius nemyli Lietuvos. Jis kritikuoja paviršutinišką patriotizmą.",
    argumentBank: makeArgumentBank({
      paprasta: {
            idea: "Meilė tėvynei neturi būti paremta vien stereotipais.",
            event: "Esė kalbama apie lietuvius dažnai lydinčius stereotipus - cepelinus, krepšinį ir panašius ženklus.",
            connection: "Ši situacija rodo, kad tautiškumas neturėtų būti suprantamas tik paviršutiniškai."
      },
      vidutine: {
            idea: "Stereotipai gali susiaurinti žmogaus požiūrį į savo šalį.",
            event: "Parulskis ironiškai žvelgia į įprastus lietuviškumo simbolius.",
            connection: "Todėl esė tinka kalbant apie tai, kad tikra meilė tėvynei reikalauja sąmoningo, o ne aklo santykio."
      },
      stipresne: {
            idea: "Brandus patriotizmas reiškia gebėjimą savo šalį ne tik girti, bet ir kritiškai suprasti.",
            event: "Autorius pasitelkia kasdienius tautinius stereotipus, kad parodytų paviršutiniško patriotizmo ribotumą.",
            connection: "Parulskis leidžia teigti, kad tikras ryšys su tėvyne kyla iš mąstymo, o ne iš tuščių simbolių kartojimo."
      }
}),
  },
  {
    id: "mindaugas",
    title: "Mindaugas",
    author: "Justinas Marcinkevičius",
    authorDates: "1930-2011",
    period: "XX a. lietuvių literatūra",
    genre: "Drama",
    mainIdea: "Valstybės kūrimas reikalauja atsakomybės, sunkių pasirinkimų ir moralinės kainos.",
    problem: "Kokia yra lyderio atsakomybė kuriant valstybę?",
    characters: ["Mindaugas", "Morta", "artimieji", "politinių kovų dalyviai"],
    situation: "Mindaugas siekia suvienyti Lietuvą ir kurti stiprią valstybę, tačiau jo sprendimus lydi konfliktai, išdavystės ir asmeninės aukos.",
    howToUseInEssay: "Tinka temoms apie lyderystę, atsakomybę už valstybę, pasirinkimų kainą ir tėvynę.",
    themes: ["lyderystė", "atsakomybė", "valstybė", "tėvynė", "pasirinkimai", "valdžia", "moralinės dilemos"],
    sampleArgument: "Justinas Marcinkevičius dramoje „Mindaugas“ parodo, kad valstybės kūrimas nėra vien pergalė: valdovas turi prisiimti atsakomybę už sprendimus, kurie paliečia ir jį patį, ir artimuosius.",
    commonMistakes: "Nerašyti tik apie Mindaugą kaip valdovą. Svarbu paaiškinti, kokią moralinę kainą turi valstybės kūrimas.",
    argumentBank: makeArgumentBank({
      paprasta: {
        idea: "Valstybės kūrimas reikalauja atsakomybės.",
        event: "Mindaugas siekia suvienyti Lietuvą ir tapti stiprios valstybės valdovu.",
        connection: "Ši situacija rodo, kad tikras lyderis turi galvoti ne tik apie save, bet ir apie savo šalį.",
      },
      vidutine: {
        idea: "Dideli tikslai dažnai reikalauja sunkių pasirinkimų.",
        event: "Mindaugas kuria valstybę konfliktų, išdavysčių ir politinės įtampos aplinkoje.",
        connection: "Todėl drama tinka kalbant apie atsakomybę, valdžią ir žmogaus pasirinkimų kainą.",
      },
      stipresne: {
        idea: "Lyderystė gali tapti vidine našta, nes valdovas turi rinktis tarp asmeninės laimės ir valstybės interesų.",
        event: "Mindaugo sprendimai susiję ne tik su politika, bet ir su artimų žmonių likimais.",
        connection: "Marcinkevičius parodo, kad valstybės kūrimas nėra vien pergalė - tai ir moralinių dilemų kelias.",
      },
    }),
  },
  {
    id: "lazda",
    title: "Lazda",
    author: "Jonas Biliūnas",
    authorDates: "1879-1907",
    period: "XX a. pradžia",
    genre: "Apsakymas",
    mainIdea: "Atleidimas gali parodyti didesnę žmogaus stiprybę negu kerštas.",
    problem: "Ar atleidimas yra žmogaus silpnumas, ar stiprybė?",
    characters: ["pasakotojo tėvas", "Dumbrauckas", "pasakotojas"],
    situation: "Pasakotojo tėvas atleidžia jį nuskriaudusiam Dumbrauckui, o lazda tampa skriaudos ir moralinio kilnumo ženklu.",
    howToUseInEssay: "Tinka temoms apie atleidimą, moralinę stiprybę, žmoniškumą ir gebėjimą neatsakyti blogiu į blogį.",
    themes: ["atleidimas", "moralinė stiprybė", "žmoniškumas", "neteisybė", "nuoskauda", "kilnumas"],
    sampleArgument: "Jono Biliūno apsakyme „Lazda“ tėvas atleidžia skriaudėjui Dumbrauckui, todėl kūrinys rodo, kad žmogaus stiprybė gali atsiskleisti ne kerštu, o gebėjimu išlikti kilniam.",
    commonMistakes: "Nepainioti su „Ubagu“: Dumbraucko lazda siejama su Biliūno kūriniu „Lazda“.",
    argumentBank: makeArgumentBank({
      paprasta: {
        idea: "Atleidimas rodo žmogaus vidinę stiprybę.",
        event: "Tėvas atleidžia skriaudėjui Dumbrauckui ir laiko jo dovanotą lazdą.",
        connection: "Ši situacija rodo, kad stiprus žmogus ne visada keršija - kartais jis pasirenka atleisti.",
      },
      vidutine: {
        idea: "Tikra žmogaus stiprybė yra gebėjimas neatsakyti blogiu į blogį.",
        event: "Nors Dumbrauckas tėvą buvo nuskriaudęs, tėvas nelaiko neapykantos svarbiausiu savo gyvenimo jausmu.",
        connection: "Todėl Biliūno kūrinys tinka temoms apie atlaidumą, moralinę stiprybę ir žmoniškumą.",
      },
      stipresne: {
        idea: "Atleidimas gali būti aukštesnė moralinė pergalė už kerštą.",
        event: "Lazda tampa ne tik skriaudos prisiminimu, bet ir tėvo gebėjimo pakilti virš nuoskaudos ženklu.",
        connection: "Biliūnas parodo, kad žmogaus kilnumas atsiskleidžia tada, kai jis sugeba išsaugoti žmogiškumą net patyręs neteisybę.",
      },
    }),
  },
  {
    id: "lape-ir-vynuoges",
    title: "Lapė ir vynuogės",
    author: "Ezopas (Aesop)",
    authorDates: "apie VI a. pr. Kr.",
    period: "Antika",
    genre: "Pasakėčia",
    mainIdea: "Žmogus kartais menkina tai, ko negali pasiekti, kad paslėptų savo nesėkmę.",
    problem: "Kodėl žmogui sunku pripažinti nesėkmę?",
    characters: ["lapė"],
    situation: "Lapė nepasiekia vynuogių ir ima sakyti, kad jos vis tiek rūgščios.",
    howToUseInEssay: "Tinka temoms apie saviapgaulę, puikybę, žmogaus ydas ir nenorą pripažinti tiesą.",
    themes: ["saviapgaulė", "puikybė", "žmogaus ydos", "nesėkmė", "tiesa", "savivertė"],
    sampleArgument: "Ezopo pasakėčioje lapė nepasiekia vynuogių ir ima jas menkinti, todėl kūrinys rodo, kaip žmogus kartais pateisina savo nesėkmę iškraipydamas tikrovę.",
    commonMistakes: "Nerašyti tik, kad lapė norėjo vynuogių. Svarbiausia - jos bandymas pateisinti nesėkmę.",
    argumentBank: makeArgumentBank({
      paprasta: {
        idea: "Žmogus dažnai menkina tai, ko negali pasiekti.",
        event: "Lapė nepasiekia vynuogių ir ima sakyti, kad jos vis tiek rūgščios.",
        connection: "Ši situacija rodo, kad žmogus kartais slepia savo nesėkmę apsimesdamas, jog tikslas jam nerūpėjo.",
      },
      vidutine: {
        idea: "Puikybė trukdo žmogui pripažinti nesėkmę.",
        event: "Lapė negali gauti vynuogių, bet vietoj pripažinimo ima jas niekinti.",
        connection: "Todėl pasakėčia tinka kalbant apie žmogaus saviapgaulę ir nenorą matyti tiesos.",
      },
      stipresne: {
        idea: "Žmogus dažnai saugo savo savivertę iškraipydamas tikrovę.",
        event: "Lapės žodžiai apie „rūgščias“ vynuoges yra būdas pateisinti savo nesėkmę.",
        connection: "Ezopas parodo, kad žmogaus ydos dažnai pasireiškia ne atvirai, o per bandymą paslėpti savo silpnumą.",
      },
    }),
  },
];

export const lastDayWorkIds = ["kuprelis", "marti", "antigone", "maryte", "prometejas", "odiseja"];

export const quizQuestions = [
  {
    question: "Kuriam kūriniui tinka tema apie savimeilę?",
    options: ["Narcizas", "Antigonė", "Odisėja"],
    answer: "Narcizas",
  },
  {
    question: "Kuris veikėjas susijęs su sąžinės ir valdžios konfliktu?",
    options: ["Antigonė", "Katrė", "Sizifas"],
    answer: "Antigonė",
  },
  {
    question: "Kuris kūrinys tinka teiginiui, kad aplinka gali palaužti žmogų?",
    options: ["Marti", "Prometėjas", "Dedalas ir Ikaras"],
    answer: "Marti",
  },
  {
    question: "Kuriame kūrinyje kritikuojama veidmainystė ir manipuliacija?",
    options: ["Tartiufas", "Hamletas", "Kuprelis"],
    answer: "Tartiufas",
  },
  {
    question: "Kuris tekstas tinka temai apie atsakomybę už valstybę?",
    options: ["Gedimino laiškai", "Narcizas", "Rugiuose prie bedugnės"],
    answer: "Gedimino laiškai",
  },
];
