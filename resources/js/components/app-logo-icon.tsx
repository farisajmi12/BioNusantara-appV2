interface AppLogoIconProps {
    className?: string;
}

export default function AppLogoIcon({ className = 'h-8 w-8' }: AppLogoIconProps) {
    return (
        <img
            src="/images/logo_bionus.svg"
            alt="BioNusantara"
            className={`${className} object-contain`}
        />
    );
}