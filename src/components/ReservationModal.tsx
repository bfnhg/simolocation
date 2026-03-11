import { useState } from "react";
import { Car } from "@/data/cars";
import { X, Calendar, User, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

interface ReservationModalProps {
  car: Car;
  onClose: () => void;
}

const ReservationModal = ({ car, onClose }: ReservationModalProps) => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    dateDebut: "",
    dateFin: "",
    lieuRecuperation: "Aéroport Marrakech Menara",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Réservation confirmée pour ${car.name} !`, {
      description: `Du ${form.dateDebut} au ${form.dateFin}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Réserver</h2>
        <p className="text-primary font-display font-semibold mb-6">
          {car.name} — {car.price} MAD/jour
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                <User className="w-3.5 h-3.5 inline mr-1" /> Nom
              </label>
              <input
                type="text"
                name="nom"
                required
                value={form.nom}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Prénom</label>
              <input
                type="text"
                name="prenom"
                required
                value={form.prenom}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              <Phone className="w-3.5 h-3.5 inline mr-1" /> Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              required
              value={form.telephone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> Date début
              </label>
              <input
                type="date"
                name="dateDebut"
                required
                value={form.dateDebut}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> Date fin
              </label>
              <input
                type="date"
                name="dateFin"
                required
                value={form.dateFin}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              <MapPin className="w-3.5 h-3.5 inline mr-1" /> Lieu de récupération
            </label>
            <select
              name="lieuRecuperation"
              value={form.lieuRecuperation}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option>Aéroport Marrakech Menara</option>
              <option>Gare de Marrakech</option>
              <option>Centre-ville Guéliz</option>
              <option>Hôtel (livraison)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-base hover:opacity-90 transition-opacity mt-2"
          >
            Confirmer la réservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
