"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  Flame,
  Home,
  Lightbulb,
  Menu,
  PenLine,
  Radar,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { lastDayWorkIds, quizQuestions, works, type Work } from "@/app/data/works";

type Section = "home" | "works" | "topics" | "write" | "ai" | "tests" | "progress" | "cheat";

type UserProgress = {
  readWorks: string[];
  testsDone: number;
  essaysWritten: number;
  mistakes: string[];
  streak: number;
  lastStudyDate: string;
};

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

const defaultProgress: UserProgress = {
  readWorks: [],
  testsDone: 0,
  essaysWritten: 0,
  mistakes: ["per mažai paaiškintas kūrinys", "trūksta aiškios išvados"],
  streak: 0,
  lastStudyDate: "",
};

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Pradžia", icon: Home },
  { id: "works", label: "Kūriniai", icon: BookOpen },
  { id: "topics", label: "Tema ir kūriniai", icon: Target },
  { id: "write", label: "Rašyti", icon: PenLine },
  { id: "ai", label: "AI", icon: Brain },
  { id: "tests", label: "Kortelės / žaidimai", icon: ClipboardList },
  { id: "progress", label: "Progresas", icon: Flame },
  { id: "cheat", label: "Špargalkė", icon: Lightbulb },
];

const mobileNav: { id: Section | "more"; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Pradžia", icon: Home },
  { id: "works", label: "Kūriniai", icon: BookOpen },
  { id: "tests", label: "Kortelės", icon: ClipboardList },
  { id: "write", label: "Rašyti", icon: PenLine },
  { id: "more", label: "Daugiau", icon: Menu },
];

const tagColors = [
  "bg-teal-50 text-teal-800 border-teal-200",
  "bg-amber-50 text-amber-800 border-amber-200",
  "bg-rose-50 text-rose-800 border-rose-200",
  "bg-sky-50 text-sky-800 border-sky-200",
  "bg-emerald-50 text-emerald-800 border-emerald-200",
  "bg-violet-50 text-violet-800 border-violet-200",
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function extractGeneratedTopic(answer: string) {
  const topicLine = answer
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.toLowerCase().startsWith("tema:"));
  return topicLine ? topicLine.replace(/^tema:\s*/i, "").trim() : answer.trim();
}

export default function HomePage() {
  const [section, setSection] = useState<Section>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("Ar sunkumai stiprina žmogų?");
  const [topicWorks, setTopicWorks] = useState({ first: "Antigonė", second: "Prometėjas" });
  const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
  const [essay, setEssay] = useState("");
  const [checks, setChecks] = useState({ works: false, theme: false, ending: false, spelling: false });
  const [aiResult, setAiResult] = useState("");
  const [lastAiAction, setLastAiAction] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashBack, setFlashBack] = useState(false);
  const [flashLevel, setFlashLevel] = useState<"paprasta" | "vidutine" | "stipresne">("paprasta");
  const [quizPick, setQuizPick] = useState<Record<number, string>>({});
  const [rescue, setRescue] = useState({ stance: "IŠ DALIES", rememberedWorks: "Antigonė, Kuprelis" });

  useEffect(() => {
    const stored = localStorage.getItem("pupp-progress");
    if (stored) setProgress({ ...defaultProgress, ...JSON.parse(stored) });
    const storedEssay = localStorage.getItem("pupp-essay");
    if (storedEssay) setEssay(storedEssay);
    const storedTopics = localStorage.getItem("pupp-generated-topics");
    if (storedTopics) setGeneratedTopics(JSON.parse(storedTopics));
  }, []);

  useEffect(() => {
    localStorage.setItem("pupp-progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("pupp-essay", essay);
  }, [essay]);

  useEffect(() => {
    localStorage.setItem("pupp-generated-topics", JSON.stringify(generatedTopics.slice(-12)));
  }, [generatedTopics]);

  const filteredWorks = useMemo(() => {
    const query = search.toLowerCase();
    return works.filter(
      (work) =>
        work.title.toLowerCase().includes(query) ||
        work.author.toLowerCase().includes(query) ||
        work.themes.some((theme) => theme.toLowerCase().includes(query)),
    );
  }, [search]);

  const wordCount = countWords(essay);
  const essayProgress = Math.min(100, Math.round((wordCount / 350) * 60) + Object.values(checks).filter(Boolean).length * 10);
  const readPercent = Math.round((progress.readWorks.length / works.length) * 100);
  const lastDayWorks = works.filter((work) => lastDayWorkIds.includes(work.id));
  const flashWork = works[flashIndex];

  function markStudied() {
    const today = todayKey();
    setProgress((current) => ({
      ...current,
      streak: current.lastStudyDate === today ? current.streak : current.streak + 1,
      lastStudyDate: today,
    }));
  }

  function toggleRead(id: string) {
    markStudied();
    setProgress((current) => ({
      ...current,
      readWorks: current.readWorks.includes(id)
        ? current.readWorks.filter((item) => item !== id)
        : [...current.readWorks, id],
    }));
  }

  async function callAi(action: string, extra: Record<string, unknown> = {}) {
    if (action === "checkEssay") {
      if (!topic.trim()) {
        setAiResult("Įrašyk temą, nes be jos negalima tiksliai įvertinti temos suvokimo.");
        setLastAiAction(action);
        setChatMessages([]);
        return;
      }
      if (countWords(essay) < 20) {
        setAiResult("Pirmiausia parašyk bent kelias pastraipas, tada galėsiu įvertinti pagal PUPP kriterijus.");
        setLastAiAction(action);
        setChatMessages([]);
        return;
      }
    }

    setAiLoading(true);
    setAiResult("");
    setLastAiAction(action);
    setChatMessages([]);
    try {
      const previousTopics = action === "generateTopic" ? [...generatedTopics, topic].filter(Boolean).slice(-10) : undefined;
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, topic, essay, previousTopics, ...extra }),
      });
      const data = await response.json();
      if (action === "generateTopic" && data.result) {
        const generatedTopic = extractGeneratedTopic(data.result);
        setTopic(generatedTopic);
        setGeneratedTopics((current) => [...new Set([...current, topic, generatedTopic])].filter(Boolean).slice(-12));
      }
      setAiResult(data.result || data.error || "Atsakymo nėra.");
      markStudied();
      if (action === "checkEssay") {
        setProgress((current) => ({ ...current, essaysWritten: current.essaysWritten + 1 }));
      }
    } catch {
      setAiResult("Nepavyko prisijungti prie AI route. Patikrink, ar veikia dev serveris.");
    } finally {
      setAiLoading(false);
    }
  }

  async function askFollowUp() {
    if (!chatQuestion.trim() || !aiResult.trim()) return;
    const question = chatQuestion.trim();
    setChatQuestion("");
    setChatMessages((current) => [...current, { role: "user", text: question }]);
    setChatLoading(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "followUp",
          topic,
          essay,
          previousAnswer: aiResult,
          followUpQuestion: question,
          lastAction: lastAiAction,
        }),
      });
      const data = await response.json();
      setChatMessages((current) => [...current, { role: "ai", text: data.result || data.error || "Atsakymo nėra." }]);
    } catch {
      setChatMessages((current) => [...current, { role: "ai", text: "Nepavyko prisijungti prie AI route." }]);
    } finally {
      setChatLoading(false);
    }
  }

  function finishQuiz() {
    const correct = quizQuestions.filter((question, index) => quizPick[index] === question.answer).length;
    setProgress((current) => ({
      ...current,
      testsDone: current.testsDone + 1,
      mistakes: correct === quizQuestions.length ? current.mistakes : [...new Set([...current.mistakes, "pasikartoti kūrinių temas"])],
    }));
    markStudied();
  }

  function goToFlash(nextIndex: number) {
    setFlashIndex((nextIndex + works.length) % works.length);
    setFlashBack(false);
  }

  function randomFlash() {
    goToFlash(Math.floor(Math.random() * works.length));
  }

  function markFlashKnown() {
    if (!progress.readWorks.includes(flashWork.id)) {
      toggleRead(flashWork.id);
    } else {
      markStudied();
    }
    goToFlash(flashIndex + 1);
  }

  return (
    <main className="min-h-screen pb-24 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-lg border border-border bg-white/82 p-3 shadow-soft backdrop-blur lg:block">
          <div className="px-3 py-3">
            <p className="text-sm font-bold text-teal-800">PUPP Pamokos</p>
            <p className="mt-1 text-xs text-muted-foreground">Rašinys ramiai, aiškiai, praktiškai.</p>
          </div>
          <nav className="mt-2 grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition ${
                    section === item.id ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            AI gali klysti, faktus visada pasitikrink.
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Hero setSection={setSection} progress={progress} readPercent={readPercent} />

          {section === "home" && (
            <section className="animate-rise-in mt-6 grid gap-4 lg:grid-cols-3">
              <DashboardCard title="Šiandienos fokusas" icon={Target}>
                <p className="text-sm text-muted-foreground">Pasirink temą, susirask 2 kūrinius ir parašyk bent 180 žodžių juodraštį.</p>
                <Button className="mt-4 w-full" onClick={() => setSection("write")}>
                  <PenLine className="h-4 w-4" /> Pradėti rašyti
                </Button>
              </DashboardCard>
              <DashboardCard title="Paskutinės dienos režimas" icon={Flame}>
                <p className="text-sm text-muted-foreground">6 svarbiausi kūriniai po 3 sakinius, kai reikia greitai prisiminti esmę.</p>
                <Button className="mt-4 w-full" variant="secondary" onClick={() => setSection("cheat")}>
                  Atidaryti
                </Button>
              </DashboardCard>
              <DashboardCard title="Klaidų radaras" icon={Radar}>
                <p className="text-sm text-muted-foreground">Patikrina, ar yra nuomonė, 2 kūriniai, paaiškinimas, išvada ir faktų rizikos.</p>
                <Button className="mt-4 w-full" variant="outline" onClick={() => callAi("detectFactualMistakes")}>
                  <Radar className="h-4 w-4" /> Paleisti
                </Button>
              </DashboardCard>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Greitas progresas</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-4">
                  <Metric label="Perskaityti kūriniai" value={`${progress.readWorks.length}/${works.length}`} />
                  <Metric label="Atlikti testai" value={`${progress.testsDone}`} />
                  <Metric label="Parašyti rašiniai" value={`${progress.essaysWritten}`} />
                  <Metric label="Streak" value={`${progress.streak} d.`} />
                </CardContent>
              </Card>
            </section>
          )}

          {section === "works" && (
            <section className="animate-rise-in mt-6">
              <SectionTitle title="Kūriniai, kuriais galima remtis" text="Ieškok pagal temą, autorių arba kūrinį. Pažymėk, ką jau pasikartojai." />
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pvz. moralė, šeima, savimeilė..." />
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredWorks.map((work) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    read={progress.readWorks.includes(work.id)}
                    onToggle={() => toggleRead(work.id)}
                    onThemeClick={(theme) => setSearch(theme)}
                  />
                ))}
              </div>
            </section>
          )}

          {section === "topics" && (
            <section className="animate-rise-in mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
              <div>
                <SectionTitle title="Tema ir kūriniai" text="Du režimai: pagal gautą temą parink 2 kūrinius arba pagal 2 kūrinius susirask tinkamas temas." />
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gavau temą → parink 2 kūrinius</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Pvz. Ar sunkumai stiprina žmogų?" />
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => callAi("generateTopic")} disabled={aiLoading}>
                          <Sparkles className="h-4 w-4" /> AI parenka temą
                        </Button>
                        <Button variant="outline" onClick={() => callAi("suggestWorksForTopic")} disabled={aiLoading}>
                          Pasiūlyk 2 kūrinius
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Turiu 2 kūrinius → pasiūlyk temas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <WorkSelect value={topicWorks.first} onChange={(value) => setTopicWorks((current) => ({ ...current, first: value }))} />
                        <WorkSelect value={topicWorks.second} onChange={(value) => setTopicWorks((current) => ({ ...current, second: value }))} />
                      </div>
                      <Button
                        onClick={() => callAi("suggestTopicsForWorks", { selectedWorks: [topicWorks.first, topicWorks.second] })}
                        disabled={aiLoading || topicWorks.first === topicWorks.second}
                      >
                        <Target className="h-4 w-4" /> Pasiūlyk temas šiems kūriniams
                      </Button>
                      {topicWorks.first === topicWorks.second && (
                        <p className="text-sm text-rose-700">Pasirink 2 skirtingus kūrinius.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <Card className="mt-4 border-teal-200 bg-teal-50">
                  <CardContent className="space-y-2 pt-5 text-sm text-teal-950">
                    <p className="font-semibold">Kūrinių ir temų parinkimą atlieka AI.</p>
                    <p>Atsakyme ieškok ne santraukos, o minties: ką kūrinys padeda įrodyti apie temą.</p>
                  </CardContent>
                </Card>
              </div>
              <AiPanel
                result={aiResult}
                loading={aiLoading}
                lastAction={lastAiAction}
                chatMessages={chatMessages}
                chatQuestion={chatQuestion}
                setChatQuestion={setChatQuestion}
                askFollowUp={askFollowUp}
                chatLoading={chatLoading}
              />
            </section>
          )}

          {section === "write" && (
            <section className="animate-rise-in mt-6 grid gap-4 xl:grid-cols-[1fr_360px]">
              <div>
                <SectionTitle title="Rašinio rašymas" text="Samprotavimo rašinys su 2 skirtingais kultūriniais argumentais iš 2 skirtingų kūrinių. AI vertina pagal PUPP rašymo vertinimo kriterijus." />
                <Card>
                  <CardContent className="space-y-4 pt-5">
                    <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                      <Input value={topic} onChange={(event) => setTopic(event.target.value)} />
                      <Button onClick={() => callAi("generateTopic")} disabled={aiLoading}>
                        <Sparkles className="h-4 w-4" /> Tema
                      </Button>
                    </div>
                    <WritingStructure />
                    <Card className="border-sky-200 bg-sky-50">
                      <CardContent className="grid gap-3 pt-5 text-sm text-sky-950 md:grid-cols-3">
                        <p><strong>Turinys: 10 tšk.</strong><br />Temos suvokimas: 5<br />Argumentai: 5</p>
                        <p><strong>Struktūra / raiška: 8 tšk.</strong><br />Struktūra: 3<br />Raiška: 5</p>
                        <p><strong>Raštingumas: 12 tšk.</strong><br />Klaidų skaičius pagal NŠA lentelę. Iki 100 žodžių vertinamas tik turinys.</p>
                        <p className="md:col-span-3 text-xs text-sky-800">Pagal NŠA PUPP rašymo vertinimo kriterijus.</p>
                      </CardContent>
                    </Card>
                    <Textarea
                      className="min-h-[420px] text-base leading-7"
                      value={essay}
                      onChange={(event) => setEssay(event.target.value)}
                      placeholder="Rašyk čia. Pradėk nuo raktinių žodžių paaiškinimo ir aiškios rašinio krypties..."
                    />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        ["works", "turiu 2 kūrinius"],
                        ["theme", "atsakiau į temą"],
                        ["ending", "parašiau išvadą"],
                        ["spelling", "nepamiršau nosinių"],
                      ].map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium">
                          <input
                            type="checkbox"
                            checked={checks[key as keyof typeof checks]}
                            onChange={(event) => setChecks((current) => ({ ...current, [key]: event.target.checked }))}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-sm font-semibold">
                        <span>{wordCount} žodžiai</span>
                        <span>{essayProgress}% pasiruošimo</span>
                      </div>
                      <Progress value={essayProgress} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => callAi("giveHint")} disabled={aiLoading}>Duok užuominą</Button>
                      <Button className="shadow-soft" onClick={() => callAi("checkEssay")} disabled={aiLoading}>Patikrink rašinį</Button>
                      <Button variant="outline" onClick={() => callAi("suggestWorksForTopic")} disabled={aiLoading}>Pasiūlyk 2 kūrinius šiai temai</Button>
                      <Button variant="outline" onClick={() => callAi("fixLanguageOnly")} disabled={aiLoading}>Sutvarkyk tik klaidas, nekeisk mano minčių</Button>
                      <Button variant="outline" onClick={() => callAi("explainToPass")} disabled={aiLoading}>Paaiškink, ką pataisyti, kad išlaikyčiau</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <AiPanel
                result={aiResult}
                loading={aiLoading}
                lastAction={lastAiAction}
                chatMessages={chatMessages}
                chatQuestion={chatQuestion}
                setChatQuestion={setChatQuestion}
                askFollowUp={askFollowUp}
                chatLoading={chatLoading}
              />
            </section>
          )}

          {section === "ai" && (
            <section className="animate-rise-in mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
              <div>
                <SectionTitle title="AI pagalba" text="Gelbėjimosi režimas padeda susidėti paprastą planą, kai galvoje tuščia." />
                <Card>
                  <CardContent className="space-y-3 pt-5">
                    <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Kokia tema?" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <select className="h-10 rounded-md border bg-white px-3 text-sm" value={rescue.stance} onChange={(event) => setRescue((current) => ({ ...current, stance: event.target.value }))}>
                        <option>TAIP</option>
                        <option>NE</option>
                        <option>IŠ DALIES</option>
                      </select>
                      <Input value={rescue.rememberedWorks} onChange={(event) => setRescue((current) => ({ ...current, rememberedWorks: event.target.value }))} placeholder="Kokius kūrinius prisimeni?" />
                    </div>
                    <Button onClick={() => callAi("makePlan", rescue)} disabled={aiLoading}>
                      <Brain className="h-4 w-4" /> Sudaryk gelbėjimosi planą
                    </Button>
                  </CardContent>
                </Card>
                <Card className="mt-4 border-amber-200 bg-amber-50">
                  <CardContent className="pt-5 text-sm text-amber-950">
                    AI gali klysti, faktus visada pasitikrink. Šis puslapis nėra oficialus PUPP puslapis.
                  </CardContent>
                </Card>
              </div>
              <AiPanel
                result={aiResult}
                loading={aiLoading}
                lastAction={lastAiAction}
                chatMessages={chatMessages}
                chatQuestion={chatQuestion}
                setChatQuestion={setChatQuestion}
                askFollowUp={askFollowUp}
                chatLoading={chatLoading}
              />
            </section>
          )}

          {section === "tests" && (
            <section className="animate-rise-in mt-6 grid gap-4 lg:grid-cols-2">
              <div>
                <SectionTitle title="Kortelės / žaidimai kūrinių mokymuisi" text="Telefonui patogus režimas: prisimink kūrinį, apversk kortelę, tada pažymėk, ar jau moki." />
                <Card>
                  <CardContent className="space-y-4 pt-5">
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <select
                        className="h-10 rounded-md border bg-white px-3 text-sm"
                        value={flashIndex}
                        onChange={(event) => goToFlash(Number(event.target.value))}
                      >
                        {works.map((work, index) => (
                          <option key={work.id} value={index}>{work.title}</option>
                        ))}
                      </select>
                      <Button variant="outline" onClick={randomFlash}>Atsitiktinė</Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(["paprasta", "vidutine", "stipresne"] as const).map((level) => (
                        <Button
                          key={level}
                          size="sm"
                          variant={flashLevel === level ? "default" : "outline"}
                          onClick={() => setFlashLevel(level)}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>

                    <button className="min-h-[300px] w-full rounded-lg border border-dashed border-teal-300 bg-teal-50 p-5 text-left transition hover:bg-teal-100 sm:p-6" onClick={() => setFlashBack((value) => !value)}>
                      {!flashBack ? (
                        <>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-teal-800">Prisimink prieš apversdamas</p>
                            {progress.readWorks.includes(flashWork.id) && <Badge className="border-teal-200 bg-white text-teal-800">moku</Badge>}
                          </div>
                          <h3 className="mt-4 text-3xl font-black leading-tight">{flashWork.title}</h3>
                          <AuthorLine author={flashWork.author} suffix={`${flashWork.authorDates} · ${flashWork.period}`} />
                          <div className="mt-5 space-y-2 text-sm text-slate-700">
                            <p><strong>Paklausk savęs:</strong> kokia pagrindinė mintis?</p>
                            <p><strong>Kur tinka?</strong> pabandyk pasakyti bent 3 temas.</p>
                            <p><strong>Rašinyje:</strong> ką šis kūrinys galėtų įrodyti?</p>
                          </div>
                          <p className="mt-5 text-sm text-muted-foreground">Paspausk kortelę, kad patikrintum atsakymą.</p>
                        </>
                      ) : (
                        <div className="space-y-4 text-sm">
                          <div>
                            <p className="text-xs font-black uppercase text-teal-800">Atsakymas</p>
                            <h3 className="mt-1 text-2xl font-black">{flashWork.title}</h3>
                          </div>
                          <p><strong>Pagrindinė mintis:</strong> {flashWork.mainIdea}</p>
                          <p><strong>Problema:</strong> {flashWork.problem}</p>
                          <p><strong>Temos:</strong> {flashWork.themes.slice(0, 8).join(", ")}</p>
                          <p><strong>{flashLevel} argumento kryptis:</strong> {flashWork.argumentBank[flashLevel]}</p>
                          <p className="rounded-md border border-rose-200 bg-white p-3 text-rose-900"><strong>Ko nepamiršti:</strong> {flashWork.commonMistakes}</p>
                        </div>
                      )}
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" onClick={() => goToFlash(flashIndex - 1)}>Atgal</Button>
                      <Button variant="secondary" onClick={() => setFlashBack((value) => !value)}>
                        {flashBack ? "Paslėpti" : "Apversti"}
                      </Button>
                      <Button onClick={() => goToFlash(flashIndex + 1)}>Kita</Button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button variant="outline" onClick={() => setFlashBack(false)}>Dar kartą</Button>
                      <Button onClick={markFlashKnown}>
                        <CheckCircle2 className="h-4 w-4" /> Moku, kita
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Quiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quizQuestions.map((question, index) => (
                    <div key={question.question} className="rounded-md border bg-white p-3">
                      <p className="font-semibold">{question.question}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {question.options.map((option) => (
                          <Button key={option} size="sm" variant={quizPick[index] === option ? "default" : "outline"} onClick={() => setQuizPick((current) => ({ ...current, [index]: option }))}>
                            {option}
                          </Button>
                        ))}
                      </div>
                      {quizPick[index] && (
                        <p className={`mt-2 text-sm font-semibold ${quizPick[index] === question.answer ? "text-teal-700" : "text-rose-700"}`}>
                          {quizPick[index] === question.answer ? "Teisingai." : `Teisingas atsakymas: ${question.answer}`}
                        </p>
                      )}
                    </div>
                  ))}
                  <Button onClick={finishQuiz}>Užskaityti testą</Button>
                </CardContent>
              </Card>
            </section>
          )}

          {section === "progress" && (
            <section className="animate-rise-in mt-6">
              <SectionTitle title="Mano progresas" text="Viskas saugoma tavo naršyklės localStorage." />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Kūrinių progresas" value={`${readPercent}%`} progress={readPercent} />
                <MetricCard label="Testai" value={`${progress.testsDone}`} progress={Math.min(100, progress.testsDone * 20)} />
                <MetricCard label="Rašiniai" value={`${progress.essaysWritten}`} progress={Math.min(100, progress.essaysWritten * 25)} />
                <MetricCard label="Streak" value={`${progress.streak} d.`} progress={Math.min(100, progress.streak * 12)} />
              </div>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Dažniausiai daromos klaidos</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {progress.mistakes.map((mistake) => (
                    <Badge key={mistake} className="border-rose-200 bg-rose-50 text-rose-800">{mistake}</Badge>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}

          {section === "cheat" && (
            <section className="animate-rise-in mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
              <div>
                <SectionTitle title="Greita 1 lapo špargalkė" text="Paskutinės dienos režimas: tik svarbiausi 6 kūriniai ir esminės formuluotės." />
                <div className="grid gap-4 md:grid-cols-2">
                  {lastDayWorks.map((work) => (
                    <Card key={work.id}>
                      <CardHeader>
                        <CardTitle>{work.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2 text-sm">
                          {(work.lastDay || []).map((sentence) => <li key={sentence}>{sentence}</li>)}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Universalus karkasas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p><strong>Įžanga:</strong> Paaiškink raktinius žodžius ir pasakyk savo kryptį.</p>
                  <p><strong>1 argumentas:</strong> Teiginys + paaiškinimas + kūrinys + ką įrodo.</p>
                  <p><strong>2 argumentas:</strong> Kitas aspektas + kitas kūrinys + ryšys su tema.</p>
                  <p><strong>Pabaiga:</strong> Aiškiai atsakyk į temos klausimą ir parodyk aktualumą.</p>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-x-3 bottom-[76px] z-30 rounded-lg border border-border bg-white p-3 shadow-soft lg:hidden">
          <p className="px-2 pb-2 text-xs font-black uppercase text-muted-foreground">Visos funkcijos</p>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-md border px-3 py-3 text-left text-sm font-semibold ${
                    section === item.id ? "border-teal-700 bg-teal-50 text-teal-900" : "border-border bg-slate-50 text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 px-2 py-2 shadow-soft backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = item.id === "more" ? mobileMenuOpen : section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "more") {
                    setMobileMenuOpen((open) => !open);
                    return;
                  }
                  setSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`rounded-md px-1 py-2 text-[11px] font-semibold ${active ? "bg-teal-700 text-white" : "text-slate-600"}`}
              >
                <Icon className="mx-auto mb-1 h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function Hero({ setSection, progress, readPercent }: { setSection: (section: Section) => void; progress: UserProgress; readPercent: number }) {
  return (
    <section className="animate-soft-in rounded-lg border border-border bg-white/82 p-5 shadow-soft backdrop-blur sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <Badge className="border-teal-200 bg-teal-50 text-teal-800">10 klasės PUPP rašinio treneris</Badge>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">PUPP Pamokos</h1>
          <p className="mt-4 max-w-2xl text-lg font-medium text-slate-700">Pasiruošk PUPP rašiniui aiškiai, ramiai ir praktiškai.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => setSection("write")}><PenLine className="h-4 w-4" /> Rašyti rašinį</Button>
            <Button variant="secondary" onClick={() => setSection("works")}><BookOpen className="h-4 w-4" /> Kartoti kūrinius</Button>
          </div>
        </div>
        <div className="rounded-lg border bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold">Šiandien</span>
            <Badge className="border-amber-200 bg-amber-50 text-amber-800">{progress.streak} d. streak</Badge>
          </div>
          <Progress value={readPercent} />
          <p className="mt-3 text-sm text-muted-foreground">Perskaityta {progress.readWorks.length} iš {works.length} kūrinių. Vienas geras argumentas per dieną - jau rimtas judesys.</p>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function DashboardCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-teal-700" /> {title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-black">{value}</p>
        <Progress className="mt-3" value={progress} />
      </CardContent>
    </Card>
  );
}

function WorkSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <select
      className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {works.map((work) => (
        <option key={work.id} value={work.title}>
          {work.title}
        </option>
      ))}
    </select>
  );
}

function WorkCard({
  work,
  read,
  onToggle,
  onThemeClick,
}: {
  work: Work;
  read: boolean;
  onToggle: () => void;
  onThemeClick: (theme: string) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{work.title}</CardTitle>
          {read && <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-700" />}
        </div>
        <AuthorLine author={work.author} suffix={`${work.authorDates} · ${work.period} · ${work.genre}`} />
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-1.5">
          {work.themes.slice(0, 6).map((theme, index) => (
            <button key={theme} type="button" onClick={() => onThemeClick(theme)}>
              <Badge className={`border transition hover:scale-[1.02] ${tagColors[index % tagColors.length]}`}>{theme}</Badge>
            </button>
          ))}
        </div>
        <p><strong>Problema:</strong> {work.problem}</p>
        <p><strong>Situacija:</strong> {work.situation}</p>
        <p><strong>Argumentas:</strong> {work.sampleArgument}</p>
        <details className="rounded-md bg-slate-50 p-3">
          <summary className="cursor-pointer font-semibold">Argumentų bankas</summary>
          <div className="mt-2 grid gap-2">
            <ArgumentLevelBox level="Paprasta" className="border-emerald-200 bg-emerald-50 text-emerald-950" text={work.argumentBank.paprasta} />
            <ArgumentLevelBox level="Vidutinė" className="border-sky-200 bg-sky-50 text-sky-950" text={work.argumentBank.vidutine} />
            <ArgumentLevelBox level="Stipresnė" className="border-violet-200 bg-violet-50 text-violet-950" text={work.argumentBank.stipresne} />
          </div>
        </details>
        <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-900"><strong>Dažna klaida:</strong> {work.commonMistakes}</p>
        <Button className="w-full" variant={read ? "secondary" : "default"} onClick={onToggle}>
          {read ? "Pažymėta kaip perskaityta" : "Pažymėti, kad pasikartojau"}
        </Button>
      </CardContent>
    </Card>
  );
}

function ArgumentLevelBox({ level, text, className }: { level: string; text: string; className: string }) {
  return (
    <div className={`rounded-md border p-3 ${className}`}>
      <p className="text-xs font-black uppercase">{level}</p>
      <p className="mt-1">{text}</p>
    </div>
  );
}

function AuthorLine({ author, suffix }: { author: string; suffix: string }) {
  const match = author.match(/^(.*?)\s*(\(.+\))$/);
  const main = match?.[1] || author;
  const original = match?.[2];

  return (
    <p className="text-sm text-muted-foreground">
      <span>{main}</span>
      {original && <span className="text-xs"> {original}</span>}
      <span> · {suffix}</span>
    </p>
  );
}

function WritingStructure() {
  const rows = [
    ["PIRMA PASTRAIPA - įžanga", "raktiniai žodžiai, rašinio kryptis, probleminis klausimas arba pagrindinė mintis"],
    ["ANTRA DĖSTYMO PASTRAIPA", "aspektas / teiginys, 1-2 detalizuojamieji sakiniai, kultūrinis argumentas iš kūrinio"],
    ["TREČIA DĖSTYMO PASTRAIPA", "kitas aspektas, 1-2 detalizuojamieji sakiniai, argumentas iš kito kūrinio"],
    ["PABAIGOS PASTRAIPA", "apibendrinimas ir atsakymas, kodėl tema aktuali"],
  ];

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {rows.map(([title, text]) => (
        <div key={title} className="rounded-md border bg-slate-50 p-3">
          <p className="text-xs font-black uppercase tracking-wide text-teal-800">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
}

function AiPanel({
  result,
  loading,
  lastAction,
  chatMessages,
  chatQuestion,
  setChatQuestion,
  askFollowUp,
  chatLoading,
}: {
  result: string;
  loading: boolean;
  lastAction: string;
  chatMessages: ChatMessage[];
  chatQuestion: string;
  setChatQuestion: (value: string) => void;
  askFollowUp: () => void;
  chatLoading: boolean;
}) {
  const isEssayCheck = lastAction === "checkEssay";
  const sections = isEssayCheck ? splitEvaluationSections(result) : [];

  return (
    <Card className="animate-soft-in h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-teal-700" /> AI atsakymas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEssayCheck && result && !loading ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
              <p className="text-xs font-semibold text-sky-950">Vertinama pagal NŠA patvirtintus PUPP rašymo ir teksto kūrimo užduoties bendruosius vertinimo kriterijus.</p>
              <p className="mt-1 text-[11px] text-sky-800" title="Tai nėra oficialus NŠA vertinimas. AI pateikia apytikslį įvertinimą pagal kriterijus.">
                Tai nėra oficialus NŠA vertinimas. AI pateikia apytikslį įvertinimą pagal kriterijus.
              </p>
            </div>
            {sections.length ? (
              sections.map((section) => (
                <div key={section.title} className="animate-soft-in whitespace-pre-wrap rounded-lg border bg-slate-50 p-4 text-sm leading-6">
                  <p className="mb-2 font-black text-slate-900">{section.title}</p>
                  <p>{section.body}</p>
                </div>
              ))
            ) : (
              <div className="animate-soft-in min-h-[220px] whitespace-pre-wrap rounded-lg border bg-slate-50 p-4 text-sm leading-6">{result}</div>
            )}
          </div>
        ) : (
          <div className="animate-soft-in min-h-[220px] whitespace-pre-wrap rounded-lg border bg-slate-50 p-4 text-sm leading-6">
            {loading ? "Mąstau lietuvių mokytojo režimu..." : result || "AI atsakymas atsiras čia, kai paspausi vieną iš AI mygtukų."}
          </div>
        )}

        <p className="text-xs text-muted-foreground">AI gali klysti, faktus visada pasitikrink.</p>

        {result && !loading && (
          <div className="rounded-lg border bg-white p-3">
            <p className="text-sm font-black">Paklausk apie atsakymą</p>
            <div className="mt-3 max-h-56 space-y-2 overflow-auto">
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-8 bg-teal-700 text-white"
                      : "mr-8 bg-slate-100 text-slate-800"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {chatLoading && <div className="mr-8 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">AI galvoja...</div>}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={chatQuestion}
                onChange={(event) => setChatQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) askFollowUp();
                }}
                placeholder="Pvz. kodėl tiek balų? kaip pataisyti argumentą? ar šitas kūrinys tinka?"
              />
              <Button onClick={askFollowUp} disabled={chatLoading || !chatQuestion.trim()}>Klausti</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function splitEvaluationSections(result: string) {
  const matches = [...result.matchAll(/(^|\n)(\d+\.\s+[^\n]+)\n/g)];
  if (!matches.length) return [];

  return matches.map((match, index) => {
    const title = match[2].trim();
    const bodyStart = (match.index || 0) + match[0].length;
    const bodyEnd = index + 1 < matches.length ? matches[index + 1].index || result.length : result.length;
    return {
      title,
      body: result.slice(bodyStart, bodyEnd).trim(),
    };
  });
}
