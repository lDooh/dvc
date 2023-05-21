import Notifications from "../components/home/Notifications";
import Profile from "../components/home/Profile";
import RoomList from "../components/home/RoomList";
import styles from "./Home.module.css";

function Home({ userObj }) {
    return (
        <div className={styles.container}>
            <div className={[styles.home, styles.home1].join(" ")}>
                <Profile userObj={userObj} />
            </div>
            <div className={[styles.home, styles.home2].join(" ")}>
                <RoomList userObj={userObj} />
            </div>
            <div className={[styles.home, styles.home3].join(" ")}>
                <Notifications />
            </div>
        </div>
    );
}

export default Home;
