import { NextResponse } from "next/server";
import OpenAI from "openai";
import { AI_CONFIG, AI_MODELS } from "@/app/lib/ai-config";
import { pastPuppTopicStyleExamples, topicExamples, works } from "@/app/data/works";

type AiAction =
  | "generateTopic"
  | "suggestWorksForTopic"
  | "suggestTopicsForWorks"
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

const teacherSystem = `Tu esi lietuvių kalbos mokytojas, ruošiantis 10 klasės mokinį PUPP samprotavimo rašiniui. Kalbėk lietuviškai, paprastai, draugiškai ir praktiškai. Autorius ir kūrinius rašiniuose, argumentuose ir feedbackuose vadink sulietuvintomis formomis: Oskaras Vaildas, Erichas Marija Remarkas, Dantė Aligjeris, Moljeras, Džeromas Deividas Selindžeris. Originalias formas naudok tik informaciniam paaiškinimui skliausteliuose, jei tikrai reikia. Svarbi fakto taisyklė apie Žemaitės „Marti“: Katrės niekas nevertė dirbti, kūrinys ne apie darbą. Vertinant ar siūlant argumentus akcentuok prievartinę nelaimingą santuoką, emocinį šaltumą, nepagarbą ir vyro bei uošvių abejingumą. Pagal nutylėjimą neparašyk viso rašinio už mokinį: vesk ant kelio, siūlyk kryptį, parodyk, kur trūksta argumento, pataisyk faktines klaidas ir įvertink, ar darbas tikėtina išlaikytų. Primink, kad AI gali klysti, jei kalbama apie faktus.`;

const puppCriteria = `Vertink pagal Lietuvių kalbos ir literatūros PUPP rašymo ir teksto kūrimo bendruosius vertinimo kriterijus, maksimaliai 30 taškų:
- Teksto turinys: 10 taškų. Temos suvokimas ir plėtojimas /5; teiginių pagrindimas, argumentų tinkamumas ir vertė /5.
- Teksto struktūra ir kalbinė raiška: 8 taškai. Teksto struktūra ir nuoseklumas /3; stiliaus, žodyno ir sintaksinių formų tinkamumas /5.
- Raštingumas: 12 taškų pagal gramatikos, žodyno, rašybos ir skyrybos klaidų kiekį.
- Raštingumo lentelė: 0-1 klaida = 12, 2-3 = 11, 4-5 = 10, 6-7 = 9, 8-9 = 8, 10-11 = 7, 12-13 = 6, 14-15 = 5, 16-17 = 4, 18-19 = 3, 20-21 = 2, 22-23 = 1, 24+ = 0.
- Raštingumo klaidos skaičiuojamos tik 200 žodžių apimties teksto dalyje. Turinys ir struktūra vertinami iki galo.
- Mažiau nei 200 žodžių: 199-183 atimti 1 tšk., 182-166 atimti 2, 165-149 atimti 3, 148-132 atimti 4, 131-115 atimti 5, 114-100 atimti 6.
- Jei tekstas trumpesnis nei 100 žodžių, vertinamas tik turinys, o struktūra / raiška ir raštingumas = 0.
- Jeigu tekstas nukrypsta nuo temos, temos suvokimas negali būti aukščiau 1-2/5, net jei kalba sklandi.
- Jeigu kūrinys tik paminėtas, bet nepaaiškinta, ką jis įrodo, mažink argumentų balą ir taip aiškiai parašyk.
- Jeigu daug atpasakojama, mažink argumentų balą ir parašyk: „Čia daugiau kūrinio atpasakojimas negu argumentavimas.“
- Faktines klaidas pažymėk atskirai, paaiškink, kaip taisyti, ir įtrauk į argumentų tinkamumo vertinimą.`;

const gradingSystem = `Tu esi patyręs lietuvių kalbos mokytojas, ruošiantis 10 klasės mokinį PUPP samprotavimo rašiniui. Vertink pagal NŠA patvirtintus PUPP rašymo ir teksto kūrimo užduoties bendruosius vertinimo kriterijus: Teksto turinys 10 taškų, Teksto struktūra ir kalbinė raiška 8 taškai, Raštingumas 12 taškų. Turinį vertink atskirai: Temos suvokimas ir plėtojimas /5, Teiginių pagrindimas ir argumentų tinkamumas /5. Struktūrą ir raišką vertink atskirai: Teksto struktūra ir nuoseklumas /3, Stilius, žodynas ir sintaksinių formų tinkamumas /5. Raštingumą vertink pagal klaidų skaičiaus lentelę. Pirmiausia tikrink, ar rašinys atsako į duotą temą. Jeigu tekstas nukrypsta nuo temos, turinio balas turi būti mažas, net jei kalba sklandi. Tikrink, ar kultūriniai argumentai ne tik paminėti, bet ir paaiškinti bei susieti su tema. Tikrink faktines klaidas apie kūrinius. Netaisyk taisyklingų žodžių. Jei dėl klaidos nesi tikras, pažymėk ją kaip galimą. Vertinimas turi būti praktiškas, aiškus ir sąžiningas: svarbiausia parodyti, ar mokinys išlaikytų ir ką taisyti pirmiausia. Nepateik vertinimo kaip oficialaus NŠA sprendimo - tai tik apytikslis AI vertinimas pagal kriterijus.`;

const followUpSystem = `Tu esi lietuvių kalbos mokytojas, padedantis 10 klasės mokiniui pasiruošti PUPP samprotavimo rašiniui. Tu atsakai į papildomą klausimą apie ankstesnį AI atsakymą. Nekartok viso vertinimo iš naujo. Remkis mokinio tema, jo rašiniu ir ankstesniu AI komentaru. Jei klausimas apie balus, aiškink pagal NŠA PUPP vertinimo kriterijus. Jei klausimas apie argumentą, paaiškink, kaip jį sustiprinti. Jei klausimas apie kūrinį, saugokis faktinių klaidų. Atsakyk trumpai, aiškiai ir praktiškai.`;

function workContext() {
  return works
    .map(
      (work) =>
        `${work.title} (${work.author}, ${work.authorDates}, ${work.period}, ${work.genre}) temos: ${work.themes.join(", ")}. Problema: ${work.problem}. Argumentas: ${work.sampleArgument}`,
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

Geros temos kryptys: moralė, sąžinė, pareiga, sunkumai, meilė, šeima, atsakomybė, laisvė, pavydas, savimeilė, išvaizda, išlikimas, tikslas, pasiaukojimas, abejonės, žmogiškumas, tėvynė, šalies istorija, tradicijos, tautos atmintis, darbai ir žodžiai, pasitikėjimas, vaizduotė, laimė.

Venk tuščių, labai bendrų šiuolaikinių temų, jei jos nesusietos su PUPP samprotavimu. Temos apie technologijas, internetą, socialinius tinklus, karjerą, sportą, ekologiją ar pinigus GALIMOS tik tada, jei centre yra vertybinis klausimas ir aiškiai galima remtis bent dviem kūriniais iš banko, pvz. atsakomybė, sąžinė, žmogiškumas, pasirinkimai, laisvė, tikslas, bendruomenė, tėvynė ar moralė.

Draugystės tema irgi galima, bet ji turi būti apie pasitikėjimą, išbandymą, nelaimę, moralinį pasirinkimą ar pagalbą kitam žmogui, o ne abstrakti.

Tema turi būti aiški, trumpa ir verta samprotauti. Ji gali būti klausimo forma arba sentencija. Ji neturi būti nukopijuota pažodžiui iš etalonų, bet turi skambėti taip, lyg galėtų būti PUPP užduotyje.

Dar keli tinkami temų tipai: ${topicExamples.join("; ")}.

Paskutinės vartotojui jau sugeneruotos temos:
${previousTopics.length ? previousTopics.map((topic) => `- ${topic}`).join("\n") : "- nėra"}

LABAI SVARBU dėl įvairovės:
- Nekartok tos pačios temos branduolio, tik kitais žodžiais.
- Jei paskutinės temos buvo apie sunkumus, kitą kartą rinkis ne sunkumus, o kitą kryptį, pvz. tėvynę, tradicijas, darbus ir žodžius, laimę, pasitikėjimą, meilę, pareigą, vaizduotę, atsakomybę ar moralę.
- Nekartok tų pačių pagrindinių žodžių: „sunkumai“, „tikrasis veidas“, „atskleidžia“, jei jie jau buvo paskutinėse temose.
- Nauja tema turi kelti kitą problemą, o ne būti ankstesnės temos sinonimas.

Prieš grąžindamas temą tyliai pasitikrink:
1. Ar jai tinka bent du kūriniai iš banko?
2. Ar tema turi aiškią vertybinę problemą, o ne tik šiuolaikinį paviršių?
3. Jei ji apie technologijas, karjerą ar kitą šiuolaikinę sritį, ar centre yra vertybinė PUPP problema ir ar galima remtis kūriniais?
4. Ar ji aiškiai skiriasi nuo paskutinių sugeneruotų temų?
5. Ar ji skamba kaip PUPP, o ne kaip bendras klasės pokalbis?

Grąžink šiuo formatu:
Tema:
Problema:
Galimos kryptys:
1. TAIP -
2. NE -
3. IŠ DALIES -

Nerodyk jokių vidinių kodų, seedų, atsitiktinių žymų ar techninių pastabų. Vartotojui turi matytis tik tema, problema ir kryptys.`;
    case "suggestWorksForTopic":
      return `${context}\n\nTema: ${body.topic}\n\nParink 2 geriausiai šiai temai tinkančius kūrinius iš banko. Atsakyk praktiškai 10 klasės mokiniui, ne enciklopediškai.\n\nKiekvienam kūriniui pateik:\n- Kūrinys\n- Kodėl tinka\n- Argumento kryptis\n- Ką galima teigti\n- Kokios klaidos vengti\n\nPabaigoje pridėk bendrą perspėjimą: nerašyti vien kūrinio santraukos, būtina paaiškinti, ką kūrinys įrodo apie temą.`;
    case "suggestTopicsForWorks":
      return `${context}\n\nMokinys turi šiuos 2 kūrinius: ${(body.selectedWorks || []).join(" + ")}.\n\nPasiūlyk 5-8 PUPP tipo samprotavimo temas, kurioms šie abu kūriniai tinka kartu.\n\nPrie kiekvienos temos pateik:\n1. Temos formuluotę\n- Kaip naudoti pirmą kūrinį\n- Kaip naudoti antrą kūrinį\n- Tezė / pagrindinė mintis\n\nTemos turi skambėti kaip realios PUPP temos: apie vertybes, pasirinkimus, moralę, pareigą, meilę, tėvynę, tradicijas, atsakomybę, sunkumus, žmogiškumą, pasitikėjimą ar žmogaus ydas. Neperrašyk viso rašinio.`;
    case "giveHint":
      return `${context}\n\nTema: ${body.topic}\nMokinio tekstas:\n${body.essay}\n\nŽiūrėk, kur mokinys sustojo. Neparašyk viso rašinio. Duok tik vieną aiškią užuominą.\n\nFormatas:\nKur esi dabar:\nKą daryti toliau:\nGalimas pradžios sakinys:\nKūrinys, kuris tiktų:`;
    case "checkEssay":
      return `${puppCriteria}\n\n${context}\n\nTema: ${body.topic}\nRašinys:\n${body.essay}\n\nPirmiausia nustatyk žodžių skaičių ir ar tekstas atsako į temą. Grąžink struktūruotai su šiomis kortelėmis / antraštėmis:\n\n1. Bendras įvertinimas\n- Balas: X/30\n- Statusas: Išlaikytų / Rizikinga / Neišlaikytų\n- Kodėl vienu sakiniu\n\n2. Turinys: X/10\n- Temos suvokimas ir plėtojimas: X/5\n- Teiginių pagrindimas, argumentų tinkamumas ir vertė: X/5\n- Kodėl tiek skirta:\n- Ką taisyti:\n\n3. Struktūra ir kalbinė raiška: X/8\n- Teksto struktūra ir nuoseklumas: X/3\n- Stiliaus, žodyno ir sintaksinių formų tinkamumas: X/5\n- Kodėl tiek skirta:\n- Ką taisyti:\n\n4. Raštingumas: X/12\n- Apytikslis klaidų skaičius:\n- Skirtas balas pagal klaidų lentelę:\n- Svarbiausios klaidos:\n- Galimos klaidos:\n\n5. Žodžių skaičius\n- Žodžių skaičius:\n- Ar taikomas trumpesnio teksto taškų mažinimas:\n- Kiek taškų atimta dėl apimties:\n\n6. Faktinės klaidos\n- Klaida:\n- Kodėl klaida:\n- Kaip taisyti:\n\n7. Didžiausia problema\n\n8. 3 svarbiausi pataisymai\n1.\n2.\n3.\n\n9. Minimalus planas, kad išlaikytum`;
    case "fixLanguageOnly":
      return `Pataisyk tik rašybą, skyrybą, gramatiką ir aiškias kalbos klaidas. Nekeisk mokinio minčių, netobulink argumentų be leidimo, neperrašyk stiliaus per stipriai. Jei žodis taisyklingas, jo neliesk. Jei nesi tikras, rašyk „galimai klaida“.\n\nTekstas:\n${body.essay}\n\nFormatas:\nPataisytas tekstas:\nPagrindinės pataisos:\nGalimos klaidos, kurias verta pasitikrinti:`;
    case "explainToPass":
      return `${context}\n\nTema: ${body.topic}\nRašinys:\n${body.essay}\n\nVertink praktiškai, ne idealiai: ar mokinys šiuo metu išlaikytų, ką pataisyti pirmiausia, ar atsako į temą, ar yra 2 kūriniai, ar kūriniai paaiškinti, ar yra išvada.\n\nFormatas:\nAr šiuo metu išlaikytum?\nDidžiausia problema:\n3 svarbiausi pataisymai:\n1.\n2.\n3.\nMinimalus planas, kad išlaikytum:`;
    case "detectFactualMistakes":
      return `${context}\n\nPatikrink rašinio klaidų radarą. Pažymėk: nėra aiškios nuomonės, nėra 2 kūrinių, kūrinys paminėtas bet nepaaiškintas, nėra išvados, rašoma ne į temą, galimai neteisingas faktas.\nTema: ${body.topic}\nRašinys:\n${body.essay}`;
    case "makePlan":
      return `${context}\n\nGelbėjimosi režimas. Tema: ${body.topic}. Mokinys nori įrodyti: ${body.stance}. Prisimena kūrinius: ${body.rememberedWorks}. Pasiūlyk labai paprastą planą, kad mokinys bent išlaikytų. Neparašyk viso rašinio.`;
    case "followUp":
      return `Tema: ${body.topic}\nMokinio rašinys:\n${body.essay}\nPaskutinis AI atsakymas (${body.lastAction || "nežinomas veiksmas"}):\n${body.previousAnswer}\n\nMokinio klausimas:\n${body.followUpQuestion}\n\nAtsakyk tik į klausimą. Nekartok viso ankstesnio atsakymo.`;
  }
}

function modelForAction(action: AiAction) {
  return ["checkEssay", "fixLanguageOnly", "explainToPass", "followUp"].includes(action)
    ? AI_MODELS.strong
    : AI_MODELS.cheap;
}

function systemForAction(action: AiAction) {
  if (action === "checkEssay") return gradingSystem;
  if (action === "followUp") return followUpSystem;
  return teacherSystem;
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
          error: "OPENAI_API_KEY nėra sukonfigūruotas. Įdėk raktą į .env.local lokaliai arba Render Environment Variables.",
        },
        { status: 503 },
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: modelForAction(body.action),
      temperature: body.action === "generateTopic" ? 0.9 : AI_CONFIG.temperature,
      frequency_penalty: body.action === "generateTopic" ? 0.7 : 0,
      presence_penalty: body.action === "generateTopic" ? 0.4 : 0,
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
      { error: "AI užklausa nepavyko.", detail: error instanceof Error ? error.message : "Nežinoma klaida" },
      { status: 500 },
    );
  }
}
