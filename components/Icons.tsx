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
