import { useNavigate } from "react-router";
import { authService } from "../../firebaseInstance";
import styles from "./SignUpModal.module.css";
import { useState } from "react";

function SignInModal({ setSignUpOpen, frontSocket }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        } else if (name === "password2") {
            setPassword2(value);
        } else if (name === "nickname") {
            setNickname(value);
        }
    };

    const closeSignUpModal = async () => {
        setSignUpOpen(false);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if (password !== password2) {
            alert("비밀번호가 같지 않습니다.");
            return;
        }

        let data;
        try {
            data = await authService.createUserWithEmailAndPassword(
                email,
                password
            );
        } catch (err) {
            console.error("Sign up failed: ", err);
            alert("회원가입에 실패하였습니다.");
            return;
        }

        frontSocket.emit("emailSignUp", data.user.uid, password, nickname);
        alert("회원가입에 성공하였습니다.");
        navigate("/", { replace: true });
    };

    return (
        <div className={styles.outside} onClick={closeSignUpModal}>
            <div
                className={styles.container}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={closeSignUpModal}>←</button>
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
                    <input
                        name="password2"
                        type="password"
                        placeholder="비밀번호 재입력"
                        required
                        value={password2}
                        onChange={onChange}
                    />
                    <input
                        name="nickname"
                        type="text"
                        placeholder="닉네임"
                        required
                        value={nickname}
                        onChange={onChange}
                    />
                    <input type="submit" value="회원가입" />
                </form>
            </div>
        </div>
    );
}

export default SignInModal;
