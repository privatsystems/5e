export default function ScrollBox({ children }: { children: React.ReactNode }) {
    return (
        <div className="scroll-box">
            {/* Filtres en fondu */}
            <div className="fade-overlay fade-top" />
            <div className="fade-overlay fade-bottom" />

            {/* Conteneur scrollable */}
            <div className="scroll-container index-navigation-names">
                <div className="index-navigation-names-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}