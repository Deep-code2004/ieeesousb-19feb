import { useEffect, useRef, useState } from "react";

export default function InitialLoader() {
    const [phase, setPhase] = useState<"visible" | "fading" | "done">("visible");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // After 1.5s start fading
        timerRef.current = setTimeout(() => {
            setPhase("fading");
            // After fade (600ms) remove from DOM
            timerRef.current = setTimeout(() => {
                setPhase("done");
            }, 600);
        }, 1500);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []); // runs exactly once — no theme dependency

    if (phase === "done") return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                opacity: phase === "fading" ? 0 : 1,
                transition: "opacity 600ms ease-in-out",
                pointerEvents: phase === "fading" ? "none" : "auto",
            }}
        >
            {/* Logo — light-mode version works on white bg */}
            <img
                src="http://ieee.socet.edu.in/wp-content/uploads/2025/09/N_Wedge-removebg-preview.png"
                alt="IEEE SOU SB"
                style={{ height: "72px", width: "auto", objectFit: "contain", marginBottom: "32px" }}
            />

            {/* Three bouncing dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        style={{
                            display: "block",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: "#0057b8",
                            animation: "loaderBounce 1s ease-in-out infinite",
                            animationDelay: `${i * 0.18}s`,
                        }}
                    />
                ))}
            </div>

            {/* Label */}
            <p
                style={{
                    marginTop: "20px",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#6b7280",
                }}
            >
                IEEE Silver Oak University SB
            </p>

            <style>{`
        @keyframes loaderBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40%            { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
