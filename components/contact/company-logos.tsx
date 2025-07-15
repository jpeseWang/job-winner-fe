import Image from "next/image";

export default function CompanyLogos() {
  const logos = [
    { name: "Zoom", src: "/logo/Zoom-Logo.jpg", width: 500 },
    { name: "Tinder", src: "/logo/tinder_logo.png", width: 500 },
    { name: "Dribbble", src: "/logo/dribbble_logo.png", width: 500 },
    { name: "Asana", src: "/logo/asana.webp", width: 500 },
  ];

  return (
    <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 opacity-70">
      {logos.map((logo) => (
        <div key={logo.name} className="flex items-center justify-center">
          <Image
            src={logo.src || "/placeholder.svg"}
            alt={`${logo.name} logo`}
            width={logo.width}
            height={80}
            className="h-20 w-auto object-contain grayscale"
          />
        </div>
      ))}
    </div>
  );
}
