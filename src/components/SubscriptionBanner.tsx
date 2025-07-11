import { X } from "lucide-react";
import React, { useState } from "react";

interface Props {
  active: boolean;
  daysLeft: number;
  onRenew?: () => void;
}

export const SubscriptionBanner: React.FC<Props> = ({ active, daysLeft, onRenew }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  if (active && daysLeft > 3) return null;

  let message = "";
  let showRenew = false;
  if (!active) {
    message = "Tu suscripción ha vencido. Por favor, renueva para seguir usando el sistema.";
    showRenew = true;
  } else if (daysLeft <= 3) {
    message = `¡Atención! Tu suscripción vence en ${daysLeft} día${daysLeft === 1 ? "" : "s"}.`;
    showRenew = true;
  }

  return (
    <div
      style={{
        background: "#ff9800",
        color: "#fff",
        padding: "6px",
        textAlign: "center",
        zIndex: 1000,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
      }}
    >
      <span className="text-sm font-medium">{message}</span>
      {showRenew && onRenew && (
        <>
          <a
            className="text-white hover:underline cursor-pointer text-sm font-medium mx-2"
            onClick={onRenew}
            role="button"
            tabIndex={0}
          >
            Renovar suscripción
          </a>
          <button
            onClick={() => setVisible(false)}
            className="text-white hover:text-white focus:outline-none"
            aria-label="Cerrar banner"
            style={{ background: "transparent", border: 0, padding: 0 }}
          >
            <X size={18} />
          </button>
        </>
      )}
    </div>
  );
};

export default SubscriptionBanner; 