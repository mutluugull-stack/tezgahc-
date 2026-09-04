import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(children: React.ReactNode, props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) =>
  base(
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9v-6h6v6h2.5a1 1 0 0 0 1-1v-9" />
    </>,
    p
  );

export const PlusIcon = (p: IconProps) =>
  base(
    <>
      <path d="M12 5v14M5 12h14" />
    </>,
    p
  );

export const UserIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.8 4.4-6 7.5-6s6.1 2.2 7.5 6" />
    </>,
    p
  );

export const BackIcon = (p: IconProps) =>
  base(
    <>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </>,
    p
  );

export const CloseIcon = (p: IconProps) =>
  base(
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>,
    p
  );

export const TruckIcon = (p: IconProps) =>
  base(
    <>
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </>,
    p
  );

export const WrenchIcon = (p: IconProps) =>
  base(
    <>
      <path d="M14.5 6.5a4 4 0 0 0-5.4 4.9L3 17.5 5.5 20l6.1-6.1a4 4 0 0 0 4.9-5.4l-2.6 2.6-2-2 2.6-2.6z" />
    </>,
    p
  );

export const StarIcon = (p: IconProps) =>
  base(<path d="M12 3.5l2.5 5.4 5.9.6-4.5 4 1.3 5.9-5.2-3.1-5.2 3.1 1.3-5.9-4.5-4 5.9-.6z" />, p);

export const SearchIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </>,
    p
  );

export const ListViewIcon = (p: IconProps) =>
  base(
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.5" cy="6" r="1" />
      <circle cx="3.5" cy="12" r="1" />
      <circle cx="3.5" cy="18" r="1" />
    </>,
    p
  );

export const GridViewIcon = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </>,
    p
  );

export const EyeIcon = (p: IconProps) =>
  base(
    <>
      <path d="M2.3 12S6 5.2 12 5.2 21.7 12 21.7 12 18 18.8 12 18.8 2.3 12 2.3 12Z" />
      <circle cx="12" cy="12" r="3.1" />
    </>,
    p
  );

export const ChevronLeftIcon = (p: IconProps) => base(<path d="M15 5l-7 7 7 7" />, p);
export const ChevronRightIcon = (p: IconProps) => base(<path d="M9 5l7 7-7 7" />, p);

export const HandshakeIcon = ({ className }: { className?: string }) => (
  <span className={className} role="img" aria-hidden="true" style={{ fontSize: "1em" }}>
    🤝
  </span>
);

export const MachineIcons: Record<string, (p: IconProps) => JSX.Element> = {
  torna: (p) =>
    base(
      <>
        <rect x="3" y="9" width="7" height="6" rx="1" />
        <circle cx="14" cy="12" r="5" />
        <circle cx="14" cy="12" r="1.6" />
      </>,
      p
    ),
  freze: (p) =>
    base(
      <>
        <rect x="4" y="4" width="16" height="12" rx="1" />
        <path d="M9 16v4M15 16v4M7 20h10" />
        <path d="M12 8v4" />
      </>,
      p
    ),
  router: (p) =>
    base(
      <>
        <rect x="3" y="14" width="18" height="6" rx="1" />
        <path d="M8 14V7l4-3 4 3v7" />
      </>,
      p
    ),
  lazer: (p) =>
    base(
      <>
        <path d="M4 20l6-6M12 4l8 8" />
        <path d="M9 15l1.5 1.5M13.5 6.5 15 8" />
        <circle cx="17" cy="5" r="2" />
      </>,
      p
    ),
  plazma: (p) =>
    base(
      <>
        <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
      </>,
      p
    ),
  edm: (p) =>
    base(
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </>,
      p
    ),
  abkant: (p) =>
    base(
      <>
        <path d="M3 8h18M3 8l3 8h12l3-8" />
        <path d="M9 16v3M15 16v3" />
      </>,
      p
    ),
  yag: (p) =>
    base(
      <>
        <path d="M12 3.5c-3.2 4-6 7.6-6 10.8a6 6 0 0 0 12 0c0-3.2-2.8-6.8-6-10.8Z" />
        <path d="M9 14.3c0 1.5 1.2 2.7 3 2.7" />
      </>,
      p
    ),
  aparat: (p) =>
    base(
      <>
        <path d="M7 4v16" />
        <path d="M7 6h6M7 18h6" />
        <path d="M13 6v3M13 18v-3" />
        <path d="M17 9.5v5" />
      </>,
      p
    ),
  divizor: (p) =>
    base(
      <>
        <circle cx="10" cy="12" r="7" />
        <path d="M10 5v2M10 17v2M3 12h2M15 12h2M5.4 6.4l1.4 1.4M13.2 16.2l1.4 1.4M5.4 17.6l1.4-1.4M13.2 7.8l1.4-1.4" />
        <path d="M17 12h4M19 10.5v3" />
      </>,
      p
    ),
  "yedek-parca": (p) =>
    base(
      <>
        <path d="M12 3.5 19 8v8l-7 4.5-7-4.5V8Z" />
        <circle cx="12" cy="12" r="3" />
      </>,
      p
    ),
  diger: (p) =>
    base(
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>,
      p
    ),
};

export function CategoryIcon({ category, ...props }: { category: string } & IconProps) {
  const Cmp = MachineIcons[category] || MachineIcons.diger;
  return <Cmp {...props} />;
}

export const UsersIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 20c1.2-3.6 3.6-5.6 6.2-5.6s5 2 6.2 5.6" />
      <path d="M15.5 5.3a3.2 3.2 0 0 1 0 6.2" />
      <path d="M17.5 14.6c2.2.5 3.8 2.3 4.7 5.4" />
    </>,
    p
  );

export const BuildingIcon = (p: IconProps) =>
  base(
    <>
      <rect x="4" y="3" width="11" height="18" rx="1" />
      <path d="M15 21h5V9l-5-3" />
      <path d="M7.5 7h2M7.5 10.5h2M7.5 14h2M7.5 17.5h2" />
    </>,
    p
  );

export const TagIcon = (p: IconProps) =>
  base(
    <>
      <path d="M12.5 3H5a2 2 0 0 0-2 2v7.5a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l6.5-6.5a2 2 0 0 0 0-2.8l-9-9a2 2 0 0 0-1.4-.6Z" />
      <circle cx="8" cy="8" r="1.3" />
    </>,
    p
  );

export const ChatIcon = (p: IconProps) =>
  base(
    <>
      <path d="M3.5 5.5h17v10.5h-9.5L6.5 20v-4H3.5Z" />
    </>,
    p
  );

export const ChartIcon = (p: IconProps) =>
  base(
    <>
      <path d="M4 20V10M11 20V4M18 20v-7" />
      <path d="M2.5 20h19" />
    </>,
    p
  );

export const GearIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M17.6 6.4l-1.7 1.7M8.1 15.9l-1.7 1.7M17.6 17.6l-1.7-1.7M8.1 8.1 6.4 6.4" />
    </>,
    p
  );

export const IdCardIcon = (p: IconProps) =>
  base(
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <circle cx="8" cy="12" r="2.1" />
      <path d="M5.3 16.3c.6-1.5 1.6-2.3 2.7-2.3s2.1.8 2.7 2.3" />
      <path d="M14 9.5h5M14 12.5h5M14 15.5h3" />
    </>,
    p
  );

export const TrashIcon = (p: IconProps) =>
  base(
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4.5h6V7" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>,
    p
  );

export const CheckIcon = (p: IconProps) => base(<path d="M4.5 12.5l5 5 10-11" />, p);

export const MegaphoneIcon = (p: IconProps) =>
  base(
    <>
      <path d="M3 10v4a1.5 1.5 0 0 0 1.5 1.5H6l1.4 5" />
      <path d="M6 10 18 4v16L6 14" />
      <path d="M18 8.5c1.4.7 2.3 2 2.3 3.5s-.9 2.8-2.3 3.5" />
    </>,
    p
  );

export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) =>
  base(
    <path
      d="M12 20.5s-7.5-4.6-9.9-9.3C.6 7.9 2 4.8 5.1 4.1c2-.5 4 .4 5 2.1 1-1.7 3-2.6 5-2.1 3.1.7 4.5 3.8 3 7.1-2.4 4.7-9.9 9.3-9.9 9.3Z"
      fill={filled ? "currentColor" : "none"}
    />,
    p
  );

export const FlagIcon = (p: IconProps) =>
  base(
    <>
      <path d="M5 3v18" />
      <path d="M5 4.5h13l-3 4 3 4H5" />
    </>,
    p
  );

export const LinkIcon = (p: IconProps) =>
  base(
    <>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 12.8 4.7a3.6 3.6 0 0 1 5.1 5.1L16 11.6" />
      <path d="M13 17.5 11.2 19.3a3.6 3.6 0 0 1-5.1-5.1L8 12.4" />
    </>,
    p
  );

export const PhoneIcon = (p: IconProps) =>
  base(
    <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.7c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z" />,
    p
  );
