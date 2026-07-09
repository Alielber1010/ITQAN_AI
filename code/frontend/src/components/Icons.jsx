import React from 'react';

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ size = 18, children, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
      {children}
    </svg>
  );
}

export const HomeIcon = (p) => (
  <Svg {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
  </Svg>
);

export const UserIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.2-3.8 4.3-6 7.5-6s6.3 2.2 7.5 6" />
  </Svg>
);

export const TargetIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </Svg>
);

export const ChatIcon = (p) => (
  <Svg {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

export const CrescentIcon = (p) => (
  <Svg {...p}>
    <path d="M15.5 4.5A8 8 0 1 0 19.5 18a9.5 9.5 0 0 1-4-13.5Z" />
  </Svg>
);

export const BookIcon = (p) => (
  <Svg {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
    <path d="M4 5.5v15A2.5 2.5 0 0 1 6.5 18H20" />
  </Svg>
);

export const MailIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 6.5 8 6.5 8-6.5" />
  </Svg>
);

export const ShieldIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6z" />
  </Svg>
);

export const LogOutIcon = (p) => (
  <Svg {...p}>
    <path d="M13 4H6.5a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6.5 20H13" />
    <path d="M16.5 15.5 21 11l-4.5-4.5" />
    <path d="M21 11H9" />
  </Svg>
);

export const GlobeIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5c2.5 2.4 3.9 5.3 3.9 8.5s-1.4 6.1-3.9 8.5c-2.5-2.4-3.9-5.3-3.9-8.5S9.5 5.9 12 3.5Z" />
    <path d="M4 12h16" />
  </Svg>
);

export const PaletteIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a4 4 0 0 0 4-4c0-4.2-3.6-7.2-8-7.2Z" />
    <circle cx="7.5" cy="11" r="1" fill="currentColor" />
    <circle cx="10.5" cy="7.5" r="1" fill="currentColor" />
    <circle cx="15" cy="8" r="1" fill="currentColor" />
  </Svg>
);

export const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.9-3.2 3-5 5.5-5s4.6 1.8 5.5 5" />
    <path d="M15.5 5.5a3 3 0 0 1 0 5.8" />
    <path d="M17 14c1.9.6 3.2 2.2 3.8 5" />
  </Svg>
);

export const ScaleIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3v18" />
    <path d="M7 21h10" />
    <path d="M12 5 5.5 8.5 12 5l6.5 3.5" />
    <path d="M3 8.5h5l-2.5 5A2.6 2.6 0 0 1 3 8.5Z" />
    <path d="M16 8.5h5l-2.5 5a2.6 2.6 0 0 1-2.5-5Z" />
  </Svg>
);

export const ActivityIcon = (p) => (
  <Svg {...p}>
    <path d="M3 12h4l2.5 7L14 5l2.5 7H21" />
  </Svg>
);

export const AlertTriangleIcon = (p) => (
  <Svg {...p}>
    <path d="M12 4 3 20h18Z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
);

export const BanIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m6.2 6.2 11.6 11.6" />
  </Svg>
);

export const BarChartIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20V10" />
    <path d="M12 20V4" />
    <path d="M20 20v-7" />
  </Svg>
);

export const HandCoinsIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.2-3.8 4.3-6 7.5-6s6.3 2.2 7.5 6" />
    <path d="M9.5 8h1.2c.9 0 1.3.5 1.3 1s-.4 1-1.3 1H9.5" />
    <path d="M10 6.5v3" />
  </Svg>
);

export const CheckCircleIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8 12.5 2.6 2.6L16.5 9" />
  </Svg>
);

export const SparklesIcon = (p) => (
  <Svg {...p}>
    <path d="M11 3 12.5 8 18 9.5 12.5 11 11 16.5 9.5 11 4 9.5 9.5 8Z" />
    <path d="M18 15.5 18.8 18l2.5.8-2.5.8-.8 2.4-.8-2.4-2.5-.8 2.5-.8Z" />
  </Svg>
);

export const PencilIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20 4.7 16.3 15.3 5.7a1.8 1.8 0 0 1 2.5 0l1.5 1.5a1.8 1.8 0 0 1 0 2.5L8.7 20.3 4 20Z" />
    <path d="m14 7.5 3.5 3.5" />
  </Svg>
);

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 7h15" />
    <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
    <path d="M6.5 7 7.3 19a2 2 0 0 0 2 1.8h5.4a2 2 0 0 0 2-1.8L17.5 7" />
  </Svg>
);

export const StopIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 8.5h7v7h-7Z" />
  </Svg>
);

export const ScrollIcon = (p) => (
  <Svg {...p}>
    <path d="M6 3.5h9.5A2.5 2.5 0 0 1 18 6v13.5" />
    <path d="M6 3.5a2.5 2.5 0 0 0-2.5 2.5v11a2.5 2.5 0 0 0 2.5 2.5h9.5a2.5 2.5 0 0 0 2.5-2.5" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
  </Svg>
);

export const DiceIcon = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
);

export const MenuIcon = (p) => (
  <Svg {...p}>
    <path d="M4 6.5h16" />
    <path d="M4 12h16" />
    <path d="M4 17.5h16" />
  </Svg>
);
