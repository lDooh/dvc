import Notifications from "../components/Notifications";
import Profile from "../components/Profile";
import RoomList from "../components/RoomList";
import styles from "./Home.module.css";

function Home({ userObj }) {
    return (
        <div className={styles.container}>
            <div className={[styles.home, styles.home1].join(" ")}>
                <Profile userObj={userObj} />
            </div>
            <div className={[styles.home, styles.home2].join(" ")}>
                <RoomList />
            </div>
            <div className={[styles.home, styles.home3].join(" ")}>
                <Notifications />
            </div>
        </div>
    );
}

export default Home;
