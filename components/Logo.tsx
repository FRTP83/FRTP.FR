import Image from "next/image";

type LogoProps = {
  variant?: "color" | "white";
  className?: string;
};

export function Logo({ variant = "color", className = "" }: LogoProps) {
  return (
    <Image
      src={variant === "white" ? "/brand/frtp-logo-white.png" : "/brand/frtp-logo.png"}
      alt="FRTP"
      width={420}
      height={160}
      className={className}
      priority
    />
  );
}
