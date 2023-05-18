import { useState } from "react";
import { authService, firebaseInstance } from "../firebaseInstance";
import SignUpModal from "../components/login_page/SignUpModal";

function LoginPage({ frontSocket }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signUpOpen, setSignUpOpen] = useState(false);

    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        let data;

        try {
            data = await authService.signInWithEmailAndPassword(
                email,
                password
            );
        } catch (err) {
            console.error("Email login failed: ", err);
        }
    };

    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;

        let provider;

        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }

        const data = await authService.signInWithPopup(provider);
        frontSocket.emit("socialLogin", data.user.uid);
    };

    const showSignUpModal = () => {
        setSignUpOpen(true);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    name="email"
                    type="email"
                    placeholder="이메일"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input type="submit" />
            </form>
            <div>
                <button onClick={onSocialClick} name="google">
                    Google 계정으로 계속하기
                </button>
            </div>
            <button onClick={showSignUpModal}>회원가입</button>
            {signUpOpen && (
                <SignUpModal
                    setSignUpOpen={setSignUpOpen}
                    frontSocket={frontSocket}
                />
            )}
        </div>
    );
}

export default LoginPage;
