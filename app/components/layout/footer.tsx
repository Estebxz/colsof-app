export default function Footer() {
  return (
    <footer className="bg-sidebar/20 border-t border-background">
      <div className="mx-auto flex h-auto w-full max-w-2xl flex-col items-start justify-between gap-2 px-6 py-3 sm:h-12 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="text-sm text-foreground">© 2026 Colsof.</div>
        </div>

        <div className="text-sm text-foreground">
          Construido por{" "}
          <a
            aria-label="Enlace al github de Andres"
            href="https://github.com/Ankoku18"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ring"
          >
            Andres
          </a>
          <span className="px-2">∙</span>
          <a
            aria-label="Enlace al sitio web de Joan Esteban"
            href="https://joanmm.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ring"
          >
            Joan esteban
          </a>
        </div>
      </div>
    </footer>
  );
}