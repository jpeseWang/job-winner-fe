import Image from "next/image"

export default function CompanyLogos() {
  const logos = [
    { name: "Zoom", src: "/logos/zoom.png", width: 120 },
    { name: "Tinder", src: "/logos/tinder.png", width: 120 },
    { name: "Dribbble", src: "/logos/dribbble.png", width: 120 },
    { name: "Asana", src: "/logos/asana.png", width: 120 },
  ]

  return (
    <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 opacity-70">
      {logos.map((logo) => (
        <div key={logo.name} className="flex items-center justify-center">
          <Image
            src={logo.src || "/placeholder.svg"}
            alt={`${logo.name} logo`}
            width={logo.width}
            height={40}
            className="h-8 w-auto object-contain grayscale"
          />
        </div>
      ))}
    </div>
  )
}
