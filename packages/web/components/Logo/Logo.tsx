interface LogoProps {
  size?: number;
}

const Logo = ({ size = 40 }: LogoProps) => {
  return (
    <svg
      id="a"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size / 1.780487804878049}
      viewBox="0 0 73 41"
    >
      <path
        d="m1.62,12.46L37.36,1.54c.08-.02.16.02.2.09l4.88,11.72c.03.08,0,.18-.09.21l-27.13,11.63c-.16.07-.11.31.06.31h29.39c.1,0,.17.08.16.18l-1.33,13.68c0,.08-.08.15-.16.15H3.85c-.08,0-.15-.06-.16-.15L1.51,12.63c0-.08.04-.15.11-.17Z"
        fill="#fff"
        fillOpacity={0}
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="2"
      />
      <g>
        <line x1="54.5" y1="9.5" x2="66.5" y2="3.5" fill="currentColor" />
        <rect
          x="53.79"
          y="5"
          width="13.42"
          height="3"
          rx=".68"
          ry=".68"
          transform="translate(3.48 27.74) rotate(-26.57)"
          fill={"currentColor"}
        />
      </g>
      <g>
        <line x1="60.5" y1="18.18" x2="72.5" y2="16.5" fill="currentColor" />
        <rect
          x="60.44"
          y="15.84"
          width="12.12"
          height="3"
          rx=".66"
          ry=".66"
          transform="translate(-1.76 9.39) rotate(-7.97)"
          fill={"currentColor"}
        />
      </g>
      <g>
        <line x1="58.5" y1="25.5" x2="69.5" y2="28.5" fill="currentColor" />
        <rect
          x="62.5"
          y="21.3"
          width="3"
          height="11.4"
          rx=".68"
          ry=".68"
          transform="translate(21.11 81.64) rotate(-74.74)"
          fill={"currentColor"}
        />
      </g>
      <g>
        <line x1="56.5" y1="32.5" x2="67.76" y2="39.5" fill="currentColor" />
        <rect
          x="60.63"
          y="29.37"
          width="3"
          height="13.26"
          rx=".68"
          ry=".68"
          transform="translate(-1.25 69.75) rotate(-58.13)"
          fill={"currentColor"}
        />
      </g>
    </svg>
  );
};

export default Logo;
