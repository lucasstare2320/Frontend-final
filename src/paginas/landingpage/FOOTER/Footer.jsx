import "./Footer"

const Footer = () => {


    return (
        <footer className="footer-dark shadow-lg mt-4 p-5">
            <div className="row">
                <div className="col-md-3 mb-3">
                    <h6 className="footer-brand">EL CODIGO, PERFUMERIE</h6>
                    <p className="small footer-desc">El arte de la perfumería, redefinido.</p>
                </div>
                <div className="col-md-3 mb-3">
                    <h6>Ayuda</h6>
                    <ul className="list-unstyled small">
                        <li>Contacto</li>
                        <li>Preguntas Frecuentes</li>
                        <li>Envíos y Devoluciones</li>
                    </ul>
                </div>
                <div className="col-md-3 mb-3">
                    <h6>Compañía</h6>
                    <ul className="list-unstyled small">
                        <li>Sobre Nosotros</li>
                        <li>Políticas de Privacidad</li>
                        <li>Términos y Condiciones</li>
                    </ul>
                </div>
                <div className="col-md-3 mb-3">
                    <h6>Síguenos</h6>
                    <div className="d-flex gap-2">
                        <a href="#" aria-label="instagram" className="social-link">IG</a>
                        <a href="#" aria-label="facebook" className="social-link">FB</a>
                        <a href="#" aria-label="twitter" className="social-link">TW</a>
                    </div>
                </div>
            </div>

            <div className="text-center mt-3 small copyright">
                © {new Date().getFullYear()} EL CÓDIGO, PERFUMERIE. Todos los derechos reservados.
            </div>
        </footer>

    )
}

export default Footer