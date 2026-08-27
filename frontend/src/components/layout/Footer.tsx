import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-neutral-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              X
            </span>
            X-Pressing
          </div>
          <p className="mt-3 text-sm text-neutral-600">
            Votre linge propre, repassé et livré directement chez vous.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Navigation</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
            <li><Link to="/services" className="hover:text-primary-600">Nos services</Link></li>
            <li><Link to="/tarifs" className="hover:text-primary-600">Nos tarifs</Link></li>
            <li><Link to="/comment-ca-marche" className="hover:text-primary-600">Comment ça marche ?</Link></li>
            <li><Link to="/contact" className="hover:text-primary-600">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Contact</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
            <li>contact@x-pressing.example</li>
            <li>+229 01 00 00 00</li>
            <li>Cotonou, Bénin</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} X-Pressing. Tous droits réservés.
      </div>
    </footer>
  )
}
