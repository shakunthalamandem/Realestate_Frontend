import asset72Logo from "@/assets/asset72-logo.svg";

type BrandLogoProps = {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  compact?: boolean;
  inverted?: boolean;
};

const BrandLogo = ({
  className = "",
  iconClassName = "",
  compact = false,
}: BrandLogoProps) => {
  const sizeClass = compact
    ? "h-[8rem] w-auto max-w-[45rem]"
    : "h-[9.5rem] w-auto max-w-[47rem]";

  return (
    <div className={`flex items-center justify-center self-center leading-none ${className}`.trim()}>
      <img
        src={asset72Logo}
        alt="Asset72"
        title="Analyze in Minutes. Act with Conviction"
        className={`${sizeClass} block shrink-0 object-contain align-middle ${iconClassName}`.trim()}
      />
    </div>
  );
};

export default BrandLogo;
