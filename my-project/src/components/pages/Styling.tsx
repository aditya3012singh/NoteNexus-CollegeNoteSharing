import { NavbarDemo } from "../NavBar";
import { GridScan } from "../ui/GridScan";
import LogoLoop from "../ui/LogoLoop";
import TextType from "../ui/TextType";


import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';



const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

// Alternative with image sources
const imageLogos = [
  { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
  { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];

export function Styling() {
  return (
    <div>
      <NavbarDemo/>
      <div style={{ width: '100%', height: '600px', position: 'relative' }} className="bg-black">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="rgba(9, 6, 15, 0.23)"
          gridScale={0.06}
          scanColor="rgba(26, 65, 158, 1)"
          scanOpacity={0.6}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          textAlign: 'center',
          width: '100%'
        }}>
          
          <TextType 
            text="Welcome to NoteNexus" 
            className="text-6xl font-bold text-white"
            typingSpeed={100}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />

        </div>
      </div>
      <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
        <LogoLoop
          logos={techLogos}
          speed={130}
          direction="left"
          logoHeight={48}
        />
      </div>
      
    </div>
  );
}

