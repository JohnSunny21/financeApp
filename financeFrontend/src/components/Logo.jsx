const Logo = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* <!-- Blue Upward Trend Line --> */}
    <path
      d="M15 80 L35 60 L55 70 L75 40 L85 50"
      stroke="#3498db"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* <!-- Yellow "Insight" Spark/Star at the peak --> */}
    <g transform="translate(75, 40)">
      <path
        d="M0 -12 L2.3 -2.3 L12 0 L2.3 2.3 L0 12 L-2.3 2.3 L-12 0 L-2.3 -2.3 Z"
        fill="#f1c40f"
      />
    </g>
  </svg>
);

export default Logo;
