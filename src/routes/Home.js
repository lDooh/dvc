import Profile from "../components/Profile";

function Home({ userObj }) {
    return (
        <>
            <h1>Home</h1>
            <Profile userObj={userObj} />
        </>
    );
}

export default Home;
