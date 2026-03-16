import { Mail, MapPin, Phone } from "lucide-react";

const contactCards = [
  {
    title: "Téléphone",
    icon: Phone,
    description: "+212 6XX XXX XXX",
    href: "tel:+2126XXXXXXX",
  },
  {
    title: "Email",
    icon: Mail,
    description: "contact@marrakechauto.ma",
    href: "mailto:contact@marrakechauto.ma",
  },
  {
    title: "Adresse",
    icon: MapPin,
    description: "Guéliz, Marrakech",
    href: "https://www.google.com/maps/place/Marrakech/",
    target: "_blank",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Contactez-nous
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Retrouvez rapidement nos coordonnées et contactez-nous par téléphone, email ou en venant nous voir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.title}
                href={card.href}
                target={card.target}
                rel={card.target === "_blank" ? "noreferrer" : undefined}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-foreground">{card.title}</p>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">Cliquez pour utiliser.</p>
              </a>
            );
          })}
        </div>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p className="mb-1">Horaires d'ouverture : Lun - Sam 08h00 - 20h00, Dim 09h00 - 18h00</p>
          <p>Nous sommes à votre écoute pour toute question ou réservation.</p>
        </div>
      </div>
    </section>
  );
}
