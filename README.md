# Pathan Mastan Khan — 3D Talent Profile

This is your casting site rebuilt in the same tech as the 3D reference
site you sent (React + Vite + Three.js / react-three-fiber): a real,
interactive 3D computer model in the hero section, an animated starfield
background, and scroll-triggered motion on every section — with your
stats, contact-sheet photo gallery, and admin-only upload/delete carried
over exactly as they worked before.

## Folder tree

```
pmk-3d-portfolio/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── postcss.config.cjs
├── .gitignore
├── README.md
├── public/
│   └── desktop_pc/            ← the 3D computer model (gltf + textures)
│       ├── scene.gltf
│       ├── scene.bin
│       ├── license.txt
│       └── textures/
└── src/
    ├── main.jsx                ← app entry point
    ├── App.jsx                 ← assembles all sections
    ├── index.css                ← fonts, tailwind, sprocket-hole styling
    ├── styles.js                ← shared text style classes
    ├── config.js                 ← Cloudinary / JSONBin / admin passcode
    ├── assets/
    │   ├── index.js
    │   ├── menu.svg
    │   └── close.svg
    ├── components/
    │   ├── index.js
    │   ├── Navbar.jsx            ← P.M.K. refresh button, admin banner
    │   ├── Hero.jsx               ← 3D computer + your name
    │   ├── Stats.jsx              ← height/weight/contact cards
    │   ├── Gallery.jsx            ← contact-sheet grid, upload, delete
    │   ├── Lightbox.jsx           ← photo viewer with prev/next
    │   ├── Contact.jsx            ← call sheet / booking section
    │   ├── Footer.jsx
    │   ├── Loader.jsx             ← 3D model loading spinner
    │   └── canvas/
    │       ├── index.js
    │       ├── Computers.jsx      ← the 3D desktop PC model
    │       └── Stars.jsx          ← animated starfield background
    ├── hooks/
    │   ├── useAdmin.js            ← admin passcode unlock logic
    │   └── useGallery.js          ← Cloudinary upload + JSONBin sync
    ├── hoc/
    │   ├── index.js
    │   └── SectionWrapper.jsx     ← scroll-in animation wrapper
    ├── utils/
    │   └── motion.js              ← animation variants
    └── constants/
        └── index.js               ← your name, stats, contact info
```

## What's carried over from your previous site
- Cloudinary + JSONBin are already filled in with your existing values
- Your admin passcode (`uploadpicsNew`) still works the same way:
  visit `yoursite.vercel.app/?admin=uploadpicsNew` once to unlock uploads
- Delete button, "How to upload" steps, admin banner, next/prev photo
  viewer — all included

## How to put this on GitHub + Vercel

1. Create a new (empty) repository on GitHub.
2. Upload **everything in this folder**, keeping the exact same structure
   (the `public/` and `src/` folders need to stay where they are).
3. Go to https://vercel.com/new and import that repository.
4. Vercel will auto-detect this as a **Vite** project — leave all settings
   on default and click **Deploy**.
   (Unlike your previous single-file site, this one needs a real build
   step, which Vercel handles automatically — you don't need to do
   anything extra.)
5. After a minute or two you'll get your live link.

## Editing your info later
- Stats, contact info, name → `src/constants/index.js`
- Cloudinary/JSONBin/admin passcode → `src/config.js`
- Colors → `tailwind.config.cjs`
