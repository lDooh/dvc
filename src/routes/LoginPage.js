import { useState } from "react";
import { authService, firebaseInstance } from "../firebaseInstance";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();
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
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <p>이메일 비밀번호</p>
            </form>
            <div>
                <button onClick={onSocialClick} name="google">
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
