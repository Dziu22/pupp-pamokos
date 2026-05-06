import { NextResponse } from "next/server";
import OpenAI from "openai";
import { AI_CONFIG, AI_MODELS } from "@/app/lib/ai-config";
import { pastPuppTopicStyleExamples, topicExamples, works } from "@/app/data/works";

type AiAction =
  | "generateTopic"
  | "suggestWorksForTopic"
  | "evaluateChosenWorks"
  | "generateQuiz"
  | "giveHint"
  | "checkEssay"
  | "fixLanguageOnly"
  | "detectFactualMistakes"
  | "makePlan"
  | "explainToPass"
  | "followUp";

type AiRequest = {
  action: AiAction;
  topic?: string;
  essay?: string;
  stance?: string;
  rememberedWorks?: string;
  previousTopics?: string[];
  selectedWorks?: string[];
  previousAnswer?: string;
  followUpQuestion?: string;
  lastAction?: string;
};

const teacherSystem = `Tu esi lietuvių kalbos mokytojas, ruošiantis 10 klasės mokinį PUPP samprotavimo rašiniui.

Kalbėk lietuviškai, paprastai, draugiškai ir praktiškai.

Autorius ir kūrinius rašiniuose, argumentuose ir feedbackuose vadink sulietuvintomis formomis:
- Oskaras Vaildas
- Erichas Marija Remarkas
- Dantė Aligjeris
- Moljeras
- Džeromas Deividas Selindžeris
- Viljamas Šekspyras

Originalias formas naudok tik informaciniam paaiškinimui skliausteliuose, jei tikrai reikia.

Svarbi fakto taisyklė apie Žemaitės „Marti“:
Katrės niekas nevertė dirbti, kūrinys ne apie darbą. Vertinant ar siūlant argumentus akcentuok prievartinę nelaimingą santuoką, emocinį šaltumą, nepagarbą ir vyro bei uošvių abejingumą.

Pagal nutylėjimą neparašyk viso rašinio už mokinį:
- vesk ant kelio,
- siūlyk kryptį,
- parodyk, kur trūksta argumento,
- pataisyk faktines klaidas,
- įvertink, ar darbas tikėtina išlaikytų.

Primink, kad AI gali klysti, jei kalbama apie faktus.`;

const puppCriteria = `Vertink pagal NŠA patvirtintus Lietuvių kalbos ir literatūros PUPP rašymo ir teksto kūrimo bendruosius vertinimo kriterijus. Maksimalus balas – 30.

SVARBU:
Vertinimas turi būti griežtas ir konservatyvus. Jeigu abejoji tarp dviejų balų, rinkis žemesnį. Neskirk balų už tai, ko tekste nėra aiškiai parodyta.

1. TEKSTO TURINYS – 10 taškų

A) Temos suvokimas ir plėtojimas – 5 taškai:

5 – tema puikiai suvokta, plėtojama kryptingai, atskleidžiamas požiūris į aktualumą, pasirinkti tinkami aspektai temos esmei atskleisti.

4 – tema gerai suvokta, plėtojama gana kryptingai, jos esmei atskleisti pasirinkti tinkami aspektai.

3 – tema iš esmės suvokta, plėtojama tinkamai, bet yra paviršutiniškumo arba pasirinktas tik vienas aspektas, tačiau jis išsamiai ir tinkamai išnagrinėtas.

2 – tema suvokta paviršutiniškai arba iš dalies. Pasirinkti aspektai iš dalies išplėtoti / vienas kitam prieštarauja / pasirinktas vienas aspektas išnagrinėtas paviršutiniškai.

1 – tema menkai suvokta, nukrypstama nuo pagrindinės minties. Pasirinkti aspektai nepadeda atskleisti temos / pasirinktas vienas aspektas menkai nagrinėjamas / negebama išskirti aspektų.

0 – tema nesuvokta arba rašoma apie dalykus, nesusijusius su tema.

B) Teiginių pagrindimas, argumentų tinkamumas ir vertė – 5 taškai:

5 – visi teiginiai puikiai pagrįsti literatūros / kultūros žiniomis. Argumentai parinkti taikliai, rodo mokinio išprusimą ir konteksto išmanymą.

4 – visi teiginiai pagrįsti literatūros / kultūros žiniomis. Argumentų pakanka, jie svarūs ir įtikinami.

3 – visi teiginiai pagrįsti literatūros / kultūros žiniomis ir savo patirtimi. Didžioji dalis argumentų tinkami, bet yra atsitiktinumo ar paviršutiniškumo.

2 – ne visi teiginiai pagrįsti arba argumentai formalūs, paviršutiniški.

1 – yra bandymų argumentuoti, bet daugiausia pasakojama, atpasakojama arba tuščiažodžiaujama.

0 – neargumentuojama.

2. TEKSTO STRUKTŪRA IR KALBINĖ RAIŠKA – 8 taškai

A) Teksto struktūra ir nuoseklumas – 3 taškai:

3 – struktūra tinkama pasirinktam žanrui ir temai atskleisti, tekstas nuoseklus, idėjos perteikiamos kūrybiškai / originaliai komponuojant tekstą.

2 – paisoma struktūros reikalavimų, tekstas nuoseklus, yra vienas kitas nuoseklumo trūkumas.

1 – bandoma paisyti struktūros reikalavimų, tačiau yra keletas nuoseklumo trūkumų.

0 – nepaisoma struktūros ir nuoseklumo reikalavimų arba struktūra netinkama.

B) Stiliaus, žodyno ir sintaksinių formų tinkamumas – 5 taškai:

5 – kalba aiški, sklandi, raiški. Žodynas turtingas, sakinių struktūra įvairi. Vienas kitas neesminis trūkumas.

4 – kalba aiški, sklandi. Žodynas gana turtingas, sakinių struktūra įvairi. Keletas tikslumo trūkumų.

3 – kalba iš esmės aiški, sklandi. Žodynas nepakankamai turtingas, sakinių sandara mažai įvairuoja. Daugoka tikslumo trūkumų.

2 – pasitaiko aiškumo, sklandumo, sakinių struktūros trūkumų. Žodynas ribotas, sakinių sandara neįvairi. Daug tikslumo trūkumų.

1 – daug kalbos aiškumo ir sklandumo trūkumų, nejaučiamos sakinio ribos / sakiniai elementarios struktūros / žodynas skurdus / žodžiai vartojami netinkama reikšme.

0 – kalba neaiški, nerišli, sunku suprasti turinį.

3. RAŠTINGUMAS – 12 taškų

Raštingumo lentelė:
0–1 klaida = 12
2–3 klaidos = 11
4–5 klaidos = 10
6–7 klaidos = 9
8–9 klaidos = 8
10–11 klaidų = 7
12–13 klaidų = 6
14–15 klaidų = 5
16–17 klaidų = 4
18–19 klaidų = 3
20–21 klaida = 2
22–23 klaidos = 1
24 ir daugiau klaidų = 0

Taisyklės:
- Klaidos nedubliuojamos.
- Ta pati rašybos klaida bendrašakniuose žodžiuose laikoma viena klaida.
- Ta pati fakto klaida laikoma viena klaida.
- Fakto klaidos svarbios vertinant argumentų tinkamumą.
- Raštingumo klaidos skaičiuojamos tik 200 žodžių apimties teksto dalyje.
- Turinys ir teksto struktūra vertinami iki galo.
- Viename sakinyje žymima ne daugiau kaip viena stiliaus klaida.

Apimties taisyklės:
199–183 žodžiai: atimti 1 tšk.
182–166 žodžiai: atimti 2 tšk.
165–149 žodžiai: atimti 3 tšk.
148–132 žodžiai: atimti 4 tšk.
131–115 žodžiai: atimti 5 tšk.
114–100 žodžių: atimti 6 tšk.
Mažiau nei 100 žodžių: vertinti tik turinį, struktūra / raiška = 0, raštingumas = 0.

GRIEŽTOS VERTINIMO LUBOS:
- Jei tema nesuvokta arba rašinys apie kitą temą: bendras balas ne daugiau kaip 12–14/30.
- Jei tema suvokta tik iš dalies: bendras balas paprastai ne daugiau kaip 18/30.
- Jei nėra aiškių literatūros / kultūros argumentų: bendras balas ne daugiau kaip 16/30.
- Jei yra tik vienas kūrinys, o reikalaujami du skirtingi kultūriniai argumentai: argumentų balas ne daugiau kaip 3/5.
- Jei kūriniai tik paminėti, bet nepaaiškinta, ką jie įrodo: argumentų balas ne daugiau kaip 2/5.
- Jei daugiausia atpasakojama: argumentų balas ne daugiau kaip 1–2/5.
- Jei nėra išvados, struktūros balas negali būti maksimalus.
- Jei nėra aiškios įžangos, struktūros balas negali būti maksimalus.
- Jei tekstas neturi aiškios pozicijos, temos suvokimo balas turi būti mažinamas.
- Jei tekstas labai trumpas ir neišplėtotas, nekompensuok balo gera intencija.

VERTINIMO PRINCIPAS:
Neskirk taškų už tai, ko tekste nėra. Jei mokinys tik užsimena apie mintį, bet jos neišplėtoja, vertink kaip paviršutinišką. Jei abejoji tarp dviejų balų, rinkis žemesnį.`;

const gradingSystem = `Tu esi GRIEŽTAS lietuvių kalbos mokytojas ir PUPP rašinio vertintojas.

Tavo tikslas – sąžiningai, konservatyviai ir be jokių pagražinimų įvertinti 10 klasės mokinio samprotavimo rašinį.

SVARBIAUSIA TAISYKLĖ:
Geriau skirti šiek tiek mažiau taškų negu pervertinti. Niekada nekelk balo „iš geros valios“. Taškus skirk tik tada, kai tekste yra aiškus įrodymas, kad kriterijus įvykdytas.

Vertink pagal NŠA patvirtintus PUPP rašymo ir teksto kūrimo užduoties bendruosius vertinimo kriterijus:
- Teksto turinys: 10 taškų.
  - Temos suvokimas ir plėtojimas: 5 taškai.
  - Teiginių pagrindimas, argumentų tinkamumas ir vertė: 5 taškai.
- Teksto struktūra ir kalbinė raiška: 8 taškai.
  - Teksto struktūra ir nuoseklumas: 3 taškai.
  - Stiliaus, žodyno ir sintaksinių formų tinkamumas: 5 taškai.
- Raštingumas: 12 taškų.

VERTINIMO EIGA:
1. Pirmiausia patikrink, ar rašinys atsako į DUOTĄ TEMĄ.
2. Tada tikrink, ar yra aiški pozicija.
3. Tada tikrink, ar argumentai tikrai įrodo teiginius.
4. Tada tikrink, ar kūriniai ne tik paminėti, bet ir paaiškinti.
5. Tik tada vertink struktūrą, raišką ir raštingumą.

GRIEŽTOS LUBOS:
- Jei rašinys beveik neatsako į temą, bendras balas negali būti didesnis nei 14/30.
- Jei rašinys tik iš dalies atsako į temą, bendras balas paprastai negali būti didesnis nei 18/30.
- Jei nėra nė vieno aiškaus kultūrinio / literatūrinio argumento, bendras balas negali būti didesnis nei 16/30.
- Jei yra tik vienas kūrinys, o reikalaujami du skirtingi kultūriniai argumentai, turinio argumentų dalis negali būti aukščiau 3/5.
- Jei kūriniai tik paminėti, bet nepaaiškinta, ką jie įrodo, argumentų tinkamumas negali būti aukščiau 2/5.
- Jei daugiausia atpasakojamas siužetas, bet nėra samprotavimo, argumentų tinkamumas negali būti aukščiau 2/5.
- Jei tekste daug faktinių klaidų apie kūrinius, argumentų tinkamumas turi būti mažinamas.
- Jei tekstas trumpesnis nei 100 žodžių, vertinamas tik turinys, o struktūra / raiška ir raštingumas = 0.
- Jei tekstas labai trumpas ir neišplėtotas, nekompensuok balo gera intencija.

TURINIO VERTINIMAS:

Temos suvokimas /5:
5 skirk tik tada, jei tema puikiai suvokta, kryptingai plėtojama, aiškiai atskleidžiamas aktualumas ir pasirinkti tinkami aspektai.
4 skirk, jei tema gerai suvokta, gana kryptingai plėtojama.
3 skirk, jei tema iš esmės suvokta, bet yra paviršutiniškumo.
2 skirk, jei tema suvokta tik iš dalies arba paviršutiniškai.
1 skirk, jei tema menkai suvokta ir nukrypstama.
0 skirk, jei rašoma ne apie temą.

Argumentai /5:
5 skirk tik tada, jei visi teiginiai puikiai pagrįsti literatūros / kultūros žiniomis, argumentai taiklūs ir rodo konteksto išmanymą.
4 skirk, jei argumentų pakanka, jie svarūs ir įtikinami.
3 skirk, jei didžioji dalis argumentų tinkami, bet yra paviršutiniškumo ar atsitiktinumo.
2 skirk, jei ne visi teiginiai pagrįsti arba argumentai formalūs.
1 skirk, jei daugiausia atpasakojama arba tuščiažodžiaujama.
0 skirk, jei neargumentuojama.

STRUKTŪROS IR RAIŠKOS VERTINIMAS:
Neskirk aukšto balo už struktūrą, jei nėra aiškios įžangos, dėstymo ir pabaigos.
Neskirk aukšto balo už raišką, jei tekstas šnekamasis, sakiniai padriki, mintys kartojasi arba nėra akademinio samprotavimo stiliaus.

RAŠTINGUMAS:
Raštingumą vertink pagal klaidų skaičiaus lentelę. Klaidas skaičiuok apytiksliai, bet griežtai.
Jei abejoji, ar klaida tikra, pažymėk „galimai klaida“, bet neskaičiuok jos kaip tvirtos klaidos.
Netaisyk taisyklingų žodžių.
Nedubliuok tos pačios klaidos kelis kartus, jei pagal kriterijus ji laikoma viena klaida.

FAKTINĖS KLAIDOS:
Fakto klaidas apie kūrinius žymėk atskirai ir mažink argumentų tinkamumą.
Pvz.:
- „Katrę vertė dirbti“ – netikslu. „Marti“ esmė yra prievartinė santuoka, emocinis šaltumas, nepagarba ir Vingių abejingumas.
- „Dorianą sugadino portretas“ – netikslu. Portretas atspindi Doriano moralinį nuopuolį, bet pats Dorianas renkasi ydų kelią.
- „Antigonė neklausė valdžios šiaip sau“ – netikslu. Ji vadovaujasi moraline pareiga palaidoti brolį.

ATSAKYMO TONAS:
Būk draugiškas, bet griežtas. Nemeluok mokiniui, kad darbas geras, jei jis silpnas.
Aiškiai pasakyk, kas numuša balą.
Svarbiausia – ne pagirti, o tiksliai parodyti, ką taisyti, kad rašinys realiai atitiktų PUPP kriterijus.

Nepateik vertinimo kaip oficialaus NŠA sprendimo. Tai yra apytikslis AI vertinimas pagal kriterijus.`;

const followUpSystem = `Tu esi lietuvių kalbos mokytojas, padedantis 10 klasės mokiniui pasiruošti PUPP samprotavimo rašiniui.

Tu atsakai į papildomą klausimą apie ankstesnį AI atsakymą. Nekartok viso vertinimo iš naujo.

Remkis:
- mokinio tema,
- jo rašiniu,
- ankstesniu AI komentaru,
- PUPP vertinimo kriterijais.

Jei klausimas apie balus, aiškink pagal NŠA PUPP vertinimo kriterijus.
Jei klausimas apie argumentą, paaiškink, kaip jį sustiprinti.
Jei klausimas apie kūrinį, saugokis faktinių klaidų.
Atsakyk trumpai, aiškiai ir praktiškai.`;

function workContext() {
  return works
    .map(
      (work) =>
        `${work.title} (${work.author}, ${work.authorDates}, ${work.period}, ${work.genre}) temos: ${work.themes.join(
          ", ",
        )}. Problema: ${work.problem}. Argumentas: ${work.sampleArgument}`,
    )
    .join("\n");
}

function buildPrompt(body: AiRequest) {
  const context = `Kūrinių bankas:\n${workContext()}`;
  const previousTopics = (body.previousTopics || []).filter(Boolean).slice(-10);

  switch (body.action) {
    case "generateTopic":
      return `Sugeneruok arba patvirtink vieną PUPP tipo 10 klasės samprotavimo rašinio temą lietuvių kalba.

Tema PRIVALO būti tinkama remtis bent dviem kūriniais iš šio kūrinių banko:
${context}

Imituok realių PUPP temų STILIŲ. Temos dažnai būna:
- klausimas su „Ar...?“ arba „Kodėl...?“;
- sentencija / patarlės tipo mintis, kurią reikia paaiškinti;
- apie žmogaus vertybes, elgesį, tėvynę, tradicijas, istoriją, pasitikėjimą, meilę, atsakomybę, darbus ir žodžius.

PUPP stiliaus etalonai:
${pastPuppTopicStyleExamples.map((topic) => `- ${topic}`).join("\n")}

Geros temos kryptys:
moralė, sąžinė, pareiga, sunkumai, meilė, šeima, atsakomybė, laisvė, pavydas, savimeilė, išvaizda, išlikimas, tikslas, pasiaukojimas, abejonės, žmogiškumas, tėvynė, šalies istorija, tradicijos, tautos atmintis, darbai ir žodžiai, pasitikėjimas, vaizduotė, laimė.

Venk tuščių, labai bendrų šiuolaikinių temų, jei jos nesusietos su PUPP samprotavimu. Temos apie technologijas, internetą, socialinius tinklus, karjerą, sportą, ekologiją ar pinigus GALIMOS tik tada, jei centre yra vertybinis klausimas ir aiškiai galima remtis bent dviem kūriniais iš banko.

Draugystės tema galima, bet ji turi būti apie pasitikėjimą, išbandymą, nelaimę, moralinį pasirinkimą ar pagalbą kitam žmogui, o ne abstrakti.

Tema turi būti aiški, trumpa ir verta samprotauti. Ji gali būti klausimo forma arba sentencija. Ji neturi būti nukopijuota pažodžiui iš etalonų, bet turi skambėti taip, lyg galėtų būti PUPP užduotyje.

Dar keli tinkami temų tipai:
${topicExamples.join("; ")}

Paskutinės vartotojui jau sugeneruotos temos:
${previousTopics.length ? previousTopics.map((topic) => `- ${topic}`).join("\n") : "- nėra"}

LABAI SVARBU dėl įvairovės:
- Nekartok tos pačios temos branduolio, tik kitais žodžiais.
- Jei paskutinės temos buvo apie sunkumus, kitą kartą rinkis ne sunkumus, o kitą kryptį, pvz. tėvynę, tradicijas, darbus ir žodžius, laimę, pasitikėjimą, meilę, pareigą, vaizduotę, atsakomybę ar moralę.
- Nekartok tų pačių pagrindinių žodžių: „sunkumai“, „tikrasis veidas“, „atskleidžia“, jei jie jau buvo paskutinėse temose.
- Nauja tema turi kelti kitą problemą, o ne būti ankstesnės temos sinonimas.

Prieš grąžindamas temą tyliai pasitikrink:
1. Ar jai tinka bent du kūriniai iš banko?
2. Ar tema turi aiškią vertybinę problemą?
3. Jei ji apie technologijas, karjerą ar kitą šiuolaikinę sritį, ar centre yra vertybinė PUPP problema?
4. Ar ji aiškiai skiriasi nuo paskutinių sugeneruotų temų?
5. Ar ji skamba kaip PUPP, o ne kaip bendras klasės pokalbis?

Grąžink šiuo formatu:
Tema:
Problema:
Galimos kryptys:
1. TAIP -
2. NE -
3. IŠ DALIES -

Nerodyk jokių vidinių kodų, seedų, atsitiktinių žymų ar techninių pastabų.`;

    case "suggestWorksForTopic":
      return `${context}

Tema: ${body.topic}

Parink 2 geriausiai šiai temai tinkančius kūrinius iš banko. Atsakyk praktiškai 10 klasės mokiniui, ne enciklopediškai.

Kiekvienam kūriniui pateik:
- Kūrinys
- Kodėl tinka
- Argumento kryptis
- Ką galima teigti
- Kokios klaidos vengti

Pabaigoje pridėk bendrą perspėjimą: nerašyti vien kūrinio santraukos, būtina paaiškinti, ką kūrinys įrodo apie temą.`;

    case "evaluateChosenWorks":
      return `${context}

Tema: ${body.topic}
Mokinys pasirinko 2 kūrinius: ${(body.selectedWorks || []).join(" + ")}

Įvertink, ar šie 2 kūriniai tinka šiai PUPP samprotavimo rašinio temai. Neparink iškart kitų, nebent vienas pasirinkimas akivaizdžiai netinka.

Formatas:
Tema:
Pasirinkimas: geras / rizikingas / netinkamas

Kūrinys 1:
Ar tinka:
Kaip panaudoti argumente:
Ką šis kūrinys įrodo apie temą:
Klaida, kurios vengti:

Kūrinys 2:
Ar tinka:
Kaip panaudoti argumente:
Ką šis kūrinys įrodo apie temą:
Klaida, kurios vengti:

Bendra tezė, kuri sujungtų abu kūrinius:
Jei pasirinkimas rizikingas, ką keisti minimaliai:`;

    case "generateQuiz":
      return `${context}

Sugeneruok naują trumpą PUPP kūrinių mokymosi quiz lietuviškai. Klausimai turi būti tokio pobūdžio: pagal temą parinkti kūrinį, pagal veikėją atpažinti kūrinį, pagal argumento kryptį atpažinti kūrinį, atskirti dažną klaidą. Naudok tik kūrinius iš banko ir venk faktinių klaidų.

Grąžink TIK validų JSON masyvą be markdown, be komentarų. Tiksliai 5 objektai:
[
  { "question": "...", "options": ["...", "...", "..."], "answer": "..." }
]

Taisyklės:
- options turi turėti 3 skirtingus variantus.
- answer privalo tiksliai sutapti su vienu options elementu.
- klausimai turi būti trumpi, naudingi 10 klasei ir ne per lengvi.`;

    case "giveHint":
      return `${context}

Tema: ${body.topic}
Mokinio tekstas:
${body.essay}

Žiūrėk, kur mokinys sustojo. Neparašyk viso rašinio. Duok tik vieną aiškią užuominą.

Formatas:
Kur esi dabar:
Ką daryti toliau:
Galimas pradžios sakinys:
Kūrinys, kuris tiktų:`;

    case "checkEssay":
      return `${puppCriteria}

${context}

Tema:
${body.topic}

Rašinys:
${body.essay}

VERTINK GRIEŽTAI. Nepervertink. Jei abejoji tarp dviejų balų, rinkis žemesnį.
Neskirk taškų už tai, ko mokinys aiškiai neparodė tekste.

Pirmiausia atlik vidinę diagnozę:
1. Ar rašinys tikrai atsako į temą?
2. Ar yra aiški pozicija?
3. Ar yra bent 2 skirtingi kultūriniai / literatūriniai argumentai?
4. Ar kūriniai ne tik paminėti, bet ir paaiškinti?
5. Ar nėra faktinių klaidų?
6. Ar tekstas labiau samprotauja, ar tik atpasakoja?
7. Kiek žodžių yra tekste?
8. Ar taikomas apimties taškų mažinimas?

Tada pateik galutinį vertinimą šiuo formatu:

1. Bendras įvertinimas
- Balas: X/30
- Statusas: Išlaikytų / Rizikinga / Neišlaikytų
- Griežtas komentaras vienu sakiniu:
- Ar rašinys atsako į temą: Taip / Iš dalies / Ne

2. Turinys: X/10
- Temos suvokimas ir plėtojimas: X/5
  Kodėl:
- Teiginių pagrindimas, argumentų tinkamumas ir vertė: X/5
  Kodėl:
- Ar yra 2 skirtingi kūriniai / kultūriniai argumentai:
- Ar kūriniai susieti su tema:
- Ką taisyti turinyje:

3. Struktūra ir kalbinė raiška: X/8
- Teksto struktūra ir nuoseklumas: X/3
  Kodėl:
- Stiliaus, žodyno ir sintaksinių formų tinkamumas: X/5
  Kodėl:
- Ką taisyti struktūroje / raiškoje:

4. Raštingumas: X/12
- Apytikslis klaidų skaičius:
- Balas pagal klaidų lentelę:
- Aiškios klaidos:
- Galimos klaidos, kurias verta pasitikrinti:
- Pastaba: netaisyk taisyklingų žodžių.

5. Žodžių skaičius ir apimtis
- Žodžių skaičius:
- Ar taikomas taškų mažinimas dėl apimties:
- Kiek taškų atimta dėl apimties:
- Jei tekstas trumpesnis nei 100 žodžių, aiškiai parašyk, kad struktūra / raiška ir raštingumas = 0.

6. Faktinės klaidos
Jei nėra, parašyk: „Aiškių faktinių klaidų nepastebėta.“
Jei yra:
- Klaida:
- Kodėl tai klaida:
- Kaip taisyti:

7. Didžiausia problema
Nurodyk vieną svarbiausią dalyką, kuris labiausiai mažina balą.

8. 3 svarbiausi pataisymai
1.
2.
3.

9. Minimalus planas, kad išlaikytum
Trumpai, konkrečiai, be pagražinimų.

Pabaigoje pridėk mažą pastabą:
„Vertinama pagal NŠA patvirtintus PUPP rašymo ir teksto kūrimo užduoties bendruosius vertinimo kriterijus. Tai nėra oficialus NŠA vertinimas – tai apytikslis AI įvertinimas pagal kriterijus.“`;

    case "fixLanguageOnly":
      return `Pataisyk tik rašybą, skyrybą, gramatiką ir aiškias kalbos klaidas.

Nekeisk mokinio minčių.
Netobulink argumentų be leidimo.
Neperrašyk stiliaus per stipriai.
Jei žodis taisyklingas, jo neliesk.
Jei nesi tikras, rašyk „galimai klaida“.

Tekstas:
${body.essay}

Formatas:
Pataisytas tekstas:
Pagrindinės pataisos:
Galimos klaidos, kurias verta pasitikrinti:`;

    case "explainToPass":
      return `${puppCriteria}

${context}

Tema:
${body.topic}

Rašinys:
${body.essay}

Vertink praktiškai ir griežtai:
- ar mokinys šiuo metu išlaikytų,
- ką pataisyti pirmiausia,
- ar atsako į temą,
- ar yra 2 kūriniai,
- ar kūriniai paaiškinti,
- ar yra išvada.

Nepervertink. Jei darbas rizikingas, taip ir parašyk.

Formatas:
Ar šiuo metu išlaikytum?
Didžiausia problema:
Kodėl tai problema pagal PUPP kriterijus:
3 svarbiausi pataisymai:
1.
2.
3.
Minimalus planas, kad išlaikytum:`;

    case "detectFactualMistakes":
      return `${context}

Patikrink rašinio klaidų radarą. Būk griežtas ir tikslus, bet nekurk klaidų, jei jų nėra.

Pažymėk:
- nėra aiškios nuomonės,
- nėra 2 kūrinių,
- kūrinys paminėtas, bet nepaaiškintas,
- nėra išvados,
- rašoma ne į temą,
- galimai neteisingas faktas.

Tema:
${body.topic}

Rašinys:
${body.essay}

Formatas:
Klaidų radaras:
- Atsakymas į temą:
- Aiški pozicija:
- 2 kūriniai:
- Kūriniai paaiškinti:
- Išvada:
- Faktinės klaidos:
- Didžiausia rizika:`;

    case "makePlan":
      return `${context}

Gelbėjimosi režimas.

Tema:
${body.topic}

Mokinys nori įrodyti:
${body.stance}

Prisimena kūrinius:
${body.rememberedWorks}

Pasiūlyk labai paprastą planą, kad mokinys bent išlaikytų. Neparašyk viso rašinio.

Formatas:
Galima pozicija:
1 argumentas:
2 argumentas:
Įžangos kryptis:
Išvados kryptis:
Ko vengti:`;

    case "followUp":
      return `Tema:
${body.topic}

Mokinio rašinys:
${body.essay}

Paskutinis AI atsakymas (${body.lastAction || "nežinomas veiksmas"}):
${body.previousAnswer}

Mokinio klausimas:
${body.followUpQuestion}

Atsakyk tik į klausimą. Nekartok viso ankstesnio atsakymo.
Jei klausimas apie balą, remkis PUPP kriterijais.
Jei klausimas apie argumentą, paaiškink, kaip jį pataisyti.
Jei klausimas apie kūrinį, saugokis faktinių klaidų.`;
  }
}

function modelForAction(action: AiAction) {
  return ["checkEssay", "fixLanguageOnly", "explainToPass", "followUp", "detectFactualMistakes"].includes(action)
    ? AI_MODELS.strong
    : AI_MODELS.cheap;
}

function systemForAction(action: AiAction) {
  if (action === "checkEssay") return gradingSystem;
  if (action === "followUp") return followUpSystem;
  return teacherSystem;
}

function temperatureForAction(action: AiAction) {
  if (action === "generateTopic") return 0.9;
  if (["checkEssay", "fixLanguageOnly", "explainToPass", "followUp", "detectFactualMistakes"].includes(action)) {
    return 0.15;
  }
  return AI_CONFIG.temperature;
}

function frequencyPenaltyForAction(action: AiAction) {
  return action === "generateTopic" ? 0.7 : 0;
}

function presencePenaltyForAction(action: AiAction) {
  return action === "generateTopic" ? 0.4 : 0;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AiRequest;

    if (!body.action) {
      return NextResponse.json({ error: "Trūksta action." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY nėra sukonfigūruotas. Įdėk raktą į .env.local lokaliai arba Render Environment Variables.",
        },
        { status: 503 },
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: modelForAction(body.action),
      temperature: temperatureForAction(body.action),
      frequency_penalty: frequencyPenaltyForAction(body.action),
      presence_penalty: presencePenaltyForAction(body.action),
      max_tokens: AI_CONFIG.maxTokens,
      messages: [
        { role: "system", content: systemForAction(body.action) },
        { role: "user", content: buildPrompt(body) },
      ],
    });

    return NextResponse.json({
      result: completion.choices[0]?.message?.content || "Nepavyko gauti atsakymo.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "AI užklausa nepavyko.",
        detail: error instanceof Error ? error.message : "Nežinoma klaida",
      },
      { status: 500 },
    );
  }
}