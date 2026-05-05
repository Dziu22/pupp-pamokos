import { NextResponse } from "next/server";
import OpenAI from "openai";
import { AI_CONFIG } from "@/app/lib/ai-config";
import { topicExamples, works } from "@/app/data/works";

type AiAction =
  | "generateTopic"
  | "suggestWorksForTopic"
  | "giveHint"
  | "checkEssay"
  | "fixLanguageOnly"
  | "detectFactualMistakes"
  | "makePlan";

type AiRequest = {
  action: AiAction;
  topic?: string;
  essay?: string;
  stance?: string;
  rememberedWorks?: string;
};

const teacherSystem = `Tu esi lietuvių kalbos mokytojas, ruošiantis 10 klasės mokinį PUPP samprotavimo rašiniui. Kalbėk lietuviškai, paprastai, draugiškai ir praktiškai. Pagal nutylėjimą neparašyk viso rašinio už mokinį: vesk ant kelio, siūlyk kryptį, parodyk, kur trūksta argumento, pataisyk faktines klaidas ir įvertink, ar darbas tikėtina išlaikytų. Primink, kad AI gali klysti, jei kalbama apie faktus.`;

const puppCriteria = `Vertink pagal Lietuvių kalbos ir literatūros PUPP rašymo ir teksto kūrimo bendruosius vertinimo kriterijus, maksimaliai 30 taškų:
- Teksto turinys: 10 taškų. Temos suvokimas ir plėtojimas iki 5 taškų; teiginių pagrindimas, argumentų tinkamumas ir vertė iki 5 taškų.
- Teksto struktūra ir kalbinė raiška: 8 taškai. Struktūra ir nuoseklumas iki 3 taškų; stiliaus, žodyno ir sintaksinių formų tinkamumas iki 5 taškų.
- Raštingumas: 12 taškų pagal gramatikos, žodyno, rašybos ir skyrybos klaidų kiekį.
- Jei tekstas trumpesnis nei 100 žodžių, vertinamas tik turinys, o už struktūrą / raišką ir raštingumą rašoma 0 taškų.
- Jei tekstas tuščias arba beveik tuščias, balas turi būti 0/30, išlaikymas: ne.`;

function workContext() {
  return works
    .map((work) => `${work.title} (${work.author}) temos: ${work.themes.join(", ")}. Argumentas: ${work.sampleArgument}`)
    .join("\n");
}

function buildPrompt(body: AiRequest) {
  const context = `Kūrinių bankas:\n${workContext()}`;
  switch (body.action) {
    case "generateTopic":
      return `Sugeneruok vieną PUPP tipo samprotavimo rašinio temą. Grąžink tik temą. Pavyzdžiai: ${topicExamples.join("; ")}.`;
    case "suggestWorksForTopic":
      return `${context}\n\nTema: ${body.topic}\nParink 2 geriausius kūrinius. Kiekvienam duok: kodėl tinka, vieną argumento kryptį, ko vengti.`;
    case "giveHint":
      return `Tema: ${body.topic}\nMokinio tekstas:\n${body.essay}\nDuok trumpą užuominą, ką rašyti toliau. Neparašyk visos pastraipos.`;
    case "checkEssay":
      return `Tu esi lietuvių kalbos mokytojas, ruošiantis 10 klasės mokinį PUPP samprotavimo rašiniui. Vertink praktiškai: svarbiausia, ar mokinys išlaikytų. Taisyti reikia gramatiką, skyrybą, logiką, struktūrą ir faktines klaidas apie kūrinius. Nebūk per griežtas, bet aiškiai pasakyk, kas trukdo išlaikyti.\n\n${puppCriteria}\n\n${context}\n\nTema: ${body.topic}\nRašinys:\n${body.essay}\n\nGrąžink tik šiuo formatu:\nApytikslis balas iš 30:\nAr išlaikytų: taip / rizikinga / ne\nTurinys iš 10:\nStruktūra ir kalbinė raiška iš 8:\nRaštingumas iš 12:\nStipriausia vieta:\nSilpniausia vieta:\nFaktinės klaidos:\nKalbos klaidos:\nAr yra 2 skirtingi kūriniai:\nKą pataisyti pirmiausia:\nTrumpas padrąsinimas:`;
    case "fixLanguageOnly":
      return `Pataisyk tik gramatiką, rašybą ir skyrybą. Nekeisk mokinio minčių, struktūros ir argumentų. Jei sakinys labai neaiškus, pažymėk skliaustuose [neaišku]. Tekstas:\n${body.essay}`;
    case "detectFactualMistakes":
      return `${context}\n\nPatikrink rašinio klaidų radarą. Pažymėk: nėra aiškios nuomonės, nėra 2 kūrinių, kūrinys paminėtas bet nepaaiškintas, nėra išvados, rašoma ne į temą, galimai neteisingas faktas.\nTema: ${body.topic}\nRašinys:\n${body.essay}`;
    case "makePlan":
      return `${context}\n\nGelbėjimosi režimas. Tema: ${body.topic}. Mokinys nori įrodyti: ${body.stance}. Prisimena kūrinius: ${body.rememberedWorks}. Pasiūlyk labai paprastą planą, kad mokinys bent išlaikytų. Neparašyk viso rašinio.`;
  }
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
      model: AI_CONFIG.model,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      messages: [
        { role: "system", content: teacherSystem },
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
