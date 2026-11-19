// MedNDI wordmark: "Med" in the current text colour, "NDI" on a rounded tag.
const MedNdiLogo = ({ className = "", textColor = "#fff", tagColor = "#fff", accentColor = "#3252DF", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={160}
    height={62}
    viewBox="0 0 160 62"
    fill="none"
    role="img"
    aria-label="MedNDI"
    className={className}
    {...props}
  >
    <text
      x={6}
      y={42}
      fill={textColor}
      fontFamily="Poppins, Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize={28}
      fontWeight={700}
      letterSpacing={-0.5}
    >
      Med
    </text>
    <rect width={72} height={38} x={82} y={12} fill={tagColor} rx={6} />
    <text
      x={118}
      y={42}
      textAnchor="middle"
      fill={accentColor}
      fontFamily="Poppins, Inter, ui-sans-serif, system-ui, sans-serif"
      fontSize={28}
      fontWeight={700}
      letterSpacing={-0.5}
    >
      NDI
    </text>
  </svg>
);

export default MedNdiLogo;
