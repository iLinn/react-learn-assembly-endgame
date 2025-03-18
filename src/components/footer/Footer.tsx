import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer>
            <small> Created by ILinn @ {currentYear}</small>
        </footer>
    );
}

export default Footer;