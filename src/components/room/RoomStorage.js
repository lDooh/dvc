import { useEffect, useState } from "react";
import styles from "./RoomStorage.module.css";
import { firebaseStorage } from "../../firebaseInstance";

function RoomStorage({ roomId, userObj }) {
    const [fileList, setFileList] = useState([]);

    function getFormatDate() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    useEffect(() => {
        (async () => {
            const listResult = await firebaseStorage
                .ref()
                .child(`${roomId}`)
                .listAll();

            const files = await Promise.all(
                listResult.items.map(async (item) => {
                    const metadata = await item.getMetadata();
                    const customMetadata = metadata.customMetadata;
                    return {
                        filename: item.name,
                        uploadDate: customMetadata.uploadDate,
                        uploader: customMetadata.uploader,
                    };
                })
            );
            setFileList(files);
            // console.log("파일들: ", files);
        })();
    }, []);

    const onFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const uploadTask = firebaseStorage
            .ref()
            .child(`${roomId}/${file.name}`)
            .put(file, {
                customMetadata: {
                    uploadDate: getFormatDate(),
                    uploader: userObj.displayName,
                },
            });

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (err) => {
                // Handle unsuccessful uploads
                console.error("File upload error: ", err);
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                /* getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                }); */
                console.log("File upload Completed.");
            }
        );

        event.target.value = null;
    };

    const onClick = (event) => {
        document.getElementById("file-input").click();
    };

    const onFileClick = async (filename) => {
        try {
            const fileRef = firebaseStorage.ref(`${roomId}/${filename}`);
            const url = await fileRef.getDownloadURL();
            const response = await fetch(url);
            const blob = await response.blob();

            // Create a virtual link for saving file.
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = filename;

            // Click the virtual link.
            downloadLink.click();

            // Remove virtual link.
            URL.revokeObjectURL(downloadLink.href);
        } catch (err) {
            console.error("File download error: ", err);
        }
    };

    return (
        <div className={styles["container"]}>
            <table className={styles["container"]}>
                <tr>
                    <th
                        className={[styles["item"], styles["file-name"]].join(
                            " "
                        )}
                    >
                        파일 이름
                    </th>
                    <th
                        className={[styles["item"], styles["file-date"]].join(
                            " "
                        )}
                    >
                        수정 일시
                    </th>
                    <th
                        className={[
                            styles["item"],
                            styles["file-uploader"],
                        ].join(" ")}
                    >
                        게시자
                    </th>
                </tr>
                <tbody>
                    {fileList.map((fileObj, index) => (
                        <tr key={index}>
                            <td
                                onClick={() => onFileClick(fileObj.filename)}
                                className={styles["item"]}
                            >
                                {fileObj.filename}
                            </td>
                            <td className={styles["item"]}>
                                {fileObj.uploadDate}
                            </td>
                            <td className={styles["item"]}>
                                {fileObj.uploader}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={3} className={styles["foot"]}>
                            <input
                                type="file"
                                id="file-input"
                                onChange={onFileChange}
                                className={styles["hidden"]}
                            />
                            <button onClick={onClick}>파일 업로드</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default RoomStorage;
