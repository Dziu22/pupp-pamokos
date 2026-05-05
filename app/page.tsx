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
  { id: "topics", label: "Temos", icon: Target },
  { id: "write", label: "Rašyti", icon: PenLine },
  { id: "ai", label: "AI", icon: Brain },
  { id: "tests", label: "Testai", icon: ClipboardList },
  { id: "progress", label: "Progresas", icon: Flame },
  { id: "cheat", label: "Špargalkė", icon: Lightbulb },
];

const mobileNav = navItems.filter((item) => ["home", "works", "write", "ai", "progress"].includes(item.id));

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

export default function HomePage() {
  const [section, setSection] = useState<Section>("home");
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("Ar sunkumai stiprina žmogų?");
  const [essay, setEssay] = useState("");
  const [checks, setChecks] = useState({ works: false, theme: false, ending: false, spelling: false });
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashBack, setFlashBack] = useState(false);
  const [quizPick, setQuizPick] = useState<Record<number, string>>({});
  const [rescue, setRescue] = useState({ stance: "IŠ DALIES", rememberedWorks: "Antigonė, Kuprelis" });

  useEffect(() => {
    const stored = localStorage.getItem("pupp-progress");
    if (stored) setProgress({ ...defaultProgress, ...JSON.parse(stored) });
    const storedEssay = localStorage.getItem("pupp-essay");
    if (storedEssay) setEssay(storedEssay);
  }, []);

  useEffect(() => {
    localStorage.setItem("pupp-progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("pupp-essay", essay);
  }, [essay]);

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

  async function callAi(action: string, extra: Record<string, string> = {}) {
    setAiLoading(true);
    setAiResult("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, topic, essay, ...extra }),
      });
      const data = await response.json();
      if (action === "generateTopic" && data.result) setTopic(data.result);
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

  function finishQuiz() {
    const correct = quizQuestions.filter((question, index) => quizPick[index] === question.answer).length;
    setProgress((current) => ({
      ...current,
      testsDone: current.testsDone + 1,
      mistakes: correct === quizQuestions.length ? current.mistakes : [...new Set([...current.mistakes, "pasikartoti kūrinių temas"])],
    }));
    markStudied();
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
            <section className="mt-6 grid gap-4 lg:grid-cols-3">
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
            <section className="mt-6">
              <SectionTitle title="Kūriniai, kuriais galima remtis" text="Ieškok pagal temą, autorių arba kūrinį. Pažymėk, ką jau pasikartojai." />
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pvz. moralė, šeima, savimeilė..." />
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredWorks.map((work) => (
                  <WorkCard key={work.id} work={work} read={progress.readWorks.includes(work.id)} onToggle={() => toggleRead(work.id)} />
                ))}
              </div>
            </section>
          )}

          {section === "topics" && (
            <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
              <div>
                <SectionTitle title="Temos ir kūrinių parinkimas" text="Įvesk temą ir spausk AI mygtuką. Kūrinius, argumentų kryptis ir ko vengti parinks AI pagal programos kūrinių banką." />
                <Card>
                  <CardContent className="pt-5">
                    <Input value={topic} onChange={(event) => setTopic(event.target.value)} />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button onClick={() => callAi("generateTopic")} disabled={aiLoading}>
                        <Sparkles className="h-4 w-4" /> AI parenka temą
                      </Button>
                      <Button variant="outline" onClick={() => callAi("suggestWorksForTopic")} disabled={aiLoading}>
                        Pasiūlyk 2 kūrinius
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="mt-4 border-teal-200 bg-teal-50">
                  <CardContent className="space-y-2 pt-5 text-sm text-teal-950">
                    <p className="font-semibold">Kūrinių parinkimą atlieka AI.</p>
                    <p>Paspaudus „Pasiūlyk 2 kūrinius“, atsakymas ateina iš AI per server route. Jei API raktas neįdėtas, AI funkcijos neveiks ir parodys konfigūracijos klaidą.</p>
                  </CardContent>
                </Card>
              </div>
              <AiPanel result={aiResult} loading={aiLoading} />
            </section>
          )}

          {section === "write" && (
            <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_360px]">
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
                        <p><strong>Turinys:</strong> 10 tšk. Temos suvokimas ir argumentai.</p>
                        <p><strong>Struktūra / raiška:</strong> 8 tšk. Pastraipos, nuoseklumas, stilius.</p>
                        <p><strong>Raštingumas:</strong> 12 tšk. Gramatika, rašyba, skyryba. Iki 100 žodžių vertinamas tik turinys.</p>
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
                      <Button onClick={() => callAi("checkEssay")} disabled={aiLoading}>Patikrink rašinį</Button>
                      <Button variant="outline" onClick={() => callAi("suggestWorksForTopic")} disabled={aiLoading}>Pasiūlyk 2 kūrinius šiai temai</Button>
                      <Button variant="outline" onClick={() => callAi("fixLanguageOnly")} disabled={aiLoading}>Sutvarkyk tik klaidas, nekeisk mano minčių</Button>
                      <Button variant="outline" onClick={() => callAi("checkEssay")} disabled={aiLoading}>Paaiškink, ką pataisyti, kad išlaikyčiau</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <AiPanel result={aiResult} loading={aiLoading} />
            </section>
          )}

          {section === "ai" && (
            <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
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
              <AiPanel result={aiResult} loading={aiLoading} />
            </section>
          )}

          {section === "tests" && (
            <section className="mt-6 grid gap-4 lg:grid-cols-2">
              <div>
                <SectionTitle title="Mini testai / kortelės" text="Greitas prisiminimas prieš rašymą." />
                <Card>
                  <CardContent className="pt-5">
                    <button className="min-h-[230px] w-full rounded-lg border border-dashed border-teal-300 bg-teal-50 p-6 text-left" onClick={() => setFlashBack((value) => !value)}>
                      {!flashBack ? (
                        <>
                          <p className="text-sm font-semibold text-teal-800">Kūrinys</p>
                          <h3 className="mt-3 text-2xl font-bold">{works[flashIndex].title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground">Paspausk kortelę, kad apverstum.</p>
                        </>
                      ) : (
                        <div className="space-y-3 text-sm">
                          <p><strong>Mintis:</strong> {works[flashIndex].mainIdea}</p>
                          <p><strong>Temos:</strong> {works[flashIndex].themes.slice(0, 6).join(", ")}</p>
                          <p><strong>Argumentas:</strong> {works[flashIndex].argumentBank.paprasta}</p>
                        </div>
                      )}
                    </button>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" onClick={() => { setFlashIndex((flashIndex + works.length - 1) % works.length); setFlashBack(false); }}>Atgal</Button>
                      <Button onClick={() => { setFlashIndex((flashIndex + 1) % works.length); setFlashBack(false); }}>Kita</Button>
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
            <section className="mt-6">
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
            <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
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

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 px-2 py-2 shadow-soft backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setSection(item.id)} className={`rounded-md px-2 py-2 text-xs font-semibold ${section === item.id ? "bg-teal-700 text-white" : "text-slate-600"}`}>
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
    <section className="rounded-lg border border-border bg-white/82 p-5 shadow-soft backdrop-blur sm:p-8">
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

function WorkCard({ work, read, onToggle }: { work: Work; read: boolean; onToggle: () => void }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{work.title}</CardTitle>
          {read && <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-700" />}
        </div>
        <p className="text-sm text-muted-foreground">{work.author}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-1.5">
          {work.themes.slice(0, 6).map((theme, index) => (
            <Badge key={theme} className={`border ${tagColors[index % tagColors.length]}`}>{theme}</Badge>
          ))}
        </div>
        <p><strong>Problema:</strong> {work.problem}</p>
        <p><strong>Situacija:</strong> {work.situation}</p>
        <p><strong>Argumentas:</strong> {work.sampleArgument}</p>
        <details className="rounded-md bg-slate-50 p-3">
          <summary className="cursor-pointer font-semibold">Argumentų bankas</summary>
          <div className="mt-2 space-y-2">
            <p><strong>Paprasta:</strong> {work.argumentBank.paprasta}</p>
            <p><strong>Vidutinė:</strong> {work.argumentBank.vidutine}</p>
            <p><strong>Stipresnė:</strong> {work.argumentBank.stipresne}</p>
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

function AiPanel({ result, loading }: { result: string; loading: boolean }) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-teal-700" /> AI atsakymas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[220px] whitespace-pre-wrap rounded-lg border bg-slate-50 p-4 text-sm leading-6">
          {loading ? "Mąstau lietuvių mokytojo režimu..." : result || "AI atsakymas atsiras čia, kai paspausi vieną iš AI mygtukų."}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">AI gali klysti, faktus visada pasitikrink.</p>
      </CardContent>
    </Card>
  );
}
