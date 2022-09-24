import './SharedUsers.css'
import {Fragment, useState} from "react";
import {query, where} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";

function SharedUsers(props){
    const [showInvalid, setShowInvalid] = useState(false);
    let filteredEdit = props.canEdit.filter((e) => (e !== props.owner));
    let filteredView = props.canView.filter((e) => (!props.canEdit.includes(e)))
    let userEmails = [];

    const collectionRef = props.collectionRef;
    const [validUsers, loadingTest, errorTest] = useCollectionData(query(collectionRef, where('key', '==', 'b97qjRbVqp7TaMiZFdTQ')));
    if (!errorTest && !loadingTest) {
        validUsers?.map((e) => userEmails = e.emails)
    }

    return ( <Fragment >
        {(props.id === props.changeThis) && <div>
            <div id={"nameMessage"}> {props.isOwner? "Share" : "Shared With"} </div>
            {props.isOwner && <div>
                <input id={"shareWithUser"}
                aria-label={"share with user"}
                className={"notebox"}
                type={"text"}
                autoComplete={"off"}
                onKeyDown={(e) => {if (e.key === 'Enter') {
                    if (userEmails.includes(document.getElementById("shareWithUser").value)) {
                        props.onListShared(props.changeThis,
                            document.getElementById('shareWithUser').value,
                            document.getElementById('permission').value);
                        document.getElementById("shareWithUser").value = "";
                        setShowInvalid(false);
                    } else{
                        setShowInvalid(true);
                    }
                }if (e.key === 'Escape') {
                    props.setShowRename(false);
                    props.setChangeThis("");
                }}}/>
                {showInvalid &&
                    <div id={"invalidUser"}>
                        <span>Invalid user</span>
                    </div>
                }
                <select id={"permission"}>
                    <option>Editor</option>
                    <option>Viewer</option>
                </select>
            </div>
            }
            <div>Owned by: {props.owner}</div>
            <div id={"shareDiv"}>
        {((filteredEdit.length) > 0) && <div className={(filteredView.length) === 0 ? "sharedBoxes2" : "sharedBoxes"}>
            <span className={"shareTitles"}> Editors </span>
            <ul className={"shareList"}>
        {filteredEdit.map((data) =>
            <li className={"user"} key={data}>
                {props.isOwner &&
                    <button aria-label={"remove user"}
                            id={"removeButton"}
                            onClick={() => props.updateSharing(props.id, data, 'Editor')}
                            className={"editPerm"}>
                        X
                    </button>
                }
                {data}
            </li>,
            )}
            </ul>
            </div>}
        {((filteredView.length) > 0) && <div className={(filteredEdit.length) === 0 ? "sharedBoxes2" : "sharedBoxes"}>
            <span className={"shareTitles"}> Viewers</span>
            <ul className={"shareList"}>
        {filteredView.map((data) =>
            <li className={"user"} key={data}> {props.isOwner && <button id={"removeButton"} onClick={() => props.updateSharing(props.id, data, 'Viewer')}>X</button>} {data}</li>
            )}
            </ul>
            </div>}
            </div>
        </div>}</Fragment>)
}


export default SharedUsers;
