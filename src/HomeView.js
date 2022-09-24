import './HomeView.css'
import ListBox from "./ListBox";
import SharedUsers from "./SharedUsers";
import {collection, setDoc, doc, updateDoc, deleteDoc, query, arrayRemove, arrayUnion, orderBy} from "firebase/firestore";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {useState} from "react";
import {signOut} from "firebase/auth";
import {useCollectionData} from "react-firebase-hooks/firestore";


function HomeView(props) {
    const [showName, setShowName] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [changeThis, setChangeThis] = useState("")
    const [showRename, setShowRename] = useState(false)
    const [showRemove, setShowRemove] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const collectionRef = collection(props.db, props.collection);
    const [lists, loading, error] = useCollectionData(query(collectionRef, orderBy('key')));

    if (error) {
        console.log("ERROR: List data failed to load from Firestore")
        console.log(error.code)
    }

    // Creates a new note
    function handleListAdded(listName) {
        let listId = generateUniqueID();
        setShowName(false)
        void setDoc(doc(props.db, props.collection, listId),
            {
                key: listId,
                name: listName,
                owner: props.user.email,
                canView: [props.user.email],
                canEdit: [props.user.email]
            })
    }

    // Deletes note forever
    function handleListDeleted(listId) {
        setChangeThis("");
        setShowDelete(!showDelete)
        void deleteDoc(doc(props.db, props.collection, listId));
    }

    // Removes note from viewer's home page
    function handleListRemoved(listId) {
        setChangeThis("");
        setShowRemove(!showRemove)
        void updateDoc(doc(props.db, props.collection, listId),
            {
                canView: arrayRemove(props.user.email)
            })
    }

    // Renames note
    function handleListRenamed(listId, newName) {
        setChangeThis("")
        setShowRename(!showRename)
        void updateDoc(doc(props.db, props.collection, listId),
            {
                name: newName,
            })
    }

    // Adds permission for a user to view and/or edit a note when it is shared with them based on the type of share
    function handleListShared(listId, shareUser, shareType) {
        if (shareType==="Editor") {
            void updateDoc(doc(props.db, props.collection, listId),
                {
                    canEdit: arrayUnion(shareUser)
                })
        }
        void updateDoc(doc(props.db, props.collection, listId),
            {
                canView: arrayUnion(shareUser)
            })
    }

    // Handles when someone's sharing type is removed
    function handleUpdateSharing(listId, shareUser, shareType) {
        if (shareType==="Editor") {
            void updateDoc(doc(props.db, props.collection, listId),
                {
                    canEdit: arrayRemove(shareUser)
                })
        }
        void updateDoc(doc(props.db, props.collection, listId),
            {
                canView: arrayRemove(shareUser)
            })
    }

    // Control states for displaying warnings
    function handleDeleteToggle() {
        setShowDelete(!showDelete);
    }

    function handleRemoveToggle() {
        setShowRemove(!showRemove);
    }

    function handleRenameToggle() {
        setShowRename(!showRename);
    }

    function handleShareToggle() {
        setShowShare(!showShare);
    }

    function handleChangeThisUpdate(listId) {
        setChangeThis(listId)
    }


    if (loading) {
        return <div className={"homeLoading"}>Loading...
        </div>;
    }

    return (<div id="homepage">
                {/*Home Page Header*/}
                <div id="titled">
                    <button id="settings"
                            tabIndex={(showName || showDelete || showRename || showShare) ? -1 : 0}
                            aria-label={"settings"}>
                        <div>
                            <img    id={"cogwheel"}
                                    src="https://icon-library.com/images/white-gear-icon-png/white-gear-icon-png-7.jpg"
                                    tabIndex={-1}
                                    alt={"cog"}/>
                        </div>
                    </button>
                    <h1 tabIndex={(showName || showDelete || showRename || showShare) ? -1 : 0}
                        className={"header"}> Notes </h1>
                    <div id={"logOut"}>
                        <span> {props.user.email} </span>
                        <button tabIndex={(showName || showDelete || showRename || showShare) ? -1 : 0}
                                onClick={() => signOut(props.auth)}>Log Out</button>
                    </div>
                </div>

                {/*Displays lists on homepage*/}
                <div id={"bottom-part"}>
                    <div id="bottom-flex" >
                        {lists?.map((data) => data.key !== 'b97qjRbVqp7TaMiZFdTQ' ?
                            <ListBox key = {data.key}
                                     id = {data.key}
                                     name = {data.name}
                                     canViewList = {data.canView}
                                     canEditList = {data.canEdit}
                                     onListView = {props.onListView}
                                     isOwner = {data.owner === props.user.email}
                                     canEdit = {data.canEdit.includes(props.user.email)}
                                     canView = {data.canView.includes(props.user.email)}
                                     changeThis = {changeThis}
                                     showDelete = {showDelete}
                                     showRename = {showRename}
                                     showShare = {showShare}
                                     showName = {showName}
                                     onDeleteToggle = {handleDeleteToggle}
                                     onRemoveToggle = {handleRemoveToggle}
                                     onRenameToggle = {handleRenameToggle}
                                     onShareToggle = {handleShareToggle}
                                     onChangeThisUpdate = {handleChangeThisUpdate}
                                     popup={(showName || showDelete || showRename || showShare)}
                            /> : <div/>)}
                    </div>
                </div>

                {/*Plus button to add a new note*/}
                <button id="addnotebutton"
                        className={"circleButton"}
                        tabIndex={(showName || showDelete || showRename || showShare) ? -1 : 0}
                        aria-label={"add note"} onClick={() => setShowName(!showName)}>
                    <div>+</div>
                </button>

                {/*Displays delete warning*/}
                {showDelete && <div>
                    <div>

                        {/*Background can be clicked to make warning disappear*/}
                        <div id={"back"} onClick={() => {
                            setShowDelete(false);
                            setChangeThis("");
                        }}/>

                        {/*Warning box*/}
                        <div id={"warning"}>
                            <div>
                                This note will be <font color={"red"}>permanently deleted</font>.
                                Are you sure you want to do this?
                            </div>
                            <div id={"warningButtons"}>
                                <button id={"no"} className={"warningOption"} tabIndex={0} onClick={() => {
                                    setShowDelete(false);
                                    setChangeThis("");
                                    }}>No, Go Back</button>
                                <button id={"yes"} className={"warningOption"} tabIndex={0} onClick={() => handleListDeleted(changeThis)}>Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                </div>}

                {/*Displays remove warning*/}
                {showRemove && <div>
                    <div>
                        <div id={"back"} onClick={() => {
                            setShowRemove(false);
                            setChangeThis("");
                        }}/>
                        <div id={"warning"}>
                            <div>
                                This note will be <font color={"red"}>permanently removed</font> from your notes.
                                It will not be removed for other users. Are you sure you want to do this?
                            </div>
                            <div id={"warningButtons"}>

                                <button id={"no"} className={"warningOption"} tabIndex={0} onClick={() => {
                                    setShowRemove(false);
                                    setChangeThis("");
                                }}>No, Go Back</button>
                                <button id={"yes"} className={"warningOption"} tabIndex={0} onClick={() => handleListRemoved(changeThis)}>Yes, Remove</button>

                            </div>
                        </div>
                    </div>
                </div>}

                {/*Displays new note creation popup*/}
                {showName && <div>
                    <div>
                        <div id={"back"} onClick={() => setShowName(false)}/>
                        <div id={"warning"}>
                            <div id={"nameMessage"}> Name your note and press 'Enter' to confirm. </div>
                            <div>(Max. 25 characters)</div>
                            <input id={"createNoteBox"}
                                   className={"notebox"}
                                   type={"text"}
                                   maxLength={25}
                                   autoComplete={"off"}
                                   onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                            handleListAdded(document.getElementById('createNoteBox').value)
                                        }
                                       if (e.key === 'Escape') {
                                           setShowName(false);
                                           setChangeThis("");
                                       }
                                   }}/>
                            </div>
                        </div>
                    </div>}

                {/*Displays renaming warning*/}
                {showRename && <div>
                    <div>
                        <div id={"back"} onClick={() => {
                            setShowRename(false);
                            setChangeThis("");
                        }}/>
                        <div id={"warning"}>
                            <div id={"nameMessage"}> Rename the selected note and press 'Enter' to confirm.</div>
                            <div>(Max. 25 characters)</div>
                            <input id={"renameNote"}
                                   className={"notebox"}
                                   type={"text"}
                                   maxLength={25}
                                   autoComplete={"off"}
                                   onKeyDown={(e) => {if (e.key === 'Enter') {
                                       handleListRenamed(changeThis, document.getElementById('renameNote').value)
                                   }if (e.key === 'Escape') {
                                       setShowRename(false);
                                       setChangeThis("");
                                   }
                                   }}/>

                        </div>
                    </div>
                </div>}

                {/*Displays sharing popup*/}
                {showShare && <div>
                    <div>
                        <div id={"back"} onClick={() => {
                            setShowShare(false);
                            setChangeThis("");
                        }}/>
                        <div id={"warning"}>

                            {/*Shows only shared users for this note*/}
                            {lists?.map((data) => data.key !== 'b97qjRbVqp7TaMiZFdTQ' ?
                                <SharedUsers changeThis={changeThis}
                                             id={data.key}
                                             owner={data.owner}
                                             isOwner = {data.owner === props.user.email}
                                             collectionRef={collectionRef}
                                             updateSharing = {handleUpdateSharing}
                                             onListShared = {handleListShared}
                                             canView={data.canView}
                                             canEdit={data.canEdit}
                                             setShowRename = {setShowRename}
                                             setChangeThis = {setChangeThis}
                                /> : <div/>)}

                        </div>
                    </div>
                </div>}
        </div>)
    }

export default HomeView;