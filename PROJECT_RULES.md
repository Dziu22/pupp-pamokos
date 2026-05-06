# PROJECT RULES - PUPP Pamokos

Šis failas saugo svarbiausias projekto taisykles, kad jos nepradingtų, jei pokalbio kontekstas susispaustų.

## Bendras Tikslas

- App yra lietuviška PUPP samprotavimo rašinio mokymosi platforma 10 klasei.
- Fokusas: greitas įsiminimas, praktinis kūrinių pritaikymas rašinyje, aiškus argumentavimas.
- UI turi būti švarus, modernus, patogus telefone, neperkrautas.
- Nerašyti, kad tai oficialus PUPP ar NŠA puslapis.

## AI Elgesys

- AI turi kalbėti lietuviškai, paprastai, kaip draugiškas, bet sąžiningas mokytojas.
- AI neturi parašyti viso rašinio už mokinį, nebent vartotojas aiškiai paprašo pavyzdžio.
- Pagal nutylėjimą AI turi vesti ant kelio: pasiūlyti kryptį, kūrinį, pataisymą, paaiškinti klaidą.
- AI turi naudoti server-side route `/api/ai`; API raktas negali būti frontend'e.
- Be `OPENAI_API_KEY` AI funkcijos turi grąžinti aiškią klaidą, ne mock atsakymą.
- Rašinio vertinimas ir follow-up chat naudoja stipresnį modelį.
- Paprastos užduotys, kaip temos, užuominos ir kūrinių pasiūlymai, gali naudoti pigesnį modelį.

## PUPP Vertinimas

- Rašinio tikrinimas turi remtis NŠA patvirtintais PUPP rašymo ir teksto kūrimo bendraisiais vertinimo kriterijais.
- Maksimalus balas: 30.
- Turinys: 10 tšk.
  - Temos suvokimas ir plėtojimas: 5.
  - Teiginių pagrindimas, argumentų tinkamumas ir vertė: 5.
- Struktūra ir kalbinė raiška: 8 tšk.
  - Teksto struktūra ir nuoseklumas: 3.
  - Stilius, žodynas ir sintaksinių formų tinkamumas: 5.
- Raštingumas: 12 tšk. pagal klaidų skaičiaus lentelę.
- Jei tekstas trumpesnis nei 100 žodžių, vertinamas tik turinys, o struktūra / raiška ir raštingumas = 0.
- Jei rašinys nukrypsta nuo temos, turinio balas turi būti mažas net tada, kai kalba graži.
- Jei kūrinys tik paminėtas, bet nepaaiškinta, ką jis įrodo, argumentų balas mažinamas.
- Jei daug atpasakojama, argumentų balas mažinamas.
- Faktinės klaidos turi būti pažymėtos ir įtrauktos į argumentų tinkamumo vertinimą.
- Prie vertinimo rodyti:
  - „Vertinama pagal NŠA patvirtintus PUPP rašymo ir teksto kūrimo užduoties bendruosius vertinimo kriterijus.“
  - „Tai nėra oficialus NŠA vertinimas. AI pateikia apytikslį įvertinimą pagal kriterijus.“

## Autorių Formos

Visur svetainėje, argumentuose, AI atsakymuose ir pavyzdžiuose naudoti sulietuvintas formas. Originalą galima rodyti tik skliausteliuose informacinėje kortelėje.

- Oskaras Vaildas (Oscar Wilde)
- Erichas Marija Remarkas (Erich Maria Remarque)
- Džeromas Deividas Selindžeris (J. D. Salinger / Jerome David Salinger)
- Moljeras (Molière / Jean-Baptiste Poquelin)
- Sofoklis (Sophocles)
- Homeras (Homer)
- Dantė Aligjeris (Dante Alighieri)
- Viljamas Šekspyras (William Shakespeare)
- Biblija / Šventasis Raštas
- Senovės graikų mitai (autorius nežinomas)

## Svarbios Rašybos / Faktų Taisyklės

- Turi būti „Doriano Grėjaus portretas“, „Dorianas Grėjus“, su `ė`.
- Turi būti „Tartiufas“, ne „Tartifas“.
- „Marti“ taisyklė: Katrės niekas nevertė dirbti. Kūrinys ne apie darbą.
- „Marti“ esmė: prievartinė nelaiminga santuoka, emocinis šaltumas, nepagarba, vyro ir uošvių abejingumas.
- „Marti“ argumentuose ir AI feedbackuose nerašyti, kad Katrė mirė dėl darbo.

## Kūrinių Ir Argumentų Bankas

- Argumentai turi būti pritaikomi PUPP samprotavimo rašinyje, ne kūrinio santrauka.
- Kiekvienas argumentų banko lygis privalo turėti 3 dalis:
  - Argumento mintis: ką kūrinys įrodo.
  - Konkretus įvykis / situacija: trumpas kūrinio momentas, kurį galima paminėti.
  - Kaip susieti su tema: sakinys, kuris padeda argumentuoti, o ne tik atpasakoti.
- Konkretus įvykis būtinas, nes PUPP rašinyje remiantis kūriniu reikia parodyti realų kūrinio momentą.
- Kiekvienas kūrinys turi 3 argumentų lygius:
  - Paprasta: trumpas aiškus argumentas silpnesniam mokiniui.
  - Vidutinė: argumentas su platesne mintimi.
  - Stipresnė: brandesnė interpretacija geresnei pastraipai.
- Kūrinių kortelėse dažna klaida turi būti ryški ir praktiška.
- Temos turi būti clickable tags/chips.
- Argumentų bankas turi likti collapsible.

## Tema Ir Kūriniai

- Skiltis turi veikti kaip treniruoklis:
  - AI sugeneruoja arba mokinys įveda temą.
  - Mokinys pats pasirenka 2 skirtingus kūrinius.
  - AI patikrina, ar pasirinkimas tinka temai, ir paaiškina kaip naudoti abu kūrinius.
- Pagalbos mygtukas gali pasiūlyti kūrinius, jei mokinys nežino, ką rinktis.

## Mobile UX

- Visos pagrindinės funkcijos turi būti pasiekiamos telefone.
- Apačioje turi būti mobile nav ir „Daugiau“ meniu.
- „Tema ir kūriniai“, „Kortelės / žaidimai“, „Rašyti“, „Kūriniai“, „Špargalkė“ neturi būti paslėpti taip, kad mokinys jų nerastų.

## Quiz / Kortelės

- Kortelės turi padėti prisiminti kūrinio pagrindinę mintį, temas, argumentų kryptis ir dažną klaidą.
- Quiz po užskaitymo gali sugeneruoti naują AI quiz tokio pat pobūdžio.
- Jei AI quiz generavimas nepavyksta, statinis quiz turi likti veikiantis.

## Techninės Taisyklės

- `OPENAI_API_KEY` laikyti tik `.env.local` lokaliai arba Render Environment Variables.
- `.env.local` negalima kelti į GitHub.
- Prieš push į GitHub paleisti:
  - `npm run lint`
  - `npm run build`
- Push komandos:
  - `git status`
  - `git add .`
  - `git commit -m "..."`
  - `git push`
