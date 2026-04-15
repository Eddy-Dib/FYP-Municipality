import styles from "./Map.module.css";
function Map() {
    return (
        <div className={styles.mapSection}>
            <iframe
                title="map"
                src="https://maps.google.com/maps?q=beirut&t=&z=13&ie=UTF8&iwloc=&output=embed"
                frameBorder={0}
                allowFullScreen="">
            </iframe>
        </div>
    );
}
export default Map;