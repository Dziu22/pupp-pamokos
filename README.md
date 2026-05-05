# PUPP Pamokos

Moderni lietuviška web aplikacija 10 klasės PUPP samprotavimo rašinio pasiruošimui. Ji turi kūrinių banką, AI temų ir kūrinių parinkimą, rašinio editorių, AI pagalbą, mini testus, progresą, paskutinės dienos režimą ir vieno lapo špargalkę.

## Paleidimas

```bash
npm install
npm run dev
```

Aplikacija veiks adresu [http://localhost:3000](http://localhost:3000).

## OpenAI API

1. Nukopijuok `.env.example` į `.env.local`.
2. Įrašyk raktą:

```bash
OPENAI_API_KEY=sk-...
```

AI kvietimai vyksta tik per server-side route `app/api/ai/route.ts`. Frontend'e API raktas niekada nenaudojamas. Rašinio tikrinimo promptas remiasi PUPP rašymo ir teksto kūrimo vertinimo kriterijais: turinys 10 taškų, struktūra ir kalbinė raiška 8 taškai, raštingumas 12 taškų. Be `OPENAI_API_KEY` AI funkcijos neveiks.

## Struktūra

- `app/data/works.ts` - kūrinių duomenys, temos ir argumentų kryptys.
- `app/lib/ai-config.ts` - vienoje vietoje laikomas AI modelio config.
- `app/api/ai/route.ts` - serverinis OpenAI API maršrutas.
- `app/page.tsx` - pagrindinė responsive aplikacija.
- `components/ui/*` - shadcn/ui stiliaus komponentai.

## Saugumas

Mokinio tekstas siunčiamas į OpenAI tik tada, kai vartotojas pats paspaudžia AI veiksmų mygtuką. Puslapyje rodoma pastaba: „AI gali klysti, faktus visada pasitikrink.“
