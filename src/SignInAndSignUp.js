import {
    useSignInWithEmailAndPassword,
    useSignInWithGoogle,
    useSendPasswordResetEmail,
    useCreateUserWithEmailAndPassword
} from "react-firebase-hooks/auth";
import {useState} from 'react';
import './SignInAndSignUp.css'

function SignInAndSignUp(props) {

    const [signInWithEmailAndPassword, , , errorSignIn] = useSignInWithEmailAndPassword(props.auth)
    const [signInWithGoogle] = useSignInWithGoogle(props.auth)
    const [sendPasswordResetEmail] = useSendPasswordResetEmail(props.auth)
    const [emailSignIn, setEmailSignIn] = useState("");
    const [passwSignIn, setPasswordSignIn] = useState("");
    const [showForgotPass, setShowForgotPass] = useState(false);
    const [createUserWithEmailAndPassword, , , errorCreate] = useCreateUserWithEmailAndPassword(props.auth)
    const [emailSignUp, setEmailSignUp] = useState("");
    const [passwSignUp, setPasswordSignUp] = useState("");


    return (
        <div id={"buttonGrid"}>
            <div id={"signInButton"}>
                <button id={"signIn"} className={ props.showUserField === "signIn" ? "clickedBigButton" : "bigButtons"} onClick={() => {props.handleShowUserField("signIn")}}>Sign In</button>
            </div>
            <div id={"signUpButton"}>
                <button id={"signUpButton"} className={ props.showUserField === "signUp" ? "clickedBigButton" : "bigButtons"}
                        onClick={() => {props.handleShowUserField("signUp")}}
                >Sign Up</button>
            </div>

            <div id={"buttonInfo"}>
                {props.showUserField === "signIn" && <div id={"popup"}>
                    <div className={"loginLine"}>
                        <input id={"email"} type={"text"} placeholder={"email"} onChange={(e) => setEmailSignIn(e.target.value)}/>
                        <input id={"password"} type={"password"} placeholder={"password"} onChange={(e) => setPasswordSignIn(e.target.value)}/>
                        <button id={"logInButton"} className={"bigButtons"} onClick={() => signInWithEmailAndPassword(emailSignIn, passwSignIn)}>Log in</button>
                        {errorSignIn && (errorSignIn.code=== 'auth/invalid-email') && <p  className={"loginError"}>Invalid email</p>}
                        {errorSignIn && (errorSignIn.code === 'auth/wrong-password') && <p className={"loginError"}>Incorrect password</p>}
                    </div>
                    <div id={"forgotPassDiv"}>
                        <button id={"forgotPass"} onClick={() => setShowForgotPass(true)}>Forgot password?</button>
                    </div>
                </div>
                }
                {showForgotPass && <div>
                    <div>
                        <div id={"back"} onClick={() => {
                            setShowForgotPass(false);
                        }}/>
                        <div id={"warning"}>
                            <div id={"forgotWarning"}>Submit your email</div>
                            <input id={"emailBox"}
                                   type={"text"}
                                   placeholder={"email"}
                                   onKeyDown={(e) => {if (e.key === 'Enter') {
                                       void sendPasswordResetEmail(document.getElementById('emailBox').value);
                                       setShowForgotPass(false);
                                   }if (e.key === 'Escape') {
                                       setShowForgotPass(false);
                                   }
                                   }}/>
                            <div>You will receive an email to reset your password</div>

                        </div>
                    </div>
                </div>}
        <div>
            {props.showUserField === "signUp" &&
                <div className={"loginLine"}>
                    <input id="email" type={"text"} placeholder={"email"} onChange={(e) => setEmailSignUp(e.target.value)}/>
                    <input id="password" type={"password"} placeholder={"password"} onChange={(e) => setPasswordSignUp(e.target.value)}/>
                    <button  id={"registerButton"}
                             className={"bigButtons"} onClick={() => {
                        void createUserWithEmailAndPassword(emailSignUp, passwSignUp)
                    }}>Register
                    </button>
                    <div id={"spacingDiv"}/>
                    {errorCreate && (errorCreate.code=== 'auth/invalid-email') && <p className={"loginError"}>Try another email</p>}
                </div>
                }
        </div>
                {(props.showUserField === "signUp" || props.showUserField === "signIn") && <div id={"googleButton"}>

                    <button className={"bigButtons"}  onClick={() => signInWithGoogle() }> <img id={"googleLogo"} alt={""} src={"https://aws1.discourse-cdn.com/auth0/optimized/3X/8/a/8a06490f525c8f65d4260204bc3bc7b0e1fb0ba7_2_500x500.png"}/> Log In With Google</button>
                </div>}
            </div>
        </div>
    )

}
export default SignInAndSignUp
