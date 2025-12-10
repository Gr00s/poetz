# Poetz Kerstboom 2025

Interactieve 3D kerstboom webapplicatie voor Poetz Jeugdmondzorg.

**Type:** Web Application (SPA)
**Tech Stack:** React 19 + TypeScript + Three.js + Vite + Tailwind CSS
**Stage:** Development

---

## Quick Start

```bash
npm install                  # Install dependencies
npm run dev                  # Start dev server (localhost:5173)
npm run build               # Build for production
npm run preview             # Preview production build
```

**Testing:**
- **App:** Browser opent op localhost:5173
- **Camera:** Test handgebaren in Chrome/Edge (camera permissions)
- **Mobile:** Test touch controls op echte devices

---

## Project Structure

```
kerst/
├── CLAUDE.md                 # Dit bestand - project richtlijnen
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── index.html
├── public/
│   └── assets/
│       └── poetz-logo.png    # Poetz logo (upload hier)
└── src/
    ├── main.tsx              # React entry point
    ├── App.tsx               # Hoofdcomponent
    ├── types.ts              # TypeScript types
    ├── components/
    │   ├── Scene.tsx              # 3D scene container (Canvas, camera, lights)
    │   ├── ChristmasTree.tsx      # Alle boom-elementen (dental + kerst items)
    │   ├── TreeTopper.tsx         # Gouden kerstster
    │   ├── Snowfall.tsx           # Sneeuwval effect
    │   ├── Starfield.tsx          # Sterrenhemel achtergrond
    │   ├── ControlPanel.tsx       # Bedieningspaneel (linksboven)
    │   ├── ChristmasWish.tsx      # Interactieve kerstwens (bovenaan)
    │   ├── Logo.tsx               # Poetz logo (linksonder)
    │   └── HandOverlay.tsx        # Hand tracking overlay (rechtsonder)
    ├── hooks/
    │   ├── useHandTracking.ts     # MediaPipe hand gesture recognition
    │   └── useAutoRotate.ts       # Auto-rotatie logica
    └── styles/
        └── index.css              # Tailwind + custom styles
```

---

## 🎨 POETZ HUISSTIJL - VERPLICHT

### Primaire Kleuren (altijd gebruiken)

```css
/* Poetz Brand Colors */
--poetz-blauw: #007BA4;      /* Hoofdkleur - UI elementen, accenten */
--poetz-oranje: #E85127;     /* Accent - knoppen, highlights, CTA */
--poetz-zeegroen: #24B1A0;   /* Secundair - variatie, accenten */
```

### Kerstkleuren (aanvullend)

```css
/* Christmas Palette */
--kerst-goud: #FFD700;       /* Ster, ballen, glitter */
--kerst-zilver: #C0C0C0;     /* Ballen, accenten */
--kerst-warmwit: #FFF8E7;    /* Lichtjes, gloed */
--kerst-rood: #C41E3A;       /* Traditionele ballen */
--kerst-groen: #228B22;      /* Dennegroen elementen */
```

### Achtergrond

```css
--bg-night: #0a1628;         /* Donker nachtblauw - hoofdachtergrond */
```

### Typografie

```css
/* Primair font */
font-family: 'Arial Rounded MT Bold', 'Nunito', 'Quicksand', sans-serif;

/* Kerstwens */
font-size: clamp(1.5rem, 4vw, 3rem);
color: white;
text-shadow: 0 0 20px #FFD700, 0 0 40px #FFD700;
```

---

## 🎄 FUNCTIONELE SPECIFICATIES

### 1. Kerstboom Compositie

**Mix van items (totaal MAX 350 particles):**

| Type | Percentage | Voorbeelden |
|------|------------|-------------|
| Tandheelkundig | 50-60% | Tandenborstels, kiezen, tandpasta, floss, beugels |
| Traditioneel kerst | 40-50% | Kerstballen, lichtjes, cadeautjes, sterretjes |

**Boomvorm:**
- Hoogte: 16 units
- Basis radius: 5.5 units
- Vorm: Kegel

**Kleuren tandheelkundige items:** Poetz blauw, oranje, zeegroen
**Kleuren kerst items:** Goud, zilver, rood, warmwit

### 2. Boom-topper: Klassieke Kerstster

- 5-puntige ster in GOUD
- Glanzend metallic materiaal
- Pulserend licht vanuit midden
- Gouden halo/gloed
- Sparkles: MAX 30 particles
- Langzame rotatie

### 3. Display Modes

| Mode | Beschrijving |
|------|--------------|
| FORMED | Boom intact, items vormen kerstboom |
| CHAOS | Items vliegen uiteen in sferisch volume |

**Transitie:** Smooth lerp interpolatie (factor ~2.5)

### 4. Interactie Systeem

#### A) ZONDER Camera (default/fallback)
- Boom draait AUTOMATISCH (0.3-0.5 rad/s)
- Touch/muis kan handmatig roteren
- Na loslaten: auto-rotatie hervat na 3 sec
- Mode switch alleen via button

#### B) MET Camera + Handgebaren

| Gebaar | Actie |
|--------|-------|
| POINTING (wijsvinger) | Horizontale beweging = boom draait mee |
| OPEN HAND (gespreid) | → CHAOS/EXPLODE mode |
| PINCH (duim+wijsvinger) | → FORMED mode |
| FIST (vuist) | → FORMED mode |

- Camera feed: 320x240 @ 15fps MAX
- Geen hand 5 sec → auto-rotatie hervat

#### C) Touch/Muis (ALTIJD actief)
- Drag = roteer camera
- Pinch = zoom
- Werkt als backup naast handgebaren

### 5. Kerstwens (Interactief)

**Tekst:** "Wij wensen u prettige kerstdagen en een stralend 2026!"

**Positie:** Bovenaan, gecentreerd

**Interactie bij klik:**
1. Letters exploderen in particles
2. Mix: sneeuwvlokjes (40%) + tandjes (30%) + sterretjes (30%)
3. Particles dwarrelen naar beneden
4. Tekst fade terug in na 2-3 sec
5. Herhaalbaar

**Particles bij explosie:** MAX 80

### 6. UI Layout

```
┌─────────────────────────────────────────────────┐
│  [Control]     "Wij wensen u prettige..."       │
│  [Panel]              (kerstwens)               │
│                                                 │
│                    🎄                           │
│                 KERSTBOOM                       │
│                  (3D scene)                     │
│                                                 │
│  [Poetz Logo]                    [Hand Overlay] │
│  (linksonder)                    (rechtsonder)  │
└─────────────────────────────────────────────────┘
```

**Control Panel (linksboven):**
- Klein, semi-transparant
- Toggle: Handgebaren aan/uit
- Button: Explode/Vorm

**Hand Overlay (rechtsonder):**
- MAX 160x200px
- Semi-transparant (opacity 0.6)
- Alleen zichtbaar als handgebaren aan
- Toont camera feed + hand skeleton

**Logo (linksonder):**
- 120-150px breed
- Witte drop-shadow

---

## ⚡ PERFORMANCE & GEHEUGEN - HARDE LIMIETEN

### Particle Limieten (NIET OVERSCHRIJDEN)

| Element | Maximum |
|---------|---------|
| Boom items totaal | 350 |
| Sneeuwvlokken | 100 |
| Sterren achtergrond | 1500 |
| Ster sparkles | 30 |
| Tekst explosie particles | 80 |

### Geometry & Materials

```typescript
// ✅ VERPLICHT
- BufferGeometry (NOOIT legacy Geometry)
- InstancedMesh voor alle herhalende objecten
- Low-poly: max 50-100 vertices per item
- Hergebruik materials (max 10-15 unieke)
- MeshBasicMaterial of MeshLambertMaterial preferred
- MeshStandardMaterial spaarzaam (performance cost)
```

### Textures

- Max resolutie: 512x512px
- Formaat: WebP of compressed PNG
- Gebruik vertex colors waar mogelijk

### Memory Management

```typescript
// ✅ VERPLICHT - Cleanup bij unmount
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
    texture?.dispose();
  };
}, []);
```

### Camera Feed

- Resolutie: 320x240 MAX
- Framerate: 15fps MAX
- Stop stream wanneer handgebaren uit

### Post-Processing

- Bloom: halve resolutie (0.5)
- Max 2 effecten totaal (Bloom + Vignette)

### Mobile Optimalisatie

Detecteer mobile/low-end en pas aan:

| Element | Desktop | Mobile |
|---------|---------|--------|
| Boom items | 350 | 175 |
| Sneeuwvlokken | 100 | 50 |
| Sterren | 1500 | 750 |
| Post-processing | Aan | Uit |
| Camera feed | 320x240 | 240x180 |

### Target Metrics

- Bundle size: < 5MB
- Runtime memory: < 150MB
- Desktop: 60fps
- Mobile: 30fps minimum

---

## 🚨 VERPLICHTE WORKFLOW

### Nooit Beginnen Zonder Goedkeuring

**ALTIJD dit proces volgen:**

1. **Lees bestaande code eerst**
   - Gebruik bestandsverkenning om patronen te begrijpen
   - Check vergelijkbare componenten

2. **Schrijf plan**
   - Wat ga je bouwen/wijzigen?
   - Welke bestanden worden geraakt?

3. **Vraag expliciete goedkeuring**
   - Wacht op "ja" of "ga door"
   - Begin NOOIT zonder bevestiging

4. **Voer simpel uit**
   - Minimale wijzigingen
   - Volg bestaande patronen

5. **Test**
   - Check browser console voor errors
   - Test op mobile
   - Check performance

---

## 🔧 CODE RICHTLIJNEN

### Three.js / React Three Fiber

```typescript
// ✅ GOED - InstancedMesh voor herhalende objecten
<instancedMesh ref={meshRef} args={[geometry, material, count]}>
  
// ✅ GOED - useFrame voor animaties
useFrame((state, delta) => {
  meshRef.current.rotation.y += delta * 0.5;
});

// ✅ GOED - Cleanup
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);

// ❌ SLECHT - Nieuwe objecten in render loop
useFrame(() => {
  const newMaterial = new MeshBasicMaterial(); // MEMORY LEAK!
});
```

### React Patterns

```typescript
// ✅ GOED - Memoize zware berekeningen
const positions = useMemo(() => generatePositions(count), [count]);

// ✅ GOED - Stabiele referenties
const handleClick = useCallback(() => {
  setMode(prev => prev === 'formed' ? 'chaos' : 'formed');
}, []);

// ❌ SLECHT - Inline functies in render
<Button onClick={() => setMode('chaos')} /> // Re-creates every render
```

### Styling

```typescript
// ✅ GOED - Tailwind classes
<div className="absolute bottom-4 left-4 bg-[#007BA4]/80 backdrop-blur-sm rounded-xl p-4">

// ✅ GOED - CSS variabelen voor huisstijl kleuren
<div style={{ color: 'var(--poetz-oranje)' }}>

// ❌ SLECHT - Hardcoded kleuren
<div style={{ color: '#E85127' }}> // Gebruik variabelen!
```

### MediaPipe Integration

```typescript
// ✅ GOED - Proper cleanup
useEffect(() => {
  const hands = new Hands({ ... });
  
  return () => {
    hands.close();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, []);

// ✅ GOED - Debounce gesture detection
const debouncedGesture = useMemo(
  () => debounce(handleGesture, 100),
  []
);
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.170.0",
    "@react-three/fiber": "^9.0.0",
    "@react-three/drei": "^9.0.0",
    "@react-three/postprocessing": "^3.0.0",
    "@mediapipe/hands": "^0.4.0",
    "@mediapipe/camera_utils": "^0.3.0",
    "@mediapipe/drawing_utils": "^0.3.0",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "@types/react": "^19.0.0",
    "@types/three": "^0.170.0"
  }
}
```

---

## 🛠️ Troubleshooting

### Three.js / WebGL Issues

```bash
# Check WebGL support
# Open browser console:
console.log(renderer.capabilities);

# Common fixes:
- Reduce particle count
- Disable post-processing
- Check for geometry.dispose() calls
```

### MediaPipe Issues

```bash
# Camera niet beschikbaar
- Check HTTPS (required for camera)
- Check browser permissions
- Try different browser (Chrome/Edge best)

# Hand detection traag
- Reduce camera resolution
- Lower FPS (15 max)
- Check CPU usage
```

### Performance Issues

```bash
# Check memory leaks
- Chrome DevTools → Memory tab → Heap snapshot
- Look for detached DOM elements
- Check Three.js objects niet disposed

# Check FPS
- Chrome DevTools → Rendering → FPS meter
- React DevTools → Profiler
```

### Common Problems

| Probleem | Oplossing |
|----------|-----------|
| Wit scherm | Check console errors, WebGL support |
| Laggy animaties | Reduce particle count, disable bloom |
| Camera werkt niet | Check HTTPS, permissions, browser |
| Memory groeit | Add dispose() calls, check useEffect cleanup |
| Mobile crash | Enable mobile optimizations, reduce all counts |

---

## ✅ CODE REVIEW CHECKLIST

**Bij elke wijziging, check:**

### Performance
- [ ] Particle counts binnen limieten?
- [ ] InstancedMesh gebruikt voor herhalende objecten?
- [ ] Geen nieuwe objecten in useFrame/render loop?
- [ ] dispose() calls in cleanup?
- [ ] useMemo/useCallback waar nodig?

### Three.js
- [ ] BufferGeometry (niet legacy)?
- [ ] Materials hergebruikt?
- [ ] Textures < 512x512?
- [ ] Post-processing beperkt?

### Huisstijl
- [ ] Poetz kleuren correct gebruikt?
- [ ] Logo zichtbaar en correct geplaatst?
- [ ] Kerstwens tekst correct?
- [ ] Fonts correct (Arial Rounded MT Bold)?

### UX
- [ ] Werkt zonder camera (auto-rotate)?
- [ ] Touch controls werken?
- [ ] Responsive op mobile?
- [ ] Hand overlay niet te prominent?

### Code Quality
- [ ] TypeScript types correct?
- [ ] Geen console.log in production?
- [ ] Error handling aanwezig?
- [ ] Cleanup in useEffect?

---

## 🎯 Samenvatting

### Kernprincipes
1. **Performance first** - Respecteer alle limieten
2. **Huisstijl** - Poetz kleuren altijd gebruiken
3. **Fallback** - Werkt ALTIJD, ook zonder camera
4. **Mobile friendly** - Test op echte devices
5. **Clean code** - Dispose, cleanup, TypeScript

### Key Files
- **Styling?** → Check Poetz kleuren bovenaan
- **3D?** → Scene.tsx, ChristmasTree.tsx
- **Interactie?** → useHandTracking.ts
- **UI?** → ControlPanel.tsx, ChristmasWish.tsx

### Bij Twijfel
- **Performance issue?** → Reduce particle counts first
- **Styling?** → Gebruik Poetz CSS variabelen
- **Camera issue?** → Check permissions, HTTPS
- **Workflow?** → Lees → Plan → Goedkeuring → Bouw

---

**Vrolijk Kerstfeest van Poetz Jeugdmondzorg! 🎄🦷**
