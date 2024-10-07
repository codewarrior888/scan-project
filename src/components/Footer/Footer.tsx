import scan from "../../assets/images/scan-logo-white.png";
import "../../styles/Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <img src={scan} alt="Logo" className="footer-logo" />
      <div className="footer-info">
        <p className="footer-address">
          г. Москва, Цветной б-р, 40 <br />
          <a className="footer-link" href="tel:+74957712111">
            +7 495 771 21 11
          </a>
          <br />
          <a className="footer-link" href="mailto:info@skan.ru">
            info@skan.ru
          </a>
        </p>
        <p className="footer-copyright">Copyright. 2024</p>
      </div>
    </footer>
  );
}
