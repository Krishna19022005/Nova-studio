import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919041665532";

const whatsappMessage =
  "Hello NOVA Flooring Studio, I would like to enquire about your flooring and surface solutions.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  whatsappMessage
)}`;

function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="nova-whatsapp"
      aria-label="Contact NOVA on WhatsApp"
    >
      <MessageCircle
        size={20}
        strokeWidth={1.5}
      />

      <span>WhatsApp</span>
    </a>
  );
}

export default WhatsAppButton;