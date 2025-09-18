"use client";

import { useEffect, useState } from "react";

type Props = {
  /** E.164 without +, e.g. 923001234567 */
  phone: string;
};

export default function WhatsAppButton({ phone }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const msg = encodeURIComponent(
    "Hi! I just visited your website and I have a few queries related to your art."
  );

  const href = `https://wa.me/${phone}?text=${msg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className={`whatsapp-float ${show ? "is-visible" : ""}`}
    >
      {/* Font Awesome WhatsApp icon */}
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
