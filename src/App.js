import ListView from "./ListView";
import HomeView from "./HomeView";
import {useState} from 'react';
import {initializeApp} from "firebase/app";
import {arrayUnion, doc, getFirestore, updateDoc} from "firebase/firestore";
import {useAuthState} from 'react-firebase-hooks/auth';
import {getAuth} from "firebase/auth";
import './App.css';
import SignInAndSignUp from "./SignInAndSignUp";

const firebaseConfig = {
    apiKey: "AIzaSyDlfim9PmxloCfyskIlZd6xt2RxlWem-kw",
    authDomain: "cs124-lab3-fe950.firebaseapp.com",
    projectId: "cs124-lab3-fe950",
    storageBucket: "cs124-lab3-fe950.appspot.com",
    messagingSenderId: "331313494047",
    appId: "1:331313494047:web:cab4818df13adc8c9cfd2a"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
let collectionName = "Lists"; // collection for each list passed in from ListView
let userDocName = "b97qjRbVqp7TaMiZFdTQ"; // document id that contains our list of registered user emails

function App() {
    const auth = getAuth();
    const [user, loading, error] = useAuthState(auth);
    const [showUserField, setShowUserField] = useState("");

    // updates active field
    function handleShowUserField(value) {
        if (value === showUserField){
            setShowUserField("")
        } else{
            setShowUserField(value);
        }
    }

    // updates the list of all users
    function handleUpdateUserDoc(userEmail) {
        void updateDoc(doc(db, collectionName, userDocName),
            {
                emails: arrayUnion(userEmail)
            })
        }

    if (error) {
        console.log("ERROR: Page failed to load")
    }

    if (loading) {
        return (
            <div id={"loading"}> Loading... </div>
        )
    }

    // if user signs in successfully then their email is added to all users list, and they see the signed in page
    if (user) {
        handleUpdateUserDoc(user.email)
        return (
            <div>
                <SignedInApp user={user} auth={auth} handleUpdateUserDoc={handleUpdateUserDoc}/>
            </div>
        )
    } else {
        // Menu before a user has signed in
        return (
            <div id={"signInPage"}>
                <div id={"signInBox"}>
                    <h1 id={"loginTitle"}>Welcome to our notes app!</h1>
                    <div id={"buttons"}>
                        <SignInAndSignUp
                            auth={auth}
                            showUserField={showUserField}
                            handleShowUserField={handleShowUserField}
                            handleUpdateUserDoc={handleUpdateUserDoc}/>
                    </div>
                    <p id={"authors"}>Created by: Christian and Chris</p>
                </div>
                <img id={"notesPreview"} alt={"Notes app preview"}/>
            </div>
        )
    }
}


function SignedInApp(props) {
    const [listId, setListId] = useState(0);
    const [listView, setListView] = useState(false);
    const [title,setTitle] = useState("");
    const [canView, setCanView] = useState([]);
    const [canEdit, setCanEdit] = useState([]);

    // updates corresponding information when we view a list
   function handleListView(text, newId, canView, canEdit) {
       setTitle(text);
       setListId(newId);
       setCanView(canView);
       setCanEdit(canEdit);
       setListView(!listView);
   }

   // shows user's home page with all their notes when they have not clicked on a particular one
   if(!listView){
        return (<HomeView onListView={handleListView}
                          db={db}
                          user={props.user}
                          auth={props.auth}
                          collection={collectionName}/>)
   } else {
        // shows an individual note
        return (<ListView
            onListView={handleListView}
            title={title}
            listId={listId}
            canView={canView}
            canEdit={canEdit}
            db={db}
            user={props.user}
            collection={collectionName}/>)
   }
}

export default App;