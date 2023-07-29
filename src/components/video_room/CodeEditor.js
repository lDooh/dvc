import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import { useEffect, useRef, useState } from "react";
import { firebaseDatabase } from "../../firebaseInstance";

function CodeEditor({ roomId }) {
    const textareaRef = useRef(null);
    const codeMirrorRef = useRef(null);
    const [code, setCode] = useState("");

    useEffect(() => {
        codeMirrorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
            mode: "javascript",
            theme: "default",
            lineNumbers: true,
            styleActiveLine: true, // CodeMirror 스타일을 활성화한 경우
            styleActiveLineBackground: "yellow", // 활성화된 줄의 배경색 설정
        });

        codeMirrorRef.current.setSize(null, "100vh");

        codeMirrorRef.current.on("change", (instance) => {
            const value = instance.getValue();
            const documentRef = firebaseDatabase.ref(`codes/${roomId}`);
            documentRef.set({ value });
        });

        firebaseDatabase
            .ref(`codes/${roomId}/value`)
            .on("value", (snapshot) => {
                const text = snapshot.val();
                const cursor = codeMirrorRef.current.getCursor(); // 현재 커서 위치 저장
                codeMirrorRef.current.setValue(text);
                codeMirrorRef.current.setCursor(cursor); // 커서 위치 복원
            });
    }, []);

    return (
        <div>
            <textarea ref={textareaRef} value={code} />
        </div>
    );
}

export default CodeEditor;
